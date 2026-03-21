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

      <!-- Status Banner (Allgemeiner Fehler) -->
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

      <!-- GlattLib Verbindungs-Status Banner -->
      <div
        v-if="glattLibStore.connectionStatus === 'error'"
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-negative/10 border border-negative/30 text-negative text-xs font-mono"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 8v4m0 4h.01" />
        </svg>
        GlattLib nicht erreichbar:
        {{ glattLibStore.connectionError ?? 'Unbekannter Verbindungsfehler' }}
      </div>

      <div
        v-else-if="glattLibStore.connectionStatus === 'connecting'"
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface2 border border-border text-text-secondary text-xs font-mono"
      >
        <svg class="w-4 h-4 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Verbinde mit GlattLib…
      </div>

      <div
        v-else-if="glattLibStore.connectionStatus === 'connected' && !glattLibStore.isServerRunning && glattLibStore.glattState !== null"
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-negative/10 border border-negative/30 text-negative text-xs font-mono"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        GlattLib-Server nicht aktiv — Status: {{ glattLibStore.glattState }}. Bestandsdaten möglicherweise veraltet.
      </div>

      <!-- ─── Live Bestände (GlattLib) ─────────────────────────────────── -->
      <section>
        <div class="flex items-center gap-3 mb-4">
          <h2 class="text-[9px] sm:text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
            Live Bestände
          </h2>
          <div class="flex-1 h-px bg-border" />
          <!-- Verbindungs-Indikator -->
          <div class="flex items-center gap-1.5">
            <span
              class="inline-block w-1.5 h-1.5 rounded-full"
              :class="{
                'bg-positive animate-pulse': glattLibStore.connectionStatus === 'connected' && glattLibStore.isServerRunning,
                'bg-text-secondary/40': glattLibStore.connectionStatus === 'disconnected',
                'bg-negative': glattLibStore.connectionStatus === 'error',
                'bg-text-secondary animate-pulse': glattLibStore.connectionStatus === 'connecting'
                  || (glattLibStore.connectionStatus === 'connected' && !glattLibStore.isServerRunning),
              }"
            />
            <span class="text-[10px] font-mono text-text-secondary tracking-widest uppercase">
              <template v-if="glattLibStore.connectionStatus === 'connected' && glattLibStore.isServerRunning">
                LIVE
              </template>
              <template v-else-if="glattLibStore.connectionStatus === 'connecting'">
                VERBINDE
              </template>
              <template v-else-if="glattLibStore.connectionStatus === 'error'">
                FEHLER
              </template>
              <template v-else-if="glattLibStore.connectionStatus === 'connected'">
                {{ glattLibStore.glattState ?? 'VERBUNDEN' }}
              </template>
              <template v-else>
                GETRENNT
              </template>
            </span>
          </div>
        </div>

        <!-- Kategorie-Karten (dynamisch aus Positions-State) -->
        <div
          v-if="glattLibStore.categorizedGroups.length > 0"
          class="grid gap-4"
          :class="glattLibStore.categorizedGroups.length === 1
            ? 'grid-cols-1'
            : glattLibStore.categorizedGroups.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'"
        >
          <GlattPositionCard
            v-for="group in glattLibStore.categorizedGroups"
            :key="group.category"
            :group="group"
          />
        </div>

        <!-- Leerzustand -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 rounded-2xl border border-border bg-surface text-text-secondary"
        >
          <svg class="w-8 h-8 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-xs font-mono tracking-widest uppercase opacity-50">
            <template v-if="glattLibStore.connectionStatus === 'connected'">
              Warte auf Bestandsdaten…
            </template>
            <template v-else-if="glattLibStore.connectionStatus === 'connecting'">
              Verbindung wird aufgebaut…
            </template>
            <template v-else>
              Keine Verbindung zu GlattLib
            </template>
          </span>
        </div>
      </section>

      <!-- 6+3 Karten: Überschrift + Strich + Nav (+ Rohstoff-Filter auf Seite 3) -->
      <div class="w-full">
        <div class="flex flex-col gap-3 mb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-[9px] sm:text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
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
                v-for="p in 3"
                :key="'cards-dot-' + p"
                type="button"
                class="w-2 h-2 rounded-full transition-colors duration-200"
                :class="cardsPage === p - 1 ? 'bg-text-primary' : 'bg-border hover:bg-text-secondary'"
                :aria-label="p === 3 ? 'Rohstoff-Karten mit Filter (5)' : `Karten ${(p - 1) * 5 + 1}–${(p - 1) * 5 + 5}`"
                @click="cardsPage = p - 1"
              />
            </div>
            <button
              type="button"
              class="p-1 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Nächste Karten"
              :disabled="cardsPage === 2"
              @click="cardsPage = Math.min(2, cardsPage + 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>
          </div>
        </div>
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-out"
            :style="{ width: '300%', transform: `translateX(-${cardsPage * 33.333}%)` }"
          >
            <!-- Seite 1: 5 Karten (Gold, Silver, Crypto, Platinum, ETH) -->
            <div class="flex-[0_0_33.333%] min-w-0 shrink-0">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <div class="min-w-0"><CategoryPanel category="gold" title="GOLD" symbol="GC=F" sentiment-label="GOLD" table-title="Größte Positionen" :chart-points="marketStore.chartData.gold" :table-rows="marketStore.panelTables.gold" :long-pct="goldPosition?.longPct ?? 50" :short-pct="goldPosition?.shortPct ?? 50" :chart-loading="marketStore.chartLoading.gold" :table-loading="marketStore.panelTablesLoading.gold" :gauge-loading="positionsStore.loading" :live-long-value="glattLibStore.categoryAggregates.get('gold')?.longValue" :live-short-value="glattLibStore.categoryAggregates.get('gold')?.shortValue" :long-eur="goldPosition?.longEur" :short-eur="goldPosition?.shortEur" :live-top-positions="glattLibStore.categoryAggregates.get('gold')?.topPositions" /></div>
                <div class="min-w-0"><CategoryPanel category="silver" title="SILVER" symbol="SI=F" sentiment-label="SILVER" table-title="Größte Positionen" :chart-points="marketStore.chartData.silver" :table-rows="marketStore.panelTables.silver" :long-pct="silverPosition?.longPct ?? 50" :short-pct="silverPosition?.shortPct ?? 50" :chart-loading="marketStore.chartLoading.silver" :table-loading="marketStore.panelTablesLoading.silver" :gauge-loading="positionsStore.loading" :live-long-value="glattLibStore.categoryAggregates.get('silver')?.longValue" :live-short-value="glattLibStore.categoryAggregates.get('silver')?.shortValue" :long-eur="silverPosition?.longEur" :short-eur="silverPosition?.shortEur" :live-top-positions="glattLibStore.categoryAggregates.get('silver')?.topPositions" /></div>
                <div class="min-w-0"><CategoryPanel category="crypto" title="BTC" symbol="BTC/USD" sentiment-label="BTC" table-title="Größte Positionen" :chart-points="marketStore.chartData.crypto" :table-rows="marketStore.panelTables.crypto" :long-pct="cryptoPosition?.longPct ?? 50" :short-pct="cryptoPosition?.shortPct ?? 50" :chart-loading="marketStore.chartLoading.crypto" :table-loading="marketStore.panelTablesLoading.crypto" :gauge-loading="positionsStore.loading" :live-long-value="glattLibStore.categoryAggregates.get('crypto')?.longValue" :live-short-value="glattLibStore.categoryAggregates.get('crypto')?.shortValue" :long-eur="cryptoPosition?.longEur" :short-eur="cryptoPosition?.shortEur" :live-top-positions="glattLibStore.categoryAggregates.get('crypto')?.topPositions" /></div>
                <div class="min-w-0"><CategoryPanel category="platinum" title="PLATINUM" symbol="PL=F" sentiment-label="PLATINUM" table-title="Größte Positionen" :chart-points="marketStore.chartData.platinum" :table-rows="marketStore.panelTables.platinum" :long-pct="platinumPosition?.longPct ?? 50" :short-pct="platinumPosition?.shortPct ?? 50" :chart-loading="marketStore.chartLoading.platinum" :table-loading="marketStore.panelTablesLoading.platinum" :gauge-loading="positionsStore.loading" :live-long-value="glattLibStore.categoryAggregates.get('platinum')?.longValue" :live-short-value="glattLibStore.categoryAggregates.get('platinum')?.shortValue" :long-eur="platinumPosition?.longEur" :short-eur="platinumPosition?.shortEur" :live-top-positions="glattLibStore.categoryAggregates.get('platinum')?.topPositions" /></div>
                <div class="min-w-0"><CategoryPanel category="eth" title="ETH" symbol="ETH/USD" sentiment-label="ETH" table-title="Größte Positionen" :chart-points="marketStore.chartData.eth" :table-rows="marketStore.panelTables.eth" :long-pct="ethPosition?.longPct ?? 50" :short-pct="ethPosition?.shortPct ?? 50" :chart-loading="marketStore.chartLoading.eth" :table-loading="marketStore.panelTablesLoading.eth" :gauge-loading="positionsStore.loading" :live-long-value="glattLibStore.categoryAggregates.get('eth')?.longValue" :live-short-value="glattLibStore.categoryAggregates.get('eth')?.shortValue" :long-eur="ethPosition?.longEur" :short-eur="ethPosition?.shortEur" :live-top-positions="glattLibStore.categoryAggregates.get('eth')?.topPositions" /></div>
              </div>
            </div>

            <!-- Seite 2: 5 Karten (Oil + 4 Rohstoff-Karten) -->
            <div class="flex-[0_0_33.333%] min-w-0 shrink-0">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <div class="min-w-0"><CategoryPanel category="oil" title="OIL" symbol="CL=F" sentiment-label="OIL" table-title="Größte Positionen" :chart-points="marketStore.chartData.oil" :table-rows="marketStore.panelTables.oil" :long-pct="oilPosition?.longPct ?? 50" :short-pct="oilPosition?.shortPct ?? 50" :chart-loading="marketStore.chartLoading.oil" :table-loading="marketStore.panelTablesLoading.oil" :gauge-loading="positionsStore.loading" :live-long-value="glattLibStore.categoryAggregates.get('oil')?.longValue" :live-short-value="glattLibStore.categoryAggregates.get('oil')?.shortValue" :long-eur="oilPosition?.longEur" :short-eur="oilPosition?.shortEur" :live-top-positions="glattLibStore.categoryAggregates.get('oil')?.topPositions" /></div>
                <template v-for="(c, idx) in displayedCommoditiesPadded.slice(0, 4)" :key="'p2-' + (c?.id ?? idx)">
                  <div v-if="c" class="min-w-0"><CommodityAssetCard :commodity="c" :model-value="commoditySlotFilters[idx]" :show-filters="false" @update:model-value="(f) => updateSlotFilter(idx, f)" /></div>
                  <div v-else class="min-w-0 rounded-xl border border-border bg-surface/50 min-h-[320px]" />
                </template>
              </div>
            </div>

            <!-- Seite 3: 5 Rohstoff-Karten mit Filter (nur diese haben Filter) -->
            <div class="flex-[0_0_33.333%] min-w-0 shrink-0">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <template v-for="(c, idx) in displayedCommoditiesPaddedPage3" :key="'p3-' + (c?.id ?? idx)">
                  <div v-if="c" class="min-w-0"><CommodityAssetCard :commodity="c" :model-value="commoditySlotFilters[idx]" :show-filters="true" @update:model-value="(f) => updateSlotFilter(idx, f)" /></div>
                  <div v-else class="min-w-0 rounded-xl border border-border bg-surface/50 min-h-[320px]" />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Positions Overview: Titel + Nav (Pfeile + Dots) in einer Zeile -->
      <section>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-[9px] sm:text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
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
          <h2 class="text-[9px] sm:text-xs font-mono font-bold tracking-[0.2em] text-text-secondary uppercase">
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
        MULTI-ASSET TERMINAL v0.1.0
      </span>
      <span class="text-[10px] font-mono tracking-widest"
        :class="glattLibStore.connectionStatus === 'connected' && glattLibStore.isServerRunning
          ? 'text-positive/60'
          : 'text-text-secondary/40'"
      >
        GLATTLIB:
        {{ glattLibStore.connectionStatus === 'connected' && glattLibStore.isServerRunning
            ? 'LIVE'
            : glattLibStore.connectionStatus === 'connected'
              ? (glattLibStore.glattState ?? 'VERBUNDEN')
              : glattLibStore.connectionStatus.toUpperCase()
        }}
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/stores/market.store'
import { usePositionsStore } from '@/stores/positions.store'
import { useTradesStore } from '@/stores/trades.store'
import { useGlattLibStore } from '@/stores/glattlib.store'
import HeaderBar from '@/components/HeaderBar.vue'
import CategoryPanel from '@/components/CategoryPanel.vue'
import CommodityAssetCard from '@/components/CommodityAssetCard.vue'
import PositionsSummary from '@/components/PositionsSummary.vue'
import RecentTradesList from '@/components/RecentTradesList.vue'
import GlattPositionCard from '@/components/GlattPositionCard.vue'
import { COMMODITY_INFOS } from '@/mocks/mock.commodities'
import type { FilterParams } from '@/types/dto'
import type { CommodityCardFilter } from '@/types/commodity'

const marketStore = useMarketStore()
const positionsStore = usePositionsStore()
const tradesStore = useTradesStore()
const glattLibStore = useGlattLibStore()
const { aggregates: positionAggregates } = storeToRefs(positionsStore)

const isRefreshing = ref(false)
const activeFilter = ref<FilterParams>({ location: 'ALL', subBasket: 'EIX' })
const cardsPage = ref(0)
/** Pro-Karte eigener Filter – 4 Slots für Seite 2, 5 Slots für Seite 3 */
const commoditySlotFilters = ref<CommodityCardFilter[]>([
  { commodityId: 'gold', side: 'ALL', leverage: 'ALL' },
  { commodityId: 'silver', side: 'ALL', leverage: 'ALL' },
  { commodityId: 'platinum', side: 'ALL', leverage: 'ALL' },
  { commodityId: 'oil', side: 'ALL', leverage: 'ALL' },
  { commodityId: 'copper', side: 'ALL', leverage: 'ALL' },
])

/** Rohstoff-Info für Seite 2 (4 Karten ohne Filter) */
const displayedCommoditiesPadded = computed(() => {
  return commoditySlotFilters.value.map(f => COMMODITY_INFOS.find(c => c.id === f.commodityId) ?? null)
})

/** Rohstoff-Info für Seite 3 (5 Karten mit Filter) */
const displayedCommoditiesPaddedPage3 = computed(() => {
  return displayedCommoditiesPadded.value.slice(0, 5)
})

function updateSlotFilter(index: number, filter: CommodityCardFilter) {
  commoditySlotFilters.value = commoditySlotFilters.value.map((f, i) =>
    i === index ? filter : f
  )
}
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
  glattLibStore.connect()
})

onUnmounted(() => {
  glattLibStore.disconnect()
})
</script>
