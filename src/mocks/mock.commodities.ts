import type { ChartPoint } from '@/types/dto'
import type { CommodityId, CommodityPosition, CommodityInfo } from '@/types/commodity'

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
    points.push({ time: new Date(t).toISOString(), value: parseFloat(value.toFixed(4)) })
    t += stepMs
  }
  return points.length ? points : [{ time: now.toISOString(), value: base }]
}

/** Chart-Daten für Rohstoffe ohne eigene AssetCategory (Kupfer, Gas) */
const commodityChartBases: Record<CommodityId, number> = {
  gold: 2845.65,
  silver: 23.13,
  platinum: 998.5,
  oil: 74.2,
  copper: 4.12,
  gas: 2.85,
}

export function getCommodityChartData(commodityId: CommodityId): ChartPoint[] {
  const base = commodityChartBases[commodityId] ?? 100
  return generateChartPoints(base, 0.002)
}

/** Kategorisierte Rohstoffe aus der DB (Mock) */
export const COMMODITY_INFOS: CommodityInfo[] = [
  { id: 'gold', name: 'Gold', symbol: 'GC=F', accentColor: '#F5C542' },
  { id: 'silver', name: 'Silber', symbol: 'SI=F', accentColor: '#C0C0C0' },
  { id: 'platinum', name: 'Platin', symbol: 'PL=F', accentColor: '#E5E4E2' },
  { id: 'oil', name: 'Öl', symbol: 'CL=F', accentColor: '#8B4513' },
  { id: 'copper', name: 'Kupfer', symbol: 'HG=F', accentColor: '#B87333' },
  { id: 'gas', name: 'Gas', symbol: 'NG=F', accentColor: '#4A90A4' },
]

/** Mock-Positionen pro Rohstoff: ISIN, Exposure, Hebel */
const positionsByCommodity: Record<CommodityId, CommodityPosition[]> = {
  gold: [
    { isin: 'XS123', label: 'GLD ETF', totalExposure: 125000, longExposure: 125000, shortExposure: 0, leverage: 1, side: 'long' },
    { isin: 'XS124', label: 'GC=F Future', totalExposure: 98000, longExposure: 0, shortExposure: 98000, leverage: 5, side: 'short' },
    { isin: 'XS125', label: 'IAU ETF', totalExposure: 71000, longExposure: 71000, shortExposure: 0, leverage: 1, side: 'long' },
    { isin: 'XS126', label: 'NEM', totalExposure: 54000, longExposure: 54000, shortExposure: 0, leverage: 12, side: 'long' },
    { isin: 'XS127', label: 'GOLD CFD', totalExposure: 32000, longExposure: 0, shortExposure: 32000, leverage: 20, side: 'short' },
  ],
  silver: [
    { isin: 'XS130', label: 'SLV ETF', totalExposure: 142000, longExposure: 0, shortExposure: 142000, leverage: 1, side: 'short' },
    { isin: 'XS131', label: 'SI=F Future', totalExposure: 87000, longExposure: 87000, shortExposure: 0, leverage: 8, side: 'long' },
    { isin: 'XS132', label: 'PSLV', totalExposure: 45000, longExposure: 45000, shortExposure: 0, leverage: 2, side: 'long' },
    { isin: 'XS133', label: 'SILJ', totalExposure: 28000, longExposure: 0, shortExposure: 28000, leverage: 15, side: 'short' },
  ],
  platinum: [
    { isin: 'XS140', label: 'PL=F Future', totalExposure: 98000, longExposure: 0, shortExposure: 98000, leverage: 6, side: 'short' },
    { isin: 'XS141', label: 'PPLT', totalExposure: 42000, longExposure: 42000, shortExposure: 0, leverage: 1, side: 'long' },
    { isin: 'XS142', label: 'SBSW', totalExposure: 35000, longExposure: 0, shortExposure: 35000, leverage: 10, side: 'short' },
    { isin: 'XS143', label: 'PTM CFD', totalExposure: 22000, longExposure: 22000, shortExposure: 0, leverage: 25, side: 'long' },
  ],
  oil: [
    { isin: 'XS150', label: 'CL=F', totalExposure: 88000, longExposure: 88000, shortExposure: 0, leverage: 5, side: 'long' },
    { isin: 'XS151', label: 'BZ=F', totalExposure: 42000, longExposure: 0, shortExposure: 42000, leverage: 12, side: 'short' },
    { isin: 'XS152', label: 'USO ETF', totalExposure: 31000, longExposure: 31000, shortExposure: 0, leverage: 2, side: 'long' },
    { isin: 'XS153', label: 'XLE', totalExposure: 45000, longExposure: 45000, shortExposure: 0, leverage: 1, side: 'long' },
  ],
  copper: [
    { isin: 'XS160', label: 'HG=F Future', totalExposure: 65000, longExposure: 65000, shortExposure: 0, leverage: 8, side: 'long' },
    { isin: 'XS161', label: 'CPER', totalExposure: 38000, longExposure: 38000, shortExposure: 0, leverage: 2, side: 'long' },
    { isin: 'XS162', label: 'FCX', totalExposure: 52000, longExposure: 0, shortExposure: 52000, leverage: 4, side: 'short' },
  ],
  gas: [
    { isin: 'XS170', label: 'NG=F Future', totalExposure: 44000, longExposure: 44000, shortExposure: 0, leverage: 10, side: 'long' },
    { isin: 'XS171', label: 'UNG ETF', totalExposure: 28000, longExposure: 0, shortExposure: 28000, leverage: 3, side: 'short' },
    { isin: 'XS172', label: 'BOIL', totalExposure: 19000, longExposure: 19000, shortExposure: 0, leverage: 18, side: 'long' },
  ],
}

export function getCommodityPositions(
  commodityId: CommodityId,
  sideFilter: 'ALL' | 'LONG' | 'SHORT',
  leverageFilter: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH',
): CommodityPosition[] {
  const raw = positionsByCommodity[commodityId] ?? []
  return raw.filter(p => {
    if (sideFilter === 'LONG' && p.side !== 'long') return false
    if (sideFilter === 'SHORT' && p.side !== 'short') return false
    if (leverageFilter === 'LOW' && (p.leverage < 1 || p.leverage > 3)) return false
    if (leverageFilter === 'MEDIUM' && (p.leverage <= 3 || p.leverage > 10)) return false
    if (leverageFilter === 'HIGH' && p.leverage <= 10) return false
    return true
  })
}
