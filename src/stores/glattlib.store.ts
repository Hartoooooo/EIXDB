/**
 * GlattLib Pinia Store
 *
 * Verwaltet den lokalen Positions-State (Map<ISIN, GlattPositionData>),
 * empfängt Delta-Updates via SignalR und leitet die Gruppierungslogik ab.
 *
 * Lifecycle:
 *   - connect()    → aus Dashboard.vue onMounted aufrufen
 *   - disconnect() → aus Dashboard.vue onUnmounted aufrufen
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GlattPositionData, GlattCategoryGroup, RawGlattPosition, GlattState } from '@/types/glattlib'
import { glattLibService } from '@/services/glattlib.service'
import { getCategoryForIsin } from '@/services/category-lookup.service'

const UNCATEGORIZED_LABEL = 'Unkategorisiert'
const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL as string | undefined

/** ProfitPercent = Profit / (Value - Profit) * 100 */
function calcProfitPct(value: number | null, profit: number | null): number | null {
  if (value === null || profit === null) return null
  const costBasis = value - profit
  if (costBasis === 0) return null
  return (profit / costBasis) * 100
}

function mapRaw(isin: string, raw: RawGlattPosition): GlattPositionData {
  return {
    isin,
    size: raw.bidAskTotalQty,
    value: raw.value,
    profit: raw.profit,
    profitPct: calcProfitPct(raw.value, raw.profit),
    category: getCategoryForIsin(isin),
  }
}

export const useGlattLibStore = defineStore('glattlib', () => {
  /** Lokaler Positions-State: ISIN → normierte Position */
  const positionsMap = ref(new Map<string, GlattPositionData>())

  /** Aktueller GlattLib-Server-Status */
  const glattState = ref<GlattState | null>(null)

  /** Verbindungsstatus der SignalR-Verbindung */
  const connectionStatus = ref<'connected' | 'connecting' | 'disconnected' | 'error'>(
    'disconnected'
  )

  /** Fehlermeldung bei Verbindungsproblemen */
  const connectionError = ref<string | null>(null)

  // ─── Event-Handler ───────────────────────────────────────────────────────

  /**
   * Verarbeitet eingehende OnPositions-Delta-Updates:
   * - null-Value → ISIN aus State entfernen
   * - sonst      → Upsert (hinzufügen oder überschreiben)
   */
  function handlePositionsUpdate(updates: Record<string, RawGlattPosition | null>): void {
    const map = new Map(positionsMap.value)
    for (const [isin, raw] of Object.entries(updates)) {
      if (raw === null) {
        map.delete(isin)
      } else {
        map.set(isin, mapRaw(isin, raw))
      }
    }
    positionsMap.value = map
  }

  function handleGlattState(state: GlattState): void {
    glattState.value = state
  }

  // ─── Verbindungs-Lifecycle ────────────────────────────────────────────────

  async function connect(): Promise<void> {
    if (!HUB_URL) {
      connectionError.value =
        'VITE_SIGNALR_HUB_URL ist nicht konfiguriert (siehe .env.example).'
      connectionStatus.value = 'error'
      return
    }

    connectionStatus.value = 'connecting'
    connectionError.value = null

    glattLibService.onPositions(handlePositionsUpdate)
    glattLibService.onGlattState(handleGlattState)

    try {
      await glattLibService.connect(HUB_URL)
      connectionStatus.value = 'connected'
    } catch (e) {
      connectionStatus.value = 'error'
      connectionError.value = e instanceof Error ? e.message : 'Verbindungsfehler'
      glattLibService.offPositions(handlePositionsUpdate)
      glattLibService.offGlattState(handleGlattState)
    }
  }

  async function disconnect(): Promise<void> {
    glattLibService.offPositions(handlePositionsUpdate)
    glattLibService.offGlattState(handleGlattState)
    await glattLibService.disconnect()
    connectionStatus.value = 'disconnected'
  }

  // ─── Berechnete Gruppen-Struktur ──────────────────────────────────────────

  /**
   * Leitet aus positionsMap die gruppierten Kategorie-Karten ab:
   * 1. Positionen nach Kategorie gruppieren
   * 2. Innerhalb jeder Gruppe: absteigend nach Value sortieren (null ans Ende)
   * 3. Gruppen nach Gesamt-Value absteigend sortieren
   * 4. "Unkategorisiert" immer zuletzt
   */
  const categorizedGroups = computed<GlattCategoryGroup[]>(() => {
    const groupMap = new Map<string, GlattPositionData[]>()

    for (const position of positionsMap.value.values()) {
      const key = position.category ?? UNCATEGORIZED_LABEL
      const existing = groupMap.get(key)
      if (existing) {
        existing.push(position)
      } else {
        groupMap.set(key, [position])
      }
    }

    const groups: GlattCategoryGroup[] = []

    for (const [category, positions] of groupMap.entries()) {
      const sortedPositions = [...positions].sort((a, b) => {
        if (a.value === null && b.value === null) return 0
        if (a.value === null) return 1
        if (b.value === null) return -1
        return b.value - a.value
      })

      const totalValue = positions.reduce((sum, p) => sum + (p.value ?? 0), 0)
      const totalProfit = positions.reduce((sum, p) => sum + (p.profit ?? 0), 0)

      groups.push({
        category,
        isUncategorized: category === UNCATEGORIZED_LABEL,
        positions: sortedPositions,
        totalValue,
        totalProfit,
      })
    }

    groups.sort((a, b) => {
      if (a.isUncategorized) return 1
      if (b.isUncategorized) return -1
      return b.totalValue - a.totalValue
    })

    return groups
  })

  /** true wenn der GlattLib-Server im Status "Running" ist */
  const isServerRunning = computed(() => glattState.value === 'Running')

  /**
   * Pro-Kategorie-Aggregat: Long-Wert, Short-Wert und Top-5-Positionen nach |Value|.
   * Key = Kategorie-String (z. B. "gold"), wie er vom Kategorie-Lookup-Service kommt.
   */
  const categoryAggregates = computed(() => {
    const result = new Map<
      string,
      { longValue: number; shortValue: number; topPositions: GlattPositionData[] }
    >()

    const byCategory = new Map<string, GlattPositionData[]>()
    for (const pos of positionsMap.value.values()) {
      const key = pos.category ?? UNCATEGORIZED_LABEL
      const arr = byCategory.get(key) ?? []
      arr.push(pos)
      byCategory.set(key, arr)
    }

    for (const [cat, positions] of byCategory.entries()) {
      const longValue = positions
        .filter(p => p.size > 0)
        .reduce((s, p) => s + (p.value ?? 0), 0)
      const shortValue = positions
        .filter(p => p.size < 0)
        .reduce((s, p) => s + Math.abs(p.value ?? 0), 0)
      const topPositions = [...positions]
        .sort((a, b) => Math.abs(b.value ?? 0) - Math.abs(a.value ?? 0))
        .slice(0, 5)
      result.set(cat, { longValue, shortValue, topPositions })
    }

    return result
  })

  /** Gesamtwert aller Positionen (Long + Short) */
  const totalPortfolioValue = computed(() =>
    [...positionsMap.value.values()].reduce((sum, p) => sum + (p.value ?? 0), 0)
  )

  /** Gesamtwert aller Long-Positionen (size > 0) */
  const totalLongValue = computed(() =>
    [...positionsMap.value.values()]
      .filter(p => p.size > 0)
      .reduce((sum, p) => sum + (p.value ?? 0), 0)
  )

  /** Gesamtwert aller Short-Positionen (size < 0), als positiver Betrag */
  const totalShortValue = computed(() =>
    [...positionsMap.value.values()]
      .filter(p => p.size < 0)
      .reduce((sum, p) => sum + Math.abs(p.value ?? 0), 0)
  )

  /** Aggregierter Gesamtprofit aller Positionen */
  const totalPortfolioProfit = computed(() =>
    [...positionsMap.value.values()].reduce((sum, p) => sum + (p.profit ?? 0), 0)
  )

  return {
    positionsMap,
    glattState,
    connectionStatus,
    connectionError,
    categorizedGroups,
    categoryAggregates,
    isServerRunning,
    totalPortfolioValue,
    totalLongValue,
    totalShortValue,
    totalPortfolioProfit,
    connect,
    disconnect,
  }
})
