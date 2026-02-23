<template>
  <div class="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm">
    <div class="flex items-center gap-0 overflow-x-auto scrollbar-hide px-2 py-0">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 7" :key="i" class="flex-shrink-0 px-4 py-2.5">
          <LoadingSkeleton height="1.5rem" width="6rem" />
        </div>
      </template>

      <!-- Tickers -->
      <template v-else>
        <div
          v-for="ticker in tickers"
          :key="ticker.symbol"
          class="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-r border-border hover:bg-surface2 transition-colors duration-150 cursor-default group"
        >
          <span class="text-xs font-mono font-semibold text-text-secondary tracking-widest uppercase group-hover:text-text-primary transition-colors">
            {{ ticker.displayName }}
          </span>
          <span class="text-sm font-mono font-semibold text-text-primary tabular-nums">
            {{ formatPrice(ticker.price, ticker.price < 10 ? 4 : ticker.price < 100 ? 2 : 2) }}
          </span>
          <span
            class="text-xs font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded"
            :class="ticker.changePct >= 0
              ? 'text-positive bg-positive/10'
              : 'text-negative bg-negative/10'"
          >
            {{ ticker.changePct >= 0 ? '+' : '' }}{{ ticker.changePct.toFixed(2) }}%
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketTicker } from '@/types/dto'
import { formatPrice } from '@/utils/format'
import LoadingSkeleton from './LoadingSkeleton.vue'

defineProps<{
  tickers: MarketTicker[]
  loading: boolean
}>()
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
