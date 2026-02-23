import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MarketTicker, ChartPoint, PanelTableRow } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { marketService } from '@/services/market.service'

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

  async function fetchTickers() {
    tickersLoading.value = true
    tickersError.value = null
    try {
      tickers.value = await marketService.getTopTickers()
    } catch (e) {
      tickersError.value = e instanceof Error ? e.message : 'Fehler beim Laden der Ticker'
    } finally {
      tickersLoading.value = false
    }
  }

  async function fetchCategoryChart(category: AssetCategory) {
    chartLoading.value[category] = true
    chartError.value[category] = null
    try {
      chartData.value[category] = await marketService.getCategoryChart(category)
    } catch (e) {
      chartError.value[category] = e instanceof Error ? e.message : 'Fehler beim Laden des Charts'
    } finally {
      chartLoading.value[category] = false
    }
  }

  async function fetchPanelTable(category: AssetCategory) {
    panelTablesLoading.value[category] = true
    try {
      panelTables.value[category] = await marketService.getPanelTable(category)
    } finally {
      panelTablesLoading.value[category] = false
    }
  }

  async function fetchAll() {
    await Promise.all([
      fetchTickers(),
      fetchCategoryChart('gold'),
      fetchCategoryChart('silver'),
      fetchCategoryChart('crypto'),
      fetchCategoryChart('platinum'),
      fetchCategoryChart('eth'),
      fetchCategoryChart('oil'),
      fetchPanelTable('gold'),
      fetchPanelTable('silver'),
      fetchPanelTable('crypto'),
      fetchPanelTable('platinum'),
      fetchPanelTable('eth'),
      fetchPanelTable('oil'),
    ])
  }

  return {
    tickers, tickersLoading, tickersError,
    chartData, chartLoading, chartError,
    panelTables, panelTablesLoading,
    fetchTickers, fetchCategoryChart, fetchPanelTable, fetchAll,
  }
})
