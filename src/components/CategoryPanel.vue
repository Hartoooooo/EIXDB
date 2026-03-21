<template>
  <div
    class="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden"
  >
    <!-- Panel Header -->
    <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold tracking-[0.18em] uppercase text-text-primary">
          {{ title }}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-surface2 border border-border text-text-secondary tracking-wider">4H</span>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-surface2 border border-border text-text-secondary tracking-wider">TICK</span>
      </div>
    </div>

    <!-- Price Block -->
    <div class="flex items-end justify-between px-5 py-4">
      <div>
        <div class="text-xs font-mono text-text-secondary tracking-widest mb-1">{{ symbol }}</div>
        <div v-if="chartLoading" class="mb-1">
          <LoadingSkeleton height="2.25rem" width="9rem" />
        </div>
        <div v-else class="text-3xl font-mono font-bold text-text-primary tabular-nums leading-none">
          {{ formattedPrice }}
        </div>
      </div>
      <div>
        <span
          v-if="!chartLoading"
          class="text-sm font-mono font-semibold px-2.5 py-1 rounded-lg tabular-nums"
          :class="lastChangePct >= 0 ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'"
        >
          {{ lastChangePct >= 0 ? '+' : '' }}{{ lastChangePct.toFixed(2) }}%
        </span>
      </div>
    </div>

    <!-- Mini Chart -->
    <div class="px-4 pb-2">
      <MiniLineChart
        :points="chartPoints"
        :accentColor="accentColor"
        :height="chartHeight"
        :loading="chartLoading"
      />
    </div>

    <!-- Sentiment Gauge (L/S mit Exposure € statt %) -->
    <div class="mx-4 mt-2 mb-2 py-3 border-t border-border">
      <SentimentGauge
        :label="sentimentLabel"
        :longPct="effectiveLongPct"
        :shortPct="effectiveShortPct"
        :long-value="effectiveLongValue"
        :short-value="effectiveShortValue"
        :loading="gaugeLoading"
      />
    </div>

    <!-- Data Table -->
    <div class="mx-4 mb-4 mt-1 pt-3 border-t border-border">
      <DataTableMini
        :title="effectiveTableTitle"
        :rows="effectiveTableRows"
        :loading="tableLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartPoint, PanelTableRow } from '@/types/dto'
import type { GlattPositionData } from '@/types/glattlib'
import { formatPrice, formatCurrencyEUR } from '@/utils/format'
import { CATEGORY_ACCENT } from '@/utils/color'
import MiniLineChart from './MiniLineChart.vue'
import SentimentGauge from './SentimentGauge.vue'
import DataTableMini from './DataTableMini.vue'
import LoadingSkeleton from './LoadingSkeleton.vue'

const props = withDefaults(defineProps<{
  category: 'gold' | 'silver' | 'crypto' | 'platinum' | 'eth' | 'oil'
  title: string
  symbol: string
  sentimentLabel: string
  tableTitle: string
  chartPoints: ChartPoint[]
  tableRows: PanelTableRow[]
  longPct: number
  shortPct: number
  chartLoading?: boolean
  tableLoading?: boolean
  gaugeLoading?: boolean
  chartHeight?: number
  /** Live Long-Value aus GlattLib (€) – wenn gesetzt, überschreibt longPct/shortPct für die Gauge */
  liveLongValue?: number
  /** Live Short-Value aus GlattLib (€) */
  liveShortValue?: number
  /** Long Exposure aus Positions-Aggregat (€) – Fallback wenn keine Live-Daten */
  longEur?: number
  /** Short Exposure aus Positions-Aggregat (€) – Fallback wenn keine Live-Daten */
  shortEur?: number
  /** Top-5-Positionen nach |Value| aus GlattLib – ersetzt die statischen tableRows */
  liveTopPositions?: GlattPositionData[]
}>(), {
  chartLoading: false,
  tableLoading: false,
  gaugeLoading: false,
  chartHeight: 120,
  liveLongValue: undefined,
  liveShortValue: undefined,
  longEur: undefined,
  shortEur: undefined,
  liveTopPositions: undefined,
})

/** Exposure-Werte für L/S in der Gauge: Live-Daten bevorzugt, sonst Aggregat */
const effectiveLongValue = computed(() =>
  props.liveLongValue ?? props.longEur ?? 0
)
const effectiveShortValue = computed(() =>
  props.liveShortValue ?? props.shortEur ?? 0
)

const accentColor = computed(() => CATEGORY_ACCENT[props.category])

const lastChangePct = computed(() => {
  if (props.chartPoints.length < 2) return 0
  const last = props.chartPoints[props.chartPoints.length - 1].value
  const first = props.chartPoints[0].value
  return ((last - first) / first) * 100
})

const formattedPrice = computed(() => {
  if (!props.chartPoints.length) return '—'
  const val = props.chartPoints[props.chartPoints.length - 1].value
  return formatPrice(val, val < 10 ? 4 : 2)
})

/** true wenn Live-Daten aus GlattLib vorhanden sind */
const hasLiveData = computed(() =>
  props.liveLongValue !== undefined || props.liveShortValue !== undefined
)

/** Gauge-Prozente: aus Live-EUR-Werten berechnen, falls vorhanden */
const effectiveLongPct = computed(() => {
  if (!hasLiveData.value) return props.longPct
  const total = (props.liveLongValue ?? 0) + (props.liveShortValue ?? 0)
  if (total === 0) return 50
  return Math.round(((props.liveLongValue ?? 0) / total) * 100)
})

const effectiveShortPct = computed(() => 100 - effectiveLongPct.value)

/** Tabellen-Rows: Live-Top-Positionen haben Vorrang vor statischen Mock-Rows */
const effectiveTableRows = computed<PanelTableRow[]>(() => {
  if (props.liveTopPositions && props.liveTopPositions.length > 0) {
    return props.liveTopPositions.map(p => {
      const val = p.value ?? 0
      const total = Math.abs(val)
      const buy = p.size > 0 ? val : 0
      const sell = p.size < 0 ? total : 0
      return {
        label: p.isin,
        totalExposure: formatCurrencyEUR(total),
        buyExposure: formatCurrencyEUR(buy),
        sellExposure: formatCurrencyEUR(sell),
      }
    })
  }
  return props.tableRows
})

const effectiveTableTitle = computed(() => props.tableTitle)
</script>
