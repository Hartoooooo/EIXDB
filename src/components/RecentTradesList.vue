<template>
  <div class="rounded-2xl bg-surface border border-border overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold tracking-widest uppercase text-text-primary">
          {{ title }}
        </span>
        <span class="text-[10px] font-mono text-text-secondary/60 bg-surface2 border border-border px-2 py-0.5 rounded">
          LAST 5
        </span>
      </div>
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest">RECENT TRADES</span>
    </div>

    <!-- Table header -->
    <div class="grid grid-cols-[4rem_4.5rem_2.5rem_auto_5rem_4.5rem] gap-x-3 px-5 py-2 border-b border-border">
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest uppercase">TIME</span>
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest uppercase">SYMBOL</span>
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest uppercase">SIDE</span>
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest uppercase">POSITION</span>
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest uppercase text-right">LAST</span>
      <span class="text-[10px] font-mono text-text-secondary/50 tracking-widest uppercase text-right">CHG%</span>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <div v-for="i in 5" :key="i" class="px-5 py-3 border-b border-border last:border-0">
        <LoadingSkeleton height="1.125rem" width="100%" />
      </div>
    </template>

    <!-- Error -->
    <div v-else-if="error" class="px-5 py-6 text-center text-xs font-mono text-negative/70">
      {{ error }}
    </div>

    <!-- Trades -->
    <template v-else>
      <div
        v-for="trade in trades"
        :key="trade.id"
        class="grid grid-cols-[4rem_4.5rem_2.5rem_auto_5rem_4.5rem] gap-x-3 items-center px-5 py-2.5 border-b border-border last:border-0 hover:bg-surface2/60 transition-colors duration-100"
      >
        <span class="text-[11px] font-mono text-text-secondary/70 tabular-nums">
          {{ formatTimestamp(trade.timestamp) }}
        </span>
        <span class="text-xs font-mono text-text-primary font-medium truncate">
          {{ trade.symbol }}
        </span>
        <span
          class="inline-flex items-center justify-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
          :class="trade.side === 'long'
            ? 'bg-positive/15 text-positive border border-positive/30'
            : 'bg-negative/15 text-negative border border-negative/30'"
        >
          {{ trade.side === 'long' ? 'L' : 'S' }}
        </span>
        <span class="text-[11px] font-mono text-text-secondary truncate">
          {{ trade.positionLabel }}
        </span>
        <span class="text-xs font-mono text-text-primary tabular-nums text-right">
          {{ formatPrice(trade.last, trade.last < 100 ? 2 : 2) }}
        </span>
        <span
          class="text-xs font-mono tabular-nums text-right font-semibold"
          :class="trade.changePct >= 0 ? 'text-positive' : 'text-negative'"
        >
          {{ trade.changePct >= 0 ? '+' : '' }}{{ trade.changePct.toFixed(2) }}%
        </span>
      </div>

      <div v-if="!trades.length" class="px-5 py-6 text-center text-xs font-mono text-text-secondary/50">
        Keine Trades vorhanden
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Trade } from '@/types/dto'
import { formatTimestamp, formatPrice } from '@/utils/format'
import LoadingSkeleton from './LoadingSkeleton.vue'

defineProps<{
  category: 'gold' | 'silver' | 'crypto' | 'platinum' | 'eth' | 'oil'
  title: string
  trades: Trade[]
  loading: boolean
  error?: string | null
}>()
</script>
