<template>
  <div class="min-h-screen bg-bg text-text-primary font-sans">
    <!-- Header -->
    <HeaderBar
      :refreshing="isRefreshing"
      @refresh="handleRefresh"
      @filter-change="handleFilterChange"
    />

    <!-- Main Content -->
    <main class="px-4 md:px-6 py-6 max-w-[1600px] mx-auto space-y-8">

      <!-- Status Banner (Error) -->
      <div
        v-if="hasAnyError"
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-negative/10 border border-negative/30 text-negative text-xs font-mono"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Fehler beim Laden einiger Daten. Bitte Refresh versuchen.
      </div>

      <!-- 6 Karten: Überschrift + Strich + Nav (wie Positions Overview) -->
      <div class="w-full">
        <div class="flex items-center gap-3 mb-4">
          <h2 class="text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
            Asset Cards
          </h2>
          <div class="flex-1 h-px bg-border" />
          <div class="flex items-center gap-3">
          <button
            type="button"
            class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Vorherige Karten"
            :disabled="cardsPage === 0"
            @click="cardsPage = Math.max(0, cardsPage - 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="flex gap-2">
            <button
              v-for="p in 2"
              :key="'cards-dot-' + p"
              type="button"
              class="w-2 h-2 rounded-full transition-colors duration-200"
              :class="cardsPage === p - 1 ? 'bg-text-primary' : 'bg-border hover:bg-text-secondary'"
              :aria-label="`Karten ${(p - 1) * 3 + 1}–${(p - 1) * 3 + 3}`"
              @click="cardsPage = p - 1"
            />
          </div>
          <button
            type="button"
            class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Nächste Karten"
            :disabled="cardsPage === 1"
            @click="cardsPage = Math.min(1, cardsPage + 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          </div>
        </div>
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-out"
            :style="{ width: '200%', transform: `translateX(-${cardsPage * 50}%)` }"
          >
            <div class="flex-[0_0_16.666%] min-w-0 shrink-0 pr-2">
              <CategoryPanel
                category="gold"
                title="GOLD OPERATIONS"
                symbol="GC=F"
                sentiment-label="GOLD SENTIMENT"
                table-title="RELATED SECTOR HEAT"
                :chart-points="marketStore.chartData.gold"
                :table-rows="marketStore.panelTables.gold"
                :long-pct="goldPosition?.longPct ?? 68"
                :short-pct="goldPosition?.shortPct ?? 32"
                :chart-loading="marketStore.chartLoading.gold"
                :table-loading="marketStore.panelTablesLoading.gold"
                :gauge-loading="positionsStore.loading"
              />
            </div>
            <div class="flex-[0_0_16.666%] min-w-0 shrink-0 px-1">
              <CategoryPanel
                category="silver"
                title="SILVER TERMINAL"
                symbol="SI=F"
                sentiment-label="SILVER SENTIMENT"
                table-title="INDUSTRIAL CORRELATES"
                :chart-points="marketStore.chartData.silver"
                :table-rows="marketStore.panelTables.silver"
                :long-pct="silverPosition?.longPct ?? 42"
                :short-pct="silverPosition?.shortPct ?? 58"
                :chart-loading="marketStore.chartLoading.silver"
                :table-loading="marketStore.panelTablesLoading.silver"
                :gauge-loading="positionsStore.loading"
              />
            </div>
            <div class="flex-[0_0_16.666%] min-w-0 shrink-0 pl-2">
              <CategoryPanel
                category="crypto"
                title="BITCOIN"
                symbol="BTC/USD"
                sentiment-label="BITCOIN SENTIMENT"
                table-title="BTC CORRELATES"
                :chart-points="marketStore.chartData.crypto"
                :table-rows="marketStore.panelTables.crypto"
                :long-pct="cryptoPosition?.longPct ?? 55"
                :short-pct="cryptoPosition?.shortPct ?? 45"
                :chart-loading="marketStore.chartLoading.crypto"
                :table-loading="marketStore.panelTablesLoading.crypto"
                :gauge-loading="positionsStore.loading"
              />
            </div>
            <div class="flex-[0_0_16.666%] min-w-0 shrink-0 pr-2">
              <CategoryPanel
                category="platinum"
                title="PLATINUM"
                symbol="PL=F"
                sentiment-label="PLATINUM SENTIMENT"
                table-title="PLATINUM SECTOR"
                :chart-points="marketStore.chartData.platinum"
                :table-rows="marketStore.panelTables.platinum"
                :long-pct="platinumPosition?.longPct ?? 60"
                :short-pct="platinumPosition?.shortPct ?? 40"
                :chart-loading="marketStore.chartLoading.platinum"
                :table-loading="marketStore.panelTablesLoading.platinum"
                :gauge-loading="positionsStore.loading"
              />
            </div>
            <div class="flex-[0_0_16.666%] min-w-0 shrink-0 px-1">
              <CategoryPanel
                category="eth"
                title="ETH"
                symbol="ETH/USD"
                sentiment-label="ETH SENTIMENT"
                table-title="ETH ECOSYSTEM"
                :chart-points="marketStore.chartData.eth"
                :table-rows="marketStore.panelTables.eth"
                :long-pct="ethPosition?.longPct ?? 48"
                :short-pct="ethPosition?.shortPct ?? 52"
                :chart-loading="marketStore.chartLoading.eth"
                :table-loading="marketStore.panelTablesLoading.eth"
                :gauge-loading="positionsStore.loading"
              />
            </div>
            <div class="flex-[0_0_16.666%] min-w-0 shrink-0 pl-2">
              <CategoryPanel
                category="oil"
                title="OIL"
                symbol="CL=F"
                sentiment-label="OIL SENTIMENT"
                table-title="ENERGY SECTOR"
                :chart-points="marketStore.chartData.oil"
                :table-rows="marketStore.panelTables.oil"
                :long-pct="oilPosition?.longPct ?? 72"
                :short-pct="oilPosition?.shortPct ?? 28"
                :chart-loading="marketStore.chartLoading.oil"
                :table-loading="marketStore.panelTablesLoading.oil"
                :gauge-loading="positionsStore.loading"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Positions Overview: Titel + Nav (Pfeile + Dots) in einer Zeile -->
      <section>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
            Positions Overview
          </h2>
          <div class="flex-1 h-px bg-border" />
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Vorherige Positionen"
              :disabled="positionsPage === 0"
              @click="positionsPage = Math.max(0, positionsPage - 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex gap-2">
              <button
                v-for="p in 2"
                :key="'pos-' + p"
                type="button"
                class="w-2 h-2 rounded-full transition-colors duration-200"
                :class="positionsPage === p - 1 ? 'bg-text-primary' : 'bg-border hover:bg-text-secondary'"
                :aria-label="`Positionen ${(p - 1) * 3 + 1}–${(p - 1) * 3 + 3}`"
                @click="positionsPage = p - 1"
              />
            </div>
            <button
              type="button"
              class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Nächste Positionen"
              :disabled="positionsPage === 1"
              @click="positionsPage = Math.min(1, positionsPage + 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div class="w-full mt-4">
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-300 ease-out"
              :style="{ width: '200%', transform: `translateX(-${positionsPage * 50}%)` }"
            >
              <!-- Seite 1: gleiche Breite/Padding wie 6 Karten (pr-2, px-1, pl-2) -->
              <div class="flex-[0_0_50%] min-w-0 shrink-0 flex">
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pr-2">
                  <PositionsSummary
                    :aggregates="positionsStore.aggregates.slice(0, 1)"
                    :loading="positionsStore.loading"
                    no-margin
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 px-1">
                  <PositionsSummary
                    :aggregates="positionsStore.aggregates.slice(1, 2)"
                    :loading="positionsStore.loading"
                    no-margin
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pl-2">
                  <PositionsSummary
                    :aggregates="positionsStore.aggregates.slice(2, 3)"
                    :loading="positionsStore.loading"
                    no-margin
                  />
                </div>
              </div>
              <!-- Seite 2 -->
              <div class="flex-[0_0_50%] min-w-0 shrink-0 flex">
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pr-2">
                  <PositionsSummary
                    :aggregates="positionsStore.aggregates.slice(3, 4)"
                    :loading="positionsStore.loading"
                    no-margin
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 px-1">
                  <PositionsSummary
                    :aggregates="positionsStore.aggregates.slice(4, 5)"
                    :loading="positionsStore.loading"
                    no-margin
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pl-2">
                  <PositionsSummary
                    :aggregates="positionsStore.aggregates.slice(5, 6)"
                    :loading="positionsStore.loading"
                    no-margin
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Trades: Titel + Nav (Pfeile + Dots) in einer Zeile -->
      <section>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
            Recent Trades
          </h2>
          <div class="flex-1 h-px bg-border" />
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Vorherige Trades"
              :disabled="tradesPage === 0"
              @click="tradesPage = Math.max(0, tradesPage - 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex gap-2">
              <button
                v-for="p in 2"
                :key="'trades-' + p"
                type="button"
                class="w-2 h-2 rounded-full transition-colors duration-200"
                :class="tradesPage === p - 1 ? 'bg-text-primary' : 'bg-border hover:bg-text-secondary'"
                :aria-label="`Trades ${(p - 1) * 3 + 1}–${(p - 1) * 3 + 3}`"
                @click="tradesPage = p - 1"
              />
            </div>
            <button
              type="button"
              class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Nächste Trades"
              :disabled="tradesPage === 1"
              @click="tradesPage = Math.min(1, tradesPage + 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div class="w-full mt-4">
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-300 ease-out"
              :style="{ width: '200%', transform: `translateX(-${tradesPage * 50}%)` }"
            >
              <!-- Seite 1: gleiche Breite/Padding wie 6 Karten (pr-2, px-1, pl-2) -->
              <div class="flex-[0_0_50%] min-w-0 shrink-0 flex">
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pr-2">
                  <RecentTradesList
                    category="gold"
                    title="GOLD TRADES"
                    :trades="tradesStore.trades.gold"
                    :loading="tradesStore.loading.gold"
                    :error="tradesStore.error.gold"
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 px-1">
                  <RecentTradesList
                    category="silver"
                    title="SILVER TRADES"
                    :trades="tradesStore.trades.silver"
                    :loading="tradesStore.loading.silver"
                    :error="tradesStore.error.silver"
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pl-2">
                  <RecentTradesList
                    category="crypto"
                    title="BITCOIN TRADES"
                    :trades="tradesStore.trades.crypto"
                    :loading="tradesStore.loading.crypto"
                    :error="tradesStore.error.crypto"
                  />
                </div>
              </div>
              <!-- Seite 2 -->
              <div class="flex-[0_0_50%] min-w-0 shrink-0 flex">
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pr-2">
                  <RecentTradesList
                    category="platinum"
                    title="PLATINUM TRADES"
                    :trades="tradesStore.trades.platinum"
                    :loading="tradesStore.loading.platinum"
                    :error="tradesStore.error.platinum"
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 px-1">
                  <RecentTradesList
                    category="eth"
                    title="ETH TRADES"
                    :trades="tradesStore.trades.eth"
                    :loading="tradesStore.loading.eth"
                    :error="tradesStore.error.eth"
                  />
                </div>
                <div class="flex-[0_0_33.333%] min-w-0 shrink-0 pl-2">
                  <RecentTradesList
                    category="oil"
                    title="OIL TRADES"
                    :trades="tradesStore.trades.oil"
                    :loading="tradesStore.loading.oil"
                    :error="tradesStore.error.oil"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="mt-12 px-6 py-4 border-t border-border flex items-center justify-between">
      <span class="text-[10px] font-mono text-text-secondary/40 tracking-widest">
        MULTI-ASSET TERMINAL v0.1.0 — MOCK DATA MODE
      </span>
      <span class="text-[10px] font-mono text-text-secondary/40 tracking-widest">
        BACKEND: NOT CONNECTED — .NET/AZURE SQL READY
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/stores/market.store'
import { usePositionsStore } from '@/stores/positions.store'
import { useTradesStore } from '@/stores/trades.store'
import HeaderBar from '@/components/HeaderBar.vue'
import CategoryPanel from '@/components/CategoryPanel.vue'
import PositionsSummary from '@/components/PositionsSummary.vue'
import RecentTradesList from '@/components/RecentTradesList.vue'
import type { FilterParams } from '@/types/dto'

const marketStore = useMarketStore()
const positionsStore = usePositionsStore()
const tradesStore = useTradesStore()
const { aggregates: positionAggregates } = storeToRefs(positionsStore)

const isRefreshing = ref(false)
const activeFilter = ref<FilterParams>({ location: 'ALL', exchange: 'EIX' })
const cardsPage = ref(0)
const positionsPage = ref(0)
const tradesPage = ref(0)

const goldPosition = computed(() =>
  positionAggregates.value.find(a => a.category === 'gold')
)
const silverPosition = computed(() =>
  positionAggregates.value.find(a => a.category === 'silver')
)
const cryptoPosition = computed(() =>
  positionAggregates.value.find(a => a.category === 'crypto')
)
const platinumPosition = computed(() =>
  positionAggregates.value.find(a => a.category === 'platinum')
)
const ethPosition = computed(() =>
  positionAggregates.value.find(a => a.category === 'eth')
)
const oilPosition = computed(() =>
  positionAggregates.value.find(a => a.category === 'oil')
)

const hasAnyError = computed(() =>
  !!marketStore.tickersError ||
  Object.values(marketStore.chartError).some(Boolean) ||
  !!positionsStore.error ||
  Object.values(tradesStore.error).some(Boolean)
)

async function loadAll(filter: FilterParams = activeFilter.value) {
  await Promise.all([
    marketStore.fetchAll(filter),
    positionsStore.fetchAggregates(filter),
    tradesStore.fetchAll(filter),
  ])
}

async function handleRefresh() {
  isRefreshing.value = true
  await loadAll()
  isRefreshing.value = false
}

async function handleFilterChange(filter: FilterParams) {
  activeFilter.value = filter
  isRefreshing.value = true
  await loadAll(filter)
  isRefreshing.value = false
}

onMounted(() => {
  loadAll()
})
</script>
