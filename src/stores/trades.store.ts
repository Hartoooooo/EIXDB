import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Trade, FilterParams } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { tradesService } from '@/services/trades.service'

const DEFAULT_FILTER: FilterParams = { location: 'ALL', exchange: 'EIX' }

export const useTradesStore = defineStore('trades', () => {
  const trades = ref<Record<AssetCategory, Trade[]>>({
    gold: [], silver: [], crypto: [], platinum: [], eth: [], oil: [],
  })
  const loading = ref<Record<AssetCategory, boolean>>({
    gold: false, silver: false, crypto: false, platinum: false, eth: false, oil: false,
  })
  const error = ref<Record<AssetCategory, string | null>>({
    gold: null, silver: null, crypto: null, platinum: null, eth: null, oil: null,
  })

  async function fetchRecentTrades(category: AssetCategory, filter: FilterParams = DEFAULT_FILTER, limit = 5) {
    loading.value[category] = true
    error.value[category] = null
    try {
      trades.value[category] = await tradesService.getRecentTrades(category, filter, limit)
    } catch (e) {
      error.value[category] = e instanceof Error ? e.message : 'Fehler beim Laden der Trades'
    } finally {
      loading.value[category] = false
    }
  }

  async function fetchAll(filter: FilterParams = DEFAULT_FILTER, limit = 5) {
    await Promise.all([
      fetchRecentTrades('gold',     filter, limit),
      fetchRecentTrades('silver',   filter, limit),
      fetchRecentTrades('crypto',   filter, limit),
      fetchRecentTrades('platinum', filter, limit),
      fetchRecentTrades('eth',      filter, limit),
      fetchRecentTrades('oil',      filter, limit),
    ])
  }

  return { trades, loading, error, fetchRecentTrades, fetchAll }
})
