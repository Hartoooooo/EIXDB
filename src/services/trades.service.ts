/**
 * TradesService – Interface + Mock-Implementierung.
 *
 * Für die Backend-Integration: getRecentTrades() durch
 * HTTP-Call gegen /api/trades?category=...&limit=...&location=...&subBasket=... ersetzen.
 */

import type { Trade, FilterParams } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { mockTrades } from '@/mocks/mock.trades'

export interface ITradesService {
  getRecentTrades(category: AssetCategory, filter: FilterParams, limit?: number): Promise<Trade[]>
}

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockTradesService implements ITradesService {
  async getRecentTrades(category: AssetCategory, filter: FilterParams, limit = 5): Promise<Trade[]> {
    await delay(300)
    return mockTrades
      .filter(t => {
        if (t.category !== category) return false
        if (filter.location === 'BER' && t.basket !== 'B') return false
        if (filter.location === 'MUN' && t.basket !== 'M') return false
        if (t.subBasket !== filter.subBasket) return false
        return true
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }
}

export const tradesService: ITradesService = new MockTradesService()
