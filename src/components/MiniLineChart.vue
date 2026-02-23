<template>
  <div class="relative w-full" :style="{ height: chartHeight + 'px' }">
    <!-- Loading -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <LoadingSkeleton :height="chartHeight + 'px'" width="100%" />
    </div>

    <!-- Error -->
    <div v-else-if="!points.length" class="absolute inset-0 flex items-center justify-center">
      <span class="text-xs text-text-secondary font-mono">NO DATA</span>
    </div>

    <!-- Chart mit X/Y-Achsen und Werten -->
    <svg
      v-else
      class="w-full h-full"
      :viewBox="`0 0 ${svgW} ${svgH}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient :id="`grad-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="accentColor" stop-opacity="0.25" />
          <stop offset="100%" :stop-color="accentColor" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      <!-- Y-Achse Linie -->
      <line :x1="padLeft" :y1="padTop" :x2="padLeft" :y2="chartBottom" stroke="var(--color-border)" stroke-width="1" opacity="0.6" />
      <!-- Y-Achse Beschriftungen (Werte) -->
      <template v-for="(label, idx) in yAxisLabels" :key="'y-' + idx">
        <line
          :x1="padLeft"
          :y1="yAxisTicks[idx]"
          :x2="svgW - padRight"
          :y2="yAxisTicks[idx]"
          stroke="var(--color-border)"
          stroke-width="0.5"
          stroke-dasharray="2 2"
          opacity="0.4"
        />
        <text
          :x="padLeft - 6"
          :y="yAxisTicks[idx] + 4"
          text-anchor="end"
          font-family="JetBrains Mono, monospace"
          font-size="9"
          fill="var(--color-text-secondary)"
        >
          {{ label }}
        </text>
      </template>

      <!-- X-Achse Linie -->
      <line :x1="padLeft" :y1="chartBottom" :x2="svgW - padRight" :y2="chartBottom" stroke="var(--color-border)" stroke-width="1" opacity="0.6" />
      <!-- X-Achse Beschriftungen (Zeit) -->
      <template v-for="(label, idx) in xAxisLabels" :key="'x-' + idx">
        <text
          :x="xAxisPositions[idx]"
          :y="chartBottom + 14"
          text-anchor="middle"
          font-family="JetBrains Mono, monospace"
          font-size="9"
          fill="var(--color-text-secondary)"
        >
          {{ label }}
        </text>
      </template>

      <!-- Area Fill -->
      <path
        :d="areaPath"
        :fill="`url(#grad-${uid})`"
      />

      <!-- Line (detaillierte Kurve) -->
      <path
        :d="linePath"
        fill="none"
        :stroke="accentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- Letzter Punkt -->
      <circle
        v-if="lastPoint"
        :cx="lastPoint.x"
        :cy="lastPoint.y"
        r="3"
        :fill="accentColor"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartPoint } from '@/types/dto'
import LoadingSkeleton from './LoadingSkeleton.vue'
import { formatPrice } from '@/utils/format'

let _uidCounter = 0

const props = withDefaults(defineProps<{
  points: ChartPoint[]
  accentColor?: string
  height?: number
  loading?: boolean
}>(), {
  accentColor: '#F5C542',
  height: 220,
  loading: false,
})

const uid = `mlc-${_uidCounter++}`

const padLeft = 52
const padTop = 10
const padRight = 8
const padBottom = 28
const chartW = 400
const svgW = padLeft + chartW + padRight
const svgH = computed(() => props.height)
const chartH = computed(() => Math.max(60, props.height - padTop - padBottom))
const chartBottom = computed(() => padTop + chartH.value)
const chartHeight = computed(() => props.height)

// X-Achse: 7:30–22:00 (870 Minuten)
const DAY_START_MIN = 7 * 60 + 30   // 450
const DAY_END_MIN = 22 * 60         // 1320
const DAY_SPAN_MIN = DAY_END_MIN - DAY_START_MIN // 870

function minutesFrom730(iso: string): number {
  const d = new Date(iso)
  const minOfDay = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60
  return minOfDay - DAY_START_MIN
}

/** Nur Punkte bis zur aktuellen Zeit, innerhalb 7:30–22:00 */
const pointsUpToNow = computed(() => {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  const nowOffset = nowMin - DAY_START_MIN
  return props.points.filter((p) => {
    const m = minutesFrom730(p.time)
    return m >= 0 && m <= DAY_SPAN_MIN && m <= nowOffset
  })
})

const coords = computed(() => {
  if (!pointsUpToNow.value.length) return []
  const pts = pointsUpToNow.value
  const values = pts.map(p => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const innerPad = 8

  return pts.map((p) => {
    const minFrom730 = minutesFrom730(p.time)
    const xRatio = Math.max(0, Math.min(1, minFrom730 / DAY_SPAN_MIN))
    return {
      x: padLeft + xRatio * chartW,
      y: padTop + innerPad + ((max - p.value) / range) * (chartH.value - innerPad * 2),
    }
  })
})

const linePath = computed(() => {
  if (!coords.value.length) return ''
  return coords.value.reduce((acc, pt, i) => {
    return acc + (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`)
  }, '')
})

const areaPath = computed(() => {
  if (!coords.value.length) return ''
  const line = coords.value.reduce((acc, pt, i) => {
    return acc + (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`)
  }, '')
  const last = coords.value[coords.value.length - 1]
  const first = coords.value[0]
  const bottom = chartBottom.value
  return `${line} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`
})

const lastPoint = computed(() => coords.value[coords.value.length - 1] ?? null)

const yAxisLabels = computed(() => {
  if (!pointsUpToNow.value.length) return []
  const values = pointsUpToNow.value.map(p => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const decimals = range < 1 ? 4 : range < 10 ? 2 : 0
  return [
    formatPrice(min, decimals),
    formatPrice((min + max) / 2, decimals),
    formatPrice(max, decimals),
  ]
})

const yAxisTicks = computed(() => {
  if (!pointsUpToNow.value.length) return []
  const b = chartBottom.value
  const h = chartH.value
  return [padTop, padTop + h / 2, b]
})

// X-Achse fest: 7:30, 14:45, 22:00
const xAxisLabels = ['7:30', '14:45', '22:00']
const xAxisPositions = [padLeft + 0 * chartW, padLeft + 0.5 * chartW, padLeft + 1 * chartW]
</script>
