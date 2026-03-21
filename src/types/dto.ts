/**
 * Data Transfer Objects – spiegeln exakt die .NET/C# DTOs auf der Backend-Seite.
 * Änderungen hier müssen synchron mit dem Backend abgestimmt werden.
 */

export type AssetCategory = 'gold' | 'silver' | 'crypto' | 'platinum' | 'eth' | 'oil'

export type LocationFilter = 'ALL' | 'BER' | 'MUN'
export type SubBasketFilter = 'EIX' | 'HAM'
export type BasketCode = 'B' | 'M'

export interface FilterParams {
  location: LocationFilter
  subBasket: SubBasketFilter
}

export interface MarketTicker {
  symbol: string
  displayName: string
  price: number
  changePct: number
  time: string // ISO 8601
}

export interface ChartPoint {
  time: string // ISO 8601 oder epoch string
  value: number
}

export interface PositionAggregate {
  category: AssetCategory
  longPct: number
  shortPct: number
  longEur: number
  shortEur: number
  basket: BasketCode
  subBasket: SubBasketFilter
}

export interface Trade {
  id: string
  category: AssetCategory
  timestamp: string // ISO 8601
  symbol: string
  side: 'long' | 'short'
  quantity: number
  positionLabel: string
  last: number
  changePct: number
  basket: BasketCode
  subBasket: SubBasketFilter
}

export interface PanelTableRow {
  label: string
  totalExposure: string
  buyExposure: string
  sellExposure: string
}
