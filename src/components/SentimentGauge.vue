<template>
  <div class="flex flex-col items-center gap-3 py-2">
    <!-- Loading: gleiche Ladeanimation wie der Rest -->
    <template v-if="loading">
      <LoadingSkeleton height="0.875rem" width="6rem" class="rounded" />
      <LoadingSkeleton height="76px" width="136px" class="rounded-xl" />
      <div class="flex items-center gap-4">
        <LoadingSkeleton height="0.875rem" width="4rem" class="rounded" />
        <LoadingSkeleton height="0.875rem" width="4rem" class="rounded" />
      </div>
    </template>

    <template v-else>
      <span class="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase">
        {{ label }}
      </span>

      <!-- Semi-Circle SVG -->
      <div class="relative">
        <svg width="136" height="76" viewBox="0 0 160 90">
        <!-- Subdominante Seite zuerst (unten) -->
        <path
          v-if="longPct >= shortPct"
          :d="shortArcPath"
          fill="none"
          stroke="#EF4444"
          stroke-width="10"
          stroke-linecap="round"
          opacity="0.3"
        />
        <path
          v-else
          :d="longArcPath"
          fill="none"
          stroke="#22C55E"
          stroke-width="10"
          stroke-linecap="round"
          opacity="0.3"
        />

        <!-- Dominante Seite zuletzt (oben, überlappt Endpunkt) -->
        <path
          v-if="longPct >= shortPct"
          :d="longArcPath"
          fill="none"
          stroke="#22C55E"
          stroke-width="10"
          stroke-linecap="round"
        />
        <path
          v-else
          :d="shortArcPath"
          fill="none"
          stroke="#EF4444"
          stroke-width="10"
          stroke-linecap="round"
        />

        <!-- Center label: dominante Seite -->
        <text x="80" y="82" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="600"
          :fill="longPct >= shortPct ? '#22C55E' : '#EF4444'">
          {{ longPct >= shortPct ? longPct : shortPct }}%
        </text>
        <text x="80" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#888888">
          {{ longPct >= shortPct ? 'LONG' : 'SHORT' }}
        </text>
      </svg>
    </div>

    <!-- Legend: G Gesamt, L, S mit Exposure (€) -->
    <div class="flex items-center gap-4 text-xs font-mono flex-wrap justify-center">
      <div v-if="totalDisplay" class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-white" />
        <span class="text-text-secondary tracking-widest uppercase mr-0.5">G</span>
        <span class="text-text-primary font-semibold tabular-nums">{{ totalDisplay }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-positive" />
        <span class="text-text-secondary tracking-widest uppercase mr-0.5">L</span>
        <span class="text-positive font-semibold tabular-nums">{{ longDisplay }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-negative" />
        <span class="text-text-secondary tracking-widest uppercase mr-0.5">S</span>
        <span class="text-negative font-semibold tabular-nums">{{ shortDisplay }}</span>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrencyEUR } from '@/utils/format'
import LoadingSkeleton from './LoadingSkeleton.vue'

const props = withDefaults(defineProps<{
  label?: string
  longPct: number
  shortPct: number
  /** Long Exposure (€) – wenn gesetzt, wird statt % angezeigt */
  longValue?: number
  /** Short Exposure (€) – wenn gesetzt, wird statt % angezeigt */
  shortValue?: number
  /** Gesamt Exposure (€) – optional, sonst longValue+shortValue */
  totalValue?: number
  loading?: boolean
}>(), {
  label: 'SENTIMENT',
  loading: false,
})

const longDisplay = computed(() => {
  if (props.longValue !== undefined) return formatCurrencyEUR(props.longValue)
  return `${props.longPct}%`
})

const shortDisplay = computed(() => {
  if (props.shortValue !== undefined) return formatCurrencyEUR(props.shortValue)
  return `${props.shortPct}%`
})

const totalDisplay = computed(() => {
  if (props.totalValue !== undefined) return formatCurrencyEUR(props.totalValue)
  if (props.longValue !== undefined && props.shortValue !== undefined) {
    return formatCurrencyEUR(props.longValue + props.shortValue)
  }
  return null
})

// Semi-circle from -π to 0 (left to right, top = 180°)
const cx = 80
const cy = 80
const r = 64

function polarToXY(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

// Halbkreis: 180° (links) → 360° (rechts)
const startAngle = 180

// Trennpunkt zwischen Long und Short
const splitAngle = computed(() => startAngle + (props.longPct / 100) * 180)

// Long-Bogen: von links bis zum Trennpunkt
const longArcPath = computed(() => {
  const start = polarToXY(startAngle)
  const end = polarToXY(splitAngle.value)
  const sweep = (props.longPct / 100) * 180
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
})

// Short-Bogen: vom Trennpunkt bis rechts
const shortArcPath = computed(() => {
  const start = polarToXY(splitAngle.value)
  const end = polarToXY(360)
  const sweep = (props.shortPct / 100) * 180
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
})
</script>
