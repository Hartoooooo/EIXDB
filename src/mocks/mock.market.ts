import type { MarketTicker, ChartPoint, PanelTableRow } from '@/types/dto'
import type { AssetCategory } from '@/types/dto'

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

export const mockPanelTables: Record<AssetCategory, PanelTableRow[]> = {
  gold: [
    { label: 'GLD ETF',    vol: '2.4M',  chgPct:  0.38 },
    { label: 'GOLD_MINING',vol: '980K',  chgPct:  2.15 },
    { label: 'IAU ETF',    vol: '1.1M',  chgPct:  0.21 },
    { label: 'NEM',        vol: '540K',  chgPct: -0.44 },
  ],
  silver: [
    { label: 'SLV ETF',    vol: '3.1M',  chgPct: -0.31 },
    { label: 'PSLV',       vol: '870K',  chgPct:  0.07 },
    { label: 'CPER',       vol: '220K',  chgPct: -0.88 },
    { label: 'SILJ',       vol: '450K',  chgPct:  0.55 },
  ],
  crypto: [
    { label: 'BTC-USD',   vol: '22.1B', chgPct:  2.08 },
    { label: 'BTC/EUR',   vol: '8.4B',  chgPct:  1.95 },
    { label: 'BTC-PERP',  vol: '12.3B', chgPct:  2.12 },
    { label: 'CBRT',      vol: '1.2B',  chgPct:  1.88 },
  ],
  platinum: [
    { label: 'PL=F',      vol: '1.2M',  chgPct: -0.15 },
    { label: 'PPLT',      vol: '420K', chgPct:  0.22 },
    { label: 'PTM',       vol: '180K', chgPct: -0.41 },
    { label: 'SBSW',      vol: '350K', chgPct:  0.08 },
  ],
  eth: [
    { label: 'ETH/USD',   vol: '18.2B', chgPct:  1.48 },
    { label: 'ETH/EUR',   vol: '5.1B',  chgPct:  1.35 },
    { label: 'ETH-PERP',  vol: '9.8B',  chgPct:  1.52 },
    { label: 'LIDO',      vol: '420M', chgPct:  0.88 },
  ],
  oil: [
    { label: 'CL=F',      vol: '285K',  chgPct: -0.52 },
    { label: 'BZ=F',      vol: '142K',  chgPct: -0.38 },
    { label: 'USO',       vol: '98K',   chgPct: -0.44 },
    { label: 'XLE',       vol: '45M',   chgPct:  0.12 },
  ],
}
