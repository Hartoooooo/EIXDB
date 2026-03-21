/**
 * GlattLib – TypeScript-Typen für Live-Bestandsdaten
 *
 * Diese Typen spiegeln die Datenstrukturen wider, die das GlattLib-.NET-Backend
 * via SignalR an das Frontend sendet.
 */

/**
 * Server-seitiger Zustand des GlattLib-Dienstes (Enum GlattState).
 */
export type GlattState = 'Stopped' | 'Stopping' | 'Running' | 'Starting'

/**
 * Rohes Position-Objekt, wie es vom Backend via SignalR übermittelt wird.
 * Enthält ausschließlich die für das Frontend relevanten Felder.
 *
 * TODO: Exakte JSON-Property-Namen mit dem Backend-Team abstimmen.
 *   - size        → C#: Core.BidAskTotalQty (vermutlich "bidAskTotalQty" im JSON)
 *   - value       → C#: Position.Value
 *   - profit      → C#: Position.Profit
 */
export interface RawGlattPosition {
  bidAskTotalQty: number
  value: number | null
  profit: number | null
}

/**
 * Normierte Position im Frontend-State (nach Mapping aus RawGlattPosition).
 * ProfitPct wird clientseitig berechnet.
 */
export interface GlattPositionData {
  isin: string
  size: number
  value: number | null
  profit: number | null
  /** Berechnet als: Profit / (Value - Profit) * 100 */
  profitPct: number | null
  /** Kategorie aus dem Kategorie-Lookup-Service (null = unkategorisiert) */
  category: string | null
}

/**
 * Eine gruppierte Kategorie-Karte mit allen enthaltenen Positionen
 * und aggregierten Summen.
 */
export interface GlattCategoryGroup {
  /** Angezeigter Kategorie-Name ("Unkategorisiert" wenn keine Kategorie gefunden) */
  category: string
  /** true wenn diese Gruppe die Auffang-Gruppe für unkategorisierte Positionen ist */
  isUncategorized: boolean
  /** Positionen absteigend nach Value sortiert (null ans Ende) */
  positions: GlattPositionData[]
  /** Summe aller value-Werte (null-Werte werden ignoriert) */
  totalValue: number
  /** Summe aller profit-Werte (null-Werte werden ignoriert) */
  totalProfit: number
}
