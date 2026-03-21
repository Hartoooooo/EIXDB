/**
 * MarketDataService – Interface + Stub.
 *
 * TODO: HTTP-Anbindung implementieren.
 *   Die Methoden hier durch HTTP-Calls gegen /api/market/* ersetzen.
 *   Beispiel:
 *     getTopTickers: () => http.get('/api/market/tickers', { params: filter })
 *     getCategoryChart: () => http.get(`/api/market/chart/${category}`, { params: filter })
 *     getPanelTable: () => http.get(`/api/market/panel/${category}`, { params: filter })
 */

import type { MarketTicker, ChartPoint, PanelTableRow, FilterParams, AssetCategory } from '@/types/dto'
import { mockTickers, mockChartData, mockPanelTables } from '@/mocks/mock.market'

export interface IMarketDataService {
  getTopTickers(filter: FilterParams): Promise<MarketTicker[]>
  getCategoryChart(category: AssetCategory, filter: FilterParams): Promise<ChartPoint[]>
  getPanelTable(category: AssetCategory, filter: FilterParams): Promise<PanelTableRow[]>
}

class MockMarketDataService implements IMarketDataService {
  async getTopTickers(_filter: FilterParams): Promise<MarketTicker[]> {
    return mockTickers
  }

  async getCategoryChart(_category: AssetCategory, _filter: FilterParams): Promise<ChartPoint[]> {
    return mockChartData[_category] ?? []
  }

  async getPanelTable(_category: AssetCategory, _filter: FilterParams): Promise<PanelTableRow[]> {
    return mockPanelTables[_category] ?? []
  }
}

export const marketService: IMarketDataService = new MockMarketDataService()
