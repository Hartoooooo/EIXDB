<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between mb-2 pb-2 border-b border-border">
      <span class="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase">
        {{ title }}
      </span>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="grid grid-cols-4 gap-2 items-center py-1.5">
        <LoadingSkeleton height="0.875rem" width="5rem" />
        <LoadingSkeleton height="0.875rem" width="3rem" />
        <LoadingSkeleton height="0.875rem" width="3rem" />
        <LoadingSkeleton height="0.875rem" width="3rem" />
      </div>
    </template>

    <!-- Header row -->
    <template v-else>
      <div class="grid grid-cols-4 gap-2 text-[10px] font-mono font-semibold tracking-widest text-text-secondary/60 uppercase pb-1 border-b border-border">
        <span>ASSET</span>
        <span class="text-right">TOTAL</span>
        <span class="text-right">LONG</span>
        <span class="text-right">SHORT</span>
      </div>

      <div
        v-for="row in rows"
        :key="row.label"
        class="grid grid-cols-4 gap-2 items-center py-1.5 hover:bg-surface2/50 rounded px-1 transition-colors duration-100"
      >
        <span class="text-xs font-mono text-text-primary truncate">{{ row.label }}</span>
        <span class="text-xs font-mono text-text-secondary text-right tabular-nums">{{ row.totalExposure }}</span>
        <span class="text-xs font-mono text-positive text-right tabular-nums">{{ row.buyExposure }}</span>
        <span class="text-xs font-mono text-negative text-right tabular-nums">{{ row.sellExposure }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PanelTableRow } from '@/types/dto'
import LoadingSkeleton from './LoadingSkeleton.vue'

defineProps<{
  title: string
  rows: PanelTableRow[]
  loading?: boolean
}>()
</script>
