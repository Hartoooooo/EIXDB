<template>
  <div class="space-y-1">
    <div
      class="flex items-center justify-between border-b border-border"
      :class="compact ? 'mb-1 pb-1' : 'mb-2 pb-2'"
    >
      <span
        class="font-mono font-semibold tracking-widest text-text-secondary uppercase"
        :class="compact ? 'text-[9px]' : 'text-xs'"
      >
        {{ title }}
      </span>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <div
        v-for="i in compact ? 3 : 4"
        :key="i"
        class="grid grid-cols-4 items-center transition-colors duration-100"
        :class="compact ? 'gap-1 py-1' : 'gap-2 py-1.5'"
      >
        <LoadingSkeleton :height="compact ? '0.75rem' : '0.875rem'" :width="compact ? '4rem' : '5rem'" />
        <LoadingSkeleton :height="compact ? '0.75rem' : '0.875rem'" :width="compact ? '2.5rem' : '3rem'" />
        <LoadingSkeleton :height="compact ? '0.75rem' : '0.875rem'" :width="compact ? '2.5rem' : '3rem'" />
        <LoadingSkeleton :height="compact ? '0.75rem' : '0.875rem'" :width="compact ? '2.5rem' : '3rem'" />
      </div>
    </template>

    <!-- Header row -->
    <template v-else>
      <div
        class="grid grid-cols-4 font-mono font-semibold tracking-widest text-text-secondary/60 uppercase border-b border-border"
        :class="compact ? 'gap-1 text-[9px] pb-0.5' : 'gap-2 text-[10px] pb-1'"
      >
        <span>ASSET</span>
        <span class="text-right">TOTAL</span>
        <span class="text-right">LONG</span>
        <span class="text-right">SHORT</span>
      </div>

      <div
        v-for="row in rows"
        :key="row.label"
        class="grid grid-cols-4 items-center hover:bg-surface2/50 rounded transition-colors duration-100"
        :class="compact ? 'gap-1 py-1 px-0.5' : 'gap-2 py-1.5 px-1'"
      >
        <span
          class="font-mono text-text-primary truncate"
          :class="compact ? 'text-[10px]' : 'text-xs'"
        >{{ row.label }}</span>
        <span
          class="font-mono text-text-secondary text-right tabular-nums"
          :class="compact ? 'text-[10px]' : 'text-xs'"
        >{{ row.totalExposure }}</span>
        <span
          class="font-mono text-positive text-right tabular-nums"
          :class="compact ? 'text-[10px]' : 'text-xs'"
        >{{ row.buyExposure }}</span>
        <span
          class="font-mono text-negative text-right tabular-nums"
          :class="compact ? 'text-[10px]' : 'text-xs'"
        >{{ row.sellExposure }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PanelTableRow } from '@/types/dto'
import LoadingSkeleton from './LoadingSkeleton.vue'

withDefaults(
  defineProps<{
    title: string
    rows: PanelTableRow[]
    loading?: boolean
    compact?: boolean
  }>(),
  { compact: false }
)
</script>
