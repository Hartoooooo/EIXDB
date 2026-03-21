<template>
  <div
    class="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden"
  >
    <!-- Filter: nur wenn showFilters=true (nur auf Seite 3) -->
    <div v-if="showFilters" class="px-3 pt-2 pb-2 border-b border-border flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1 shrink-0">
        <span class="text-[8px] font-mono font-semibold tracking-widest text-text-secondary uppercase">R</span>
        <CustomDropdown
          :model-value="modelValue.commodityId"
          :options="commodityOptions"
          @update:model-value="(v) => emitFilter({ commodityId: v as CommodityId })"
        />
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <span class="text-[8px] font-mono font-semibold tracking-widest text-text-secondary uppercase">D</span>
        <CustomDropdown
          :model-value="modelValue.side"
          :options="sideOptions"
          @update:model-value="(v) => emitFilter({ side: v as CommoditySideFilter })"
        />
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <span class="text-[8px] font-mono font-semibold tracking-widest text-text-secondary uppercase">H</span>
        <CustomDropdown
          :model-value="modelValue.leverage"
          :options="leverageOptions"
          @update:model-value="(v) => emitFilter({ leverage: v as CommodityLeverageFilter })"
        />
      </div>
    </div>

    <!-- Panel Header (Rohstoff-Name + G/L/S Exposure) -->
    <div class="px-3 pt-2 pb-2 border-b border-border">
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-text-primary shrink-0 truncate" :title="commodity.name">
          {{ commodity.shortName ?? commodity.name }}
        </span>
        <!-- Desktop: G L S in einer Zeile; Mobile: nur G, L/S unter dem Balken -->
        <ExposureLegend :long-value="totalLong" :short-value="totalShort" :show-only-total="false" class="hidden sm:flex" />
        <ExposureLegend :long-value="totalLong" :short-value="totalShort" :show-only-total="true" class="flex sm:hidden" />
      </div>
      <LongShortBar :long-pct="longPct" />
      <!-- Mobile: L/S unter den jeweiligen Balkenfarben (L links, S rechts) -->
      <div class="flex w-full mt-1 text-[9px] font-mono font-bold tabular-nums sm:hidden">
        <div class="flex justify-start flex-1 min-w-0" :style="{ flex: `${longPct} ${longPct} 0%` }">
          <span class="text-positive">{{ longDisplay }}</span>
        </div>
        <div class="flex justify-end flex-1 min-w-0" :style="{ flex: `${shortPct} ${shortPct} 0%` }">
          <span class="text-negative">{{ shortDisplay }}</span>
        </div>
      </div>
    </div>

    <!-- Price Block -->
    <div class="flex items-end justify-between px-3 py-2">
      <div>
        <div class="text-[9px] sm:text-[10px] font-mono text-text-secondary tracking-widest mb-0.5">{{ commodity.symbol }}</div>
        <div class="text-lg sm:text-xl font-mono font-bold text-text-primary tabular-nums leading-none">
          {{ formattedPrice }}
        </div>
      </div>
      <div>
        <span
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
            :accentColor="commodity.accentColor"
            :height="56"
            :loading="false"
            :hide-labels="true"
            class="sm:hidden h-14"
          />
          <MiniLineChart
            :points="chartPoints"
            :accentColor="commodity.accentColor"
            :height="chartHeight"
            :loading="false"
            class="hidden sm:block"
          />
        </div>
        <!-- Sentiment Gauge: Mobile klein inline, Desktop normal -->
        <div class="shrink-0 flex justify-center sm:w-full sm:pt-2 sm:border-t sm:border-border">
          <SentimentGauge
            :label="`${commodity.shortName ?? commodity.name} SENTIMENT`"
            :longPct="longPct"
            :shortPct="shortPct"
            :long-value="totalLong"
            :short-value="totalShort"
            :loading="false"
            compact
            hide-legend
            hide-label
            extra-compact
            class="sm:hidden"
          />
          <SentimentGauge
            :label="`${commodity.shortName ?? commodity.name} SENTIMENT`"
            :longPct="longPct"
            :shortPct="shortPct"
            :long-value="totalLong"
            :short-value="totalShort"
            :loading="false"
            compact
            hide-legend
            class="hidden sm:block"
          />
        </div>
      </div>
    </div>

    <!-- Data Table: Größte Positionen -->
    <div class="mx-3 mb-3 mt-1 pt-2 border-t border-border">
      <DataTableMini
        title="Größte Positionen"
        :rows="tableRows"
        :loading="false"
        compact
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartPoint, PanelTableRow } from '@/types/dto'
import type { CommodityInfo, CommodityId, CommoditySideFilter, CommodityLeverageFilter } from '@/types/commodity'
import type { CommodityCardFilter } from '@/types/commodity'
import { formatPrice, formatCurrencyEUR } from '@/utils/format'
import { getCommodityPositions, getCommodityChartData, COMMODITY_INFOS } from '@/mocks/mock.commodities'
import CustomDropdown from './CustomDropdown.vue'
import ExposureLegend from './ExposureLegend.vue'
import LongShortBar from './LongShortBar.vue'
import MiniLineChart from './MiniLineChart.vue'
import SentimentGauge from './SentimentGauge.vue'
import DataTableMini from './DataTableMini.vue'

const commodityOptions = COMMODITY_INFOS.map(c => ({ value: c.id, label: c.name }))

const sideOptions = [
  { value: 'ALL' as const, label: 'ALL' },
  { value: 'LONG' as const, label: 'LONG' },
  { value: 'SHORT' as const, label: 'SHORT' },
]
const leverageOptions = [
  { value: 'ALL' as const, label: 'ALL' },
  { value: 'LOW' as const, label: '1–3x' },
  { value: 'MEDIUM' as const, label: '3–10x' },
  { value: 'HIGH' as const, label: '10x+' },
]

const props = withDefaults(defineProps<{
  commodity: CommodityInfo
  modelValue: CommodityCardFilter
  showFilters?: boolean
}>(), {
  showFilters: true,
})

const emit = defineEmits<{ 'update:modelValue': [v: CommodityCardFilter] }>()

function emitFilter(partial: Partial<CommodityCardFilter>) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}

const sideFilter = computed(() => props.modelValue.side)
const leverageFilter = computed(() => props.modelValue.leverage)

const chartHeight = 80

const chartPoints = computed<ChartPoint[]>(() => getCommodityChartData(props.commodity.id))

const lastChangePct = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return 0
  const last = pts[pts.length - 1].value
  const first = pts[0].value
  return ((last - first) / first) * 100
})

const formattedPrice = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return '—'
  const val = pts[pts.length - 1].value
  return formatPrice(val, val < 10 ? 4 : 2)
})

const positions = computed(() =>
  getCommodityPositions(props.commodity.id, sideFilter.value, leverageFilter.value)
)

const totalLong = computed(() => positions.value.reduce((s, p) => s + p.longExposure, 0))
const totalShort = computed(() => positions.value.reduce((s, p) => s + p.shortExposure, 0))

const longPct = computed(() => {
  const total = totalLong.value + totalShort.value
  if (total === 0) return 50
  return Math.round((totalLong.value / total) * 100)
})

const shortPct = computed(() => 100 - longPct.value)

const longDisplay = computed(() => formatCurrencyEUR(totalLong.value))
const shortDisplay = computed(() => formatCurrencyEUR(totalShort.value))

const tableRows = computed<PanelTableRow[]>(() =>
  positions.value.map(p => ({
    label: p.label,
    totalExposure: formatCurrencyEUR(p.totalExposure),
    buyExposure: formatCurrencyEUR(p.longExposure),
    sellExposure: formatCurrencyEUR(p.shortExposure),
  }))
)
</script>
