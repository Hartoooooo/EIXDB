/**
 * MarketDataService – Interface + Mock-Implementierung.
 *
 * Für die Backend-Integration: Die Methoden hier durch HTTP-Calls
 * gegen /api/market/* ersetzen und Mock-Imports entfernen.
 */

import type { MarketTicker, ChartPoint, PanelTableRow } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { mockTickers, mockChartData, mockPanelTables } from '@/mocks/mock.market'

export interface IMarketDataService {
  getTopTickers(): Promise<MarketTicker[]>
  getCategoryChart(category: AssetCategory): Promise<ChartPoint[]>
  getPanelTable(category: AssetCategory): Promise<PanelTableRow[]>
}

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockMarketDataService implements IMarketDataService {
  async getTopTickers(): Promise<MarketTicker[]> {
    await delay(300)
    return [...mockTickers]
  }

  async getCategoryChart(category: AssetCategory): Promise<ChartPoint[]> {
    await delay(400)
    return [...mockChartData[category]]
  }

  async getPanelTable(category: AssetCategory): Promise<PanelTableRow[]> {
    await delay(350)
    return [...mockPanelTables[category]]
  }
}

export const marketService: IMarketDataService = new MockMarketDataService()
