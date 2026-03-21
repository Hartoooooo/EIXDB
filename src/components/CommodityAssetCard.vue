<template>
  <div
    class="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden"
  >
    <!-- Filter: Custom Dropdowns in einer Zeile -->
    <div class="px-4 pt-3 pb-2 border-b border-border flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="text-[10px] font-mono font-semibold tracking-widest text-text-secondary uppercase">Rohstoff</span>
        <CustomDropdown
          :model-value="modelValue.commodityId"
          :options="commodityOptions"
          @update:model-value="(v) => emitFilter({ commodityId: v as CommodityId })"
        />
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="text-[10px] font-mono font-semibold tracking-widest text-text-secondary uppercase">Seite</span>
        <CustomDropdown
          :model-value="modelValue.side"
          :options="sideOptions"
          @update:model-value="(v) => emitFilter({ side: v as CommoditySideFilter })"
        />
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="text-[10px] font-mono font-semibold tracking-widest text-text-secondary uppercase">Hebel</span>
        <CustomDropdown
          :model-value="modelValue.leverage"
          :options="leverageOptions"
          @update:model-value="(v) => emitFilter({ leverage: v as CommodityLeverageFilter })"
        />
      </div>
    </div>

    <!-- Panel Header (Rohstoff-Name) -->
    <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold tracking-[0.18em] uppercase text-text-primary">
          {{ commodity.name }}
        </span>
      </div>
    </div>

    <!-- Price Block -->
    <div class="flex items-end justify-between px-5 py-4">
      <div>
        <div class="text-xs font-mono text-text-secondary tracking-widest mb-1">{{ commodity.symbol }}</div>
        <div class="text-3xl font-mono font-bold text-text-primary tabular-nums leading-none">
          {{ formattedPrice }}
        </div>
      </div>
      <div>
        <span
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
        :accentColor="commodity.accentColor"
        :height="120"
        :loading="false"
      />
    </div>

    <!-- Sentiment Gauge (L/S mit Exposure €) -->
    <div class="mx-4 mt-2 mb-2 py-3 border-t border-border">
      <SentimentGauge
        :label="`${commodity.name} SENTIMENT`"
        :longPct="longPct"
        :shortPct="shortPct"
        :long-value="totalLong"
        :short-value="totalShort"
        :loading="false"
      />
    </div>

    <!-- Data Table: Größte Positionen -->
    <div class="mx-4 mb-4 mt-1 pt-3 border-t border-border">
      <DataTableMini
        title="Größte Positionen"
        :rows="tableRows"
        :loading="false"
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

const props = defineProps<{
  commodity: CommodityInfo
  modelValue: CommodityCardFilter
}>()

const emit = defineEmits<{ 'update:modelValue': [v: CommodityCardFilter] }>()

function emitFilter(partial: Partial<CommodityCardFilter>) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}

const sideFilter = computed(() => props.modelValue.side)
const leverageFilter = computed(() => props.modelValue.leverage)

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

const tableRows = computed<PanelTableRow[]>(() =>
  positions.value.map(p => ({
    label: p.label,
    totalExposure: formatCurrencyEUR(p.totalExposure),
    buyExposure: formatCurrencyEUR(p.longExposure),
    sellExposure: formatCurrencyEUR(p.shortExposure),
  }))
)
</script>
