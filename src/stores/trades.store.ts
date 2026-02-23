import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Trade } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { tradesService } from '@/services/trades.service'

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

  async function fetchRecentTrades(category: AssetCategory, limit = 5) {
    loading.value[category] = true
    error.value[category] = null
    try {
      trades.value[category] = await tradesService.getRecentTrades(category, limit)
    } catch (e) {
      error.value[category] = e instanceof Error ? e.message : 'Fehler beim Laden der Trades'
    } finally {
      loading.value[category] = false
    }
  }

  async function fetchAll(limit = 5) {
    await Promise.all([
      fetchRecentTrades('gold', limit),
      fetchRecentTrades('silver', limit),
      fetchRecentTrades('crypto', limit),
      fetchRecentTrades('platinum', limit),
      fetchRecentTrades('eth', limit),
      fetchRecentTrades('oil', limit),
    ])
  }

  return { trades, loading, error, fetchRecentTrades, fetchAll }
})
