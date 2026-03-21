import type { MarketTicker, ChartPoint, PanelTableRow } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'
import { formatCurrencyEUR } from '@/utils/format'

export const mockTickers: MarketTicker[] = [
  { symbol: 'GC=F',  displayName: 'GC=F',  price: 2845.65, changePct:  0.09, time: new Date().toISOString() },
  { symbol: 'SI=F',  displayName: 'SI=F',  price: 23.13,   changePct:  0.09, time: new Date().toISOString() },
  { symbol: 'BTC',   displayName: 'BTC',   price: 64448.69, changePct:  2.08, time: new Date().toISOString() },
  { symbol: 'ETH',   displayName: 'ETH',   price: 3449.66, changePct:  1.48, time: new Date().toISOString() },
  { symbol: 'SOL',   displayName: 'SOL',   price: 146.20,  changePct: -1.09, time: new Date().toISOString() },
  { symbol: 'XRP',   displayName: 'XRP',   price: 0.62,    changePct:  1.15, time: new Date().toISOString() },
  { symbol: 'DOGE',  displayName: 'DOGE',  price: 0.17,    changePct: -0.20, time: new Date().toISOString() },
]

/** Handelszeit: 7:30–22:00, Punkte alle 5 Min von 7:30 bis jetzt */
function generateChartPoints(base: number, volatility = 0.002): ChartPoint[] {
  const points: ChartPoint[] = []
  let value = base
  const now = new Date()
  const start = new Date(now)
  start.setHours(7, 30, 0, 0)
  const stepMs = 5 * 60 * 1000
  let t = start.getTime()
  const endMs = now.getTime()
  while (t <= endMs) {
    value = value * (1 + (Math.random() - 0.5) * volatility)
    points.push({
      time: new Date(t).toISOString(),
      value: parseFloat(value.toFixed(4)),
    })
    t += stepMs
  }
  return points.length ? points : [{ time: now.toISOString(), value: base }]
}

export const mockChartData: Record<AssetCategory, ChartPoint[]> = {
  gold:     generateChartPoints(2845.65,  0.0018),
  silver:   generateChartPoints(23.13,    0.0025),
  crypto:   generateChartPoints(64448.69, 0.006),
  platinum: generateChartPoints(998.5,    0.0018),
  eth:      generateChartPoints(3449.66,  0.005),
  oil:      generateChartPoints(74.20,    0.003),
}

/** Position mit Gesamt- sowie Buy- und Sell-Exposure (in €) */
function pos(label: string, total: number, buy: number, sell: number): PanelTableRow {
  return {
    label,
    totalExposure: formatCurrencyEUR(total),
    buyExposure: formatCurrencyEUR(buy),
    sellExposure: formatCurrencyEUR(sell),
  }
}

export const mockPanelTables: Record<AssetCategory, PanelTableRow[]> = {
  gold: [
    pos('GLD ETF', 125000, 125000, 0),
    pos('GOLD_MINING', 98000, 0, 98000),
    pos('IAU ETF', 71000, 71000, 0),
    pos('NEM', 54000, 54000, 0),
  ],
  silver: [
    pos('SLV ETF', 142000, 0, 142000),
    pos('PSLV', 87000, 87000, 0),
    pos('CPER', 22000, 22000, 0),
    pos('SILJ', 45000, 0, 45000),
  ],
  crypto: [
    pos('BTC-USD', 182000, 182000, 0),
    pos('BTC/EUR', 84000, 0, 84000),
    pos('BTC-PERP', 123000, 123000, 0),
    pos('CBRT', 42000, 42000, 0),
  ],
  platinum: [
    pos('PL=F', 98000, 0, 98000),
    pos('PPLT', 42000, 42000, 0),
    pos('PTM', 18000, 18000, 0),
    pos('SBSW', 35000, 0, 35000),
  ],
  eth: [
    pos('ETH/USD', 165000, 165000, 0),
    pos('ETH/EUR', 51000, 0, 51000),
    pos('ETH-PERP', 98000, 98000, 0),
    pos('LIDO', 42000, 42000, 0),
  ],
  oil: [
    pos('CL=F', 88000, 88000, 0),
    pos('BZ=F', 42000, 0, 42000),
    pos('USO', 31000, 31000, 0),
    pos('XLE', 45000, 45000, 0),
  ],
}
