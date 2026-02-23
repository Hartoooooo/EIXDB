<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between mb-2 pb-2 border-b border-border">
      <span class="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase">
        {{ title }}
      </span>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="flex items-center justify-between py-1.5">
        <LoadingSkeleton height="0.875rem" width="5rem" />
        <LoadingSkeleton height="0.875rem" width="3rem" />
        <LoadingSkeleton height="0.875rem" width="3.5rem" />
      </div>
    </template>

    <!-- Header row -->
    <template v-else>
      <div class="grid text-[10px] font-mono font-semibold tracking-widest text-text-secondary/60 uppercase pb-1 border-b border-border"
        :class="showChg ? 'grid-cols-3' : 'grid-cols-2'">
        <span>ASSET</span>
        <span class="text-right">VOL</span>
        <span v-if="showChg" class="text-right">CHG%</span>
      </div>

      <div
        v-for="row in rows"
        :key="row.label"
        class="grid items-center py-1.5 hover:bg-surface2/50 rounded px-1 transition-colors duration-100"
        :class="showChg ? 'grid-cols-3' : 'grid-cols-2'"
      >
        <span class="text-xs font-mono text-text-primary truncate">{{ row.label }}</span>
        <span class="text-xs font-mono text-text-secondary text-right tabular-nums">{{ row.vol }}</span>
        <span
          v-if="showChg && row.chgPct !== undefined"
          class="text-xs font-mono text-right tabular-nums font-semibold"
          :class="row.chgPct >= 0 ? 'text-positive' : 'text-negative'"
        >
          {{ row.chgPct >= 0 ? '+' : '' }}{{ row.chgPct.toFixed(2) }}%
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PanelTableRow } from '@/types/dto'
import LoadingSkeleton from './LoadingSkeleton.vue'

const props = defineProps<{
  title: string
  rows: PanelTableRow[]
  loading?: boolean
}>()

const showChg = computed(() => props.rows.some(r => r.chgPct !== undefined))
</script>
