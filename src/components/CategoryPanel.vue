<template>
  <div
    class="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden"
  >
    <!-- Panel Header (Titel + G/L/S Exposure) -->
    <div class="px-3 pt-2 pb-2 border-b border-border">
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-text-primary shrink-0">
          {{ title }}
        </span>
        <!-- Desktop: G L S in einer Zeile; Mobile: nur G, L/S unter dem Balken -->
        <ExposureLegend
          :long-value="effectiveLongValue"
          :short-value="effectiveShortValue"
          :show-only-total="false"
          class="hidden sm:flex"
        />
        <ExposureLegend
          :long-value="effectiveLongValue"
          :short-value="effectiveShortValue"
          :show-only-total="true"
          class="flex sm:hidden"
        />
      </div>
      <LongShortBar :long-pct="effectiveLongPct" />
      <!-- Mobile: L/S unter den jeweiligen Balkenfarben (L links, S rechts) -->
      <div class="flex w-full mt-1 text-[9px] font-mono font-bold tabular-nums sm:hidden">
        <div class="flex justify-start flex-1 min-w-0" :style="{ flex: `${effectiveLongPct} ${effectiveLongPct} 0%` }">
          <span class="text-positive">{{ longDisplay }}</span>
        </div>
        <div class="flex justify-end flex-1 min-w-0" :style="{ flex: `${effectiveShortPct} ${effectiveShortPct} 0%` }">
          <span class="text-negative">{{ shortDisplay }}</span>
        </div>
      </div>
    </div>

    <!-- Price Block -->
    <div class="flex items-end justify-between px-3 py-2">
      <div>
        <div class="text-[9px] sm:text-[10px] font-mono text-text-secondary tracking-widest mb-0.5">{{ symbol }}</div>
        <div v-if="chartLoading" class="mb-0.5">
          <LoadingSkeleton height="1.5rem" width="6rem" />
        </div>
        <div v-else class="text-lg sm:text-xl font-mono font-bold text-text-primary tabular-nums leading-none">
          {{ formattedPrice }}
        </div>
      </div>
      <div>
        <span
          v-if="!chartLoading"
          class="text-[9px] sm:text-[10px] font-mono font-semibold px-2 py-0.5 rounded tabular-nums"
          :class="lastChangePct >= 0 ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'"
        >
          {{ lastChangePct >= 0 ? '+' : '' }}{{ lastChangePct.toFixed(2) }}%
        </span>
      </div>
    </div>

    <!-- Chart + Gauge: Mobile nebeneinander, Desktop untereinander -->
    <div class="mx-3 mt-1 border-t border-border pt-2 pb-2 sm:pb-1">
      <div class="flex flex-row sm:flex-col gap-2 sm:gap-0 items-center sm:items-stretch">
        <!-- Mini Chart: Mobile klein ohne Labels, Desktop normal -->
        <div class="flex-1 min-w-0 sm:w-full sm:pb-1">
          <MiniLineChart
            :points="chartPoints"
            :accentColor="accentColor"
            :height="56"
            :loading="chartLoading"
            :hide-labels="true"
            class="sm:hidden h-14"
          />
          <MiniLineChart
            :points="chartPoints"
            :accentColor="accentColor"
            :height="chartHeight"
            :loading="chartLoading"
            class="hidden sm:block"
          />
        </div>
        <!-- Sentiment Gauge: Mobile klein inline, Desktop normal -->
        <div class="shrink-0 flex justify-center sm:w-full sm:pt-2 sm:border-t sm:border-border">
          <SentimentGauge
            :label="sentimentLabel"
            :longPct="effectiveLongPct"
            :shortPct="effectiveShortPct"
            :long-value="effectiveLongValue"
            :short-value="effectiveShortValue"
            :loading="gaugeLoading"
            compact
            hide-legend
            hide-label
            extra-compact
            class="sm:hidden"
          />
          <SentimentGauge
            :label="sentimentLabel"
            :longPct="effectiveLongPct"
            :shortPct="effectiveShortPct"
            :long-value="effectiveLongValue"
            :short-value="effectiveShortValue"
            :loading="gaugeLoading"
            compact
            hide-legend
            class="hidden sm:block"
          />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="mx-3 mb-3 mt-1 pt-2 border-t border-border">
      <DataTableMini
        :title="effectiveTableTitle"
        :rows="effectiveTableRows"
        :loading="tableLoading"
        compact
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
import ExposureLegend from './ExposureLegend.vue'
import LongShortBar from './LongShortBar.vue'
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
  chartHeight: 80,
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

const longDisplay = computed(() => formatCurrencyEUR(effectiveLongValue.value))
const shortDisplay = computed(() => formatCurrencyEUR(effectiveShortValue.value))

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
