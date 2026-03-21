<template>
  <div class="w-full h-1.5 rounded-full overflow-hidden bg-surface2 flex">
    <div
      class="h-full transition-[width] duration-300 ease-out shrink-0 bg-positive"
      :style="{ width: `${longWidth}%` }"
    />
    <div
      class="h-full shrink-0 bg-negative transition-[width] duration-300 ease-out"
      :style="{ width: `${shortWidth}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  longPct: number
  shortPct?: number
}>()

const longWidth = computed(() => Math.min(100, Math.max(0, props.longPct)))
const shortWidth = computed(() => Math.min(100, Math.max(0, props.shortPct ?? (100 - props.longPct))))
</script>
