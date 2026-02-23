<template>
  <div
    class="w-full"
    :class="[
      aggregates.length > 1 ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : '',
      { 'mt-4': !noMargin }
    ]"
  >
    <!-- Loading -->
    <template v-if="loading">
      <div v-for="i in (aggregates.length > 1 ? 3 : 1)" :key="i" class="rounded-xl bg-surface border border-border p-4">
        <LoadingSkeleton height="5rem" width="100%" />
      </div>
    </template>

    <template v-else>
      <div
        v-for="agg in aggregates"
        :key="agg.category"
        class="rounded-xl bg-surface border border-border p-4 hover:border-border transition-colors duration-150 min-w-0"
      >
        <!-- Category label -->
        <div class="flex items-center gap-2 mb-3">
          <span
            class="text-xs font-mono font-bold tracking-widest uppercase text-text-primary"
          >
            {{ CATEGORY_LABELS[agg.category] }}
          </span>
        </div>

        <!-- Progress bar: dominant side farblich hervorgehoben -->
        <div class="w-full h-2 rounded-full bg-border mb-3 overflow-hidden flex">
          <div
            class="h-full transition-all duration-700"
            :class="agg.longPct >= agg.shortPct ? 'bg-positive' : 'bg-positive/30'"
            :style="{ width: agg.longPct + '%' }"
          />
          <div
            class="h-full transition-all duration-700"
            :class="agg.shortPct > agg.longPct ? 'bg-negative' : 'bg-negative/30'"
            :style="{ width: agg.shortPct + '%' }"
          />
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-0.5">
            <div class="text-[10px] font-mono text-text-secondary/60 tracking-widest uppercase">Long</div>
            <div class="text-sm font-mono font-bold text-positive tabular-nums">{{ agg.longPct }}%</div>
            <div class="text-xs font-mono text-positive/70 tabular-nums">{{ formatCurrencyEUR(agg.longEur) }}</div>
          </div>
          <div class="space-y-0.5 text-right">
            <div class="text-[10px] font-mono text-text-secondary/60 tracking-widest uppercase">Short</div>
            <div class="text-sm font-mono font-bold text-negative tabular-nums">{{ agg.shortPct }}%</div>
            <div class="text-xs font-mono text-negative/70 tabular-nums">{{ formatCurrencyEUR(agg.shortEur) }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PositionAggregate } from '@/types/dto'
import { formatCurrencyEUR } from '@/utils/format'
import LoadingSkeleton from './LoadingSkeleton.vue'

defineProps<{
  aggregates: PositionAggregate[]
  loading: boolean
  noMargin?: boolean
}>()

const CATEGORY_LABELS: Record<string, string> = {
  gold:     'GOLD POSITIONS',
  silver:   'SILVER POSITIONS',
  crypto:   'BITCOIN POSITIONS',
  platinum: 'PLATINUM POSITIONS',
  eth:      'ETH POSITIONS',
  oil:      'OIL POSITIONS',
}
</script>
