<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- Rohstoffe (Multi-Select) -->
    <div class="flex items-center gap-1.5">
      <span class="text-[10px] font-mono font-semibold tracking-widest text-text-secondary uppercase">
        Rohstoffe
      </span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="c in COMMODITY_INFOS"
          :key="c.id"
          type="button"
          class="px-2 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-150"
          :class="modelValue.commodities.includes(c.id)
            ? 'bg-border text-text-primary'
            : 'bg-surface2 border border-border text-text-secondary hover:text-text-primary'"
          @click="toggleCommodity(c.id)"
        >
          {{ c.name }}
        </button>
      </div>
    </div>

    <span class="text-border">/</span>

    <!-- Long/Short -->
    <div class="flex items-center gap-1">
      <span class="text-[10px] font-mono font-semibold tracking-widest text-text-secondary uppercase">
        Seite
      </span>
      <div class="flex rounded-lg bg-surface2 border border-border p-0.5">
        <button
          v-for="s in sideOptions"
          :key="s.value"
          type="button"
          class="px-2 py-1 rounded-md font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-150"
          :class="modelValue.side === s.value
            ? 'bg-border text-text-primary'
            : 'text-text-secondary hover:text-text-primary'"
          @click="emit('update:modelValue', { ...modelValue, side: s.value })"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <span class="text-border">/</span>

    <!-- Hebel -->
    <div class="flex items-center gap-1">
      <span class="text-[10px] font-mono font-semibold tracking-widest text-text-secondary uppercase">
        Hebel
      </span>
      <div class="flex rounded-lg bg-surface2 border border-border p-0.5">
        <button
          v-for="l in leverageOptions"
          :key="l.value"
          type="button"
          class="px-2 py-1 rounded-md font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-150"
          :class="modelValue.leverage === l.value
            ? 'bg-border text-text-primary'
            : 'text-text-secondary hover:text-text-primary'"
          @click="emit('update:modelValue', { ...modelValue, leverage: l.value })"
        >
          {{ l.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { COMMODITY_INFOS } from '@/mocks/mock.commodities'
import type { CommodityFilter, CommodityId } from '@/types/commodity'

const props = defineProps<{ modelValue: CommodityFilter }>()
const emit = defineEmits<{ 'update:modelValue': [v: CommodityFilter] }>()

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

function toggleCommodity(id: CommodityId) {
  const current = props.modelValue.commodities
  const next = current.includes(id)
    ? current.filter(c => c !== id)
    : [...current, id]
  emit('update:modelValue', { ...props.modelValue, commodities: next.length ? next : COMMODITY_INFOS.map(c => c.id) })
}
</script>
