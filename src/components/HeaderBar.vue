<template>
  <header class="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm">
    <div class="relative flex items-center justify-between px-4 md:px-6 py-3 max-w-[1600px] mx-auto">
    <!-- Left: Selektoren (mobile: kleiner + untereinander) -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
      <!-- Location Selector: ALL / BER / MUN -->
      <div class="flex items-center rounded-md sm:rounded-lg bg-surface2 border border-border p-0.5">
        <button
          v-for="loc in locations"
          :key="loc"
          class="px-2 sm:px-3 py-0.5 sm:py-1 rounded font-mono text-[9px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-150"
          :class="selectedLocation === loc
            ? 'bg-border text-text-primary'
            : 'text-text-secondary hover:text-text-primary'"
          @click="selectedLocation = loc"
        >
          {{ loc }}
        </button>
      </div>

      <span class="hidden sm:inline text-border">/</span>

      <!-- Sub-Basket Selector: EIX / HAM -->
      <div class="flex items-center rounded-md sm:rounded-lg bg-surface2 border border-border p-0.5">
        <button
          v-for="sb in subBaskets"
          :key="sb"
          class="px-2 sm:px-3 py-0.5 sm:py-1 rounded font-mono text-[9px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-150"
          :class="selectedSubBasket === sb
            ? 'bg-border text-text-primary'
            : 'text-text-secondary hover:text-text-primary'"
          @click="selectedSubBasket = sb"
        >
          {{ sb }}
        </button>
      </div>
    </div>

    <!-- Center: Live Portfolio-Exposure aus GlattLib (absolut zentriert) -->
    <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
      <div
        class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface2 border border-border transition-opacity duration-200"
        :class="{ 'opacity-40': !glattLibStore.isServerRunning }"
      >
        <template v-if="glattLibStore.connectionStatus === 'connecting'">
          <span class="font-mono text-xs text-text-secondary">Verbinde…</span>
        </template>
        <template v-else>
          <span class="font-mono text-xs font-semibold text-text-primary tabular-nums">
            G {{ formatCurrencyEUR(glattLibStore.totalPortfolioValue) }}
          </span>
          <span class="text-border mx-1">|</span>
          <span class="font-mono text-xs font-semibold text-positive tabular-nums">
            L {{ formatCurrencyEUR(glattLibStore.totalLongValue) }}
          </span>
          <span class="text-border mx-1">|</span>
          <span class="font-mono text-xs font-semibold text-negative tabular-nums">
            S {{ formatCurrencyEUR(glattLibStore.totalShortValue) }}
          </span>
        </template>
      </div>
    </div>

    <!-- Right: Controls -->
    <div class="flex items-center gap-2">
      <!-- Dark / Light Mode Toggle -->
      <button
        type="button"
        class="p-1 text-text-secondary hover:text-text-primary transition-colors duration-150"
        :aria-label="isDark ? 'Zu Hellmodus wechseln' : 'Zu Dunkelmodus wechseln'"
        @click="themeStore.toggle()"
      >
        <!-- Sun: bei Dunkelmodus anzeigen (Wechsel zu Hell) -->
        <svg
          v-if="isDark"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Moon: bei Hellmodus anzeigen (Wechsel zu Dunkel) -->
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface2 border border-border text-text-secondary hover:text-text-primary hover:border-border transition-all duration-150 text-xs font-mono tracking-wider"
        @click="emit('refresh')"
        :disabled="refreshing"
      >
        <svg
          class="w-3.5 h-3.5 transition-transform duration-500"
          :class="{ 'animate-spin': refreshing }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        REFRESH
      </button>

    </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlattLibStore } from '@/stores/glattlib.store'
import { useThemeStore } from '@/stores/theme.store'
import { formatCurrencyEUR } from '@/utils/format'
import type { FilterParams, LocationFilter, SubBasketFilter } from '@/types/dto'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

defineProps<{ refreshing?: boolean }>()
const emit = defineEmits<{
  refresh: []
  filterChange: [filter: FilterParams]
}>()

const subBaskets = ['EIX', 'HAM'] as const
const selectedSubBasket = ref<SubBasketFilter>('EIX')

const locations = ['ALL', 'BER', 'MUN'] as const
const selectedLocation = ref<LocationFilter>('ALL')

function emitFilter() {
  emit('filterChange', { location: selectedLocation.value, subBasket: selectedSubBasket.value })
}

watch(selectedLocation, emitFilter)
watch(selectedSubBasket, emitFilter)

const glattLibStore = useGlattLibStore()
</script>
