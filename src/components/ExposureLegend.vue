<template>
  <div class="flex items-center font-mono gap-2 text-[10px]">
    <div v-if="totalDisplay" class="flex items-center gap-0.5">
      <span class="text-text-secondary font-bold tracking-widest uppercase">G</span>
      <span class="text-text-primary font-bold tabular-nums">{{ totalDisplay }}</span>
    </div>
    <div class="flex items-center gap-0.5">
      <span class="text-positive font-bold tracking-widest uppercase">L</span>
      <span class="text-positive font-bold tabular-nums">{{ longDisplay }}</span>
    </div>
    <div class="flex items-center gap-0.5">
      <span class="text-negative font-bold tracking-widest uppercase">S</span>
      <span class="text-negative font-bold tabular-nums">{{ shortDisplay }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrencyEUR } from '@/utils/format'

const props = withDefaults(defineProps<{
  longValue: number
  shortValue: number
  totalValue?: number
}>(), {
  totalValue: undefined,
})

const longDisplay = computed(() => formatCurrencyEUR(props.longValue))
const shortDisplay = computed(() => formatCurrencyEUR(props.shortValue))
const totalDisplay = computed(() => {
  if (props.totalValue !== undefined) return formatCurrencyEUR(props.totalValue)
  return formatCurrencyEUR(props.longValue + props.shortValue)
})
</script>
