/**
 * TradesService – Interface + Stub.
 *
 * TODO: HTTP-Anbindung implementieren.
 *   Beispiel:
 *     getRecentTrades: () => http.get('/api/trades', { params: { category, limit, ...filter } })
 */

import type { Trade, FilterParams, AssetCategory } from '@/types/dto'
import { mockTrades } from '@/mocks/mock.trades'

export interface ITradesService {
  getRecentTrades(category: AssetCategory, filter: FilterParams, limit?: number): Promise<Trade[]>
}

function matchesFilter(t: Trade, filter: FilterParams): boolean {
  if (t.subBasket !== filter.subBasket) return false
  if (filter.location === 'ALL') return true
  if (filter.location === 'BER') return t.basket === 'B'
  if (filter.location === 'MUN') return t.basket === 'M'
  return true
}

class MockTradesService implements ITradesService {
  async getRecentTrades(
    category: AssetCategory,
    filter: FilterParams,
    limit = 5,
  ): Promise<Trade[]> {
    const filtered = mockTrades
      .filter(t => t.category === category && matchesFilter(t, filter))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return filtered.slice(0, limit)
  }
}

export const tradesService: ITradesService = new MockTradesService()
