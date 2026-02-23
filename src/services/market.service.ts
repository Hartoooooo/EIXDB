/**
 * MarketDataService – Interface + Mock-Implementierung.
 *
 * Für die Backend-Integration: Die Methoden hier durch HTTP-Calls
 * gegen /api/market/* ersetzen und Mock-Imports entfernen.
 * FilterParams wird ans Backend übergeben, sobald es verbunden ist.
 */

import type { MarketTicker, ChartPoint, PanelTableRow, FilterParams } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { mockTickers, mockChartData, mockPanelTables } from '@/mocks/mock.market'

export interface IMarketDataService {
  getTopTickers(filter: FilterParams): Promise<MarketTicker[]>
  getCategoryChart(category: AssetCategory, filter: FilterParams): Promise<ChartPoint[]>
  getPanelTable(category: AssetCategory, filter: FilterParams): Promise<PanelTableRow[]>
}

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockMarketDataService implements IMarketDataService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTopTickers(_filter: FilterParams): Promise<MarketTicker[]> {
    await delay(300)
    return [...mockTickers]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getCategoryChart(category: AssetCategory, _filter: FilterParams): Promise<ChartPoint[]> {
    await delay(400)
    return [...mockChartData[category]]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPanelTable(category: AssetCategory, _filter: FilterParams): Promise<PanelTableRow[]> {
    await delay(350)
    return [...mockPanelTables[category]]
  }
}

export const marketService: IMarketDataService = new MockMarketDataService()
