/**
 * Rohstoff-Filter und -Daten für die 3. Asset-Cards-Seite
 */

export type CommodityId = 'gold' | 'silver' | 'platinum' | 'oil' | 'copper' | 'gas'

export type CommoditySideFilter = 'ALL' | 'LONG' | 'SHORT'

export type CommodityLeverageFilter = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'

export interface CommodityFilter {
  commodities: CommodityId[]
  side: CommoditySideFilter
  leverage: CommodityLeverageFilter
}

/** Pro-Karten-Filter (Rohstoff + Seite + Hebel je Karte) */
export interface CommodityCardFilter {
  commodityId: CommodityId
  side: CommoditySideFilter
  leverage: CommodityLeverageFilter
}

export interface CommodityPosition {
  isin: string
  label: string
  totalExposure: number
  longExposure: number
  shortExposure: number
  leverage: number
  side: 'long' | 'short'
}

export interface CommodityInfo {
  id: CommodityId
  name: string
  /** Kurzform für kompakte Darstellung (z.B. Platin statt Platinum) */
  shortName?: string
  symbol: string
  /** Chart-Farbakzent (Hex) */
  accentColor: string
}
