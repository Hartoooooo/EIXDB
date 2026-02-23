import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MarketTicker, ChartPoint, PanelTableRow, FilterParams } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { marketService } from '@/services/market.service'

const DEFAULT_FILTER: FilterParams = { location: 'ALL', subBasket: 'EIX' }

export const useMarketStore = defineStore('market', () => {
  const tickers = ref<MarketTicker[]>([])
  const tickersLoading = ref(false)
  const tickersError = ref<string | null>(null)

  const chartData = ref<Record<AssetCategory, ChartPoint[]>>({
    gold: [], silver: [], crypto: [], platinum: [], eth: [], oil: [],
  })
  const chartLoading = ref<Record<AssetCategory, boolean>>({
    gold: false, silver: false, crypto: false, platinum: false, eth: false, oil: false,
  })
  const chartError = ref<Record<AssetCategory, string | null>>({
    gold: null, silver: null, crypto: null, platinum: null, eth: null, oil: null,
  })

  const panelTables = ref<Record<AssetCategory, PanelTableRow[]>>({
    gold: [], silver: [], crypto: [], platinum: [], eth: [], oil: [],
  })
  const panelTablesLoading = ref<Record<AssetCategory, boolean>>({
    gold: false, silver: false, crypto: false, platinum: false, eth: false, oil: false,
  })

  async function fetchTickers(filter: FilterParams = DEFAULT_FILTER) {
    tickersLoading.value = true
    tickersError.value = null
    try {
      tickers.value = await marketService.getTopTickers(filter)
    } catch (e) {
      tickersError.value = e instanceof Error ? e.message : 'Fehler beim Laden der Ticker'
    } finally {
      tickersLoading.value = false
    }
  }

  async function fetchCategoryChart(category: AssetCategory, filter: FilterParams = DEFAULT_FILTER) {
    chartLoading.value[category] = true
    chartError.value[category] = null
    try {
      chartData.value[category] = await marketService.getCategoryChart(category, filter)
    } catch (e) {
      chartError.value[category] = e instanceof Error ? e.message : 'Fehler beim Laden des Charts'
    } finally {
      chartLoading.value[category] = false
    }
  }

  async function fetchPanelTable(category: AssetCategory, filter: FilterParams = DEFAULT_FILTER) {
    panelTablesLoading.value[category] = true
    try {
      panelTables.value[category] = await marketService.getPanelTable(category, filter)
    } finally {
      panelTablesLoading.value[category] = false
    }
  }

  async function fetchAll(filter: FilterParams = DEFAULT_FILTER) {
    await Promise.all([
      fetchTickers(filter),
      fetchCategoryChart('gold',     filter),
      fetchCategoryChart('silver',   filter),
      fetchCategoryChart('crypto',   filter),
      fetchCategoryChart('platinum', filter),
      fetchCategoryChart('eth',      filter),
      fetchCategoryChart('oil',      filter),
      fetchPanelTable('gold',     filter),
      fetchPanelTable('silver',   filter),
      fetchPanelTable('crypto',   filter),
      fetchPanelTable('platinum', filter),
      fetchPanelTable('eth',      filter),
      fetchPanelTable('oil',      filter),
    ])
  }

  return {
    tickers, tickersLoading, tickersError,
    chartData, chartLoading, chartError,
    panelTables, panelTablesLoading,
    fetchTickers, fetchCategoryChart, fetchPanelTable, fetchAll,
  }
})
