import type { PositionAggregate } from '@/types/dto'

// ALL – EIX
const positionsAllEIX: PositionAggregate[] = [
  { category: 'gold',     longPct: 68, shortPct: 32, longEur: 125000, shortEur:  59000, basket: 'B', exchange: 'EIX' },
  { category: 'silver',   longPct: 42, shortPct: 58, longEur:  38000, shortEur:  52000, basket: 'B', exchange: 'EIX' },
  { category: 'crypto',   longPct: 55, shortPct: 45, longEur:  91000, shortEur:  74000, basket: 'B', exchange: 'EIX' },
  { category: 'platinum', longPct: 60, shortPct: 40, longEur:  42000, shortEur:  28000, basket: 'M', exchange: 'EIX' },
  { category: 'eth',      longPct: 48, shortPct: 52, longEur:  66000, shortEur:  71000, basket: 'M', exchange: 'EIX' },
  { category: 'oil',      longPct: 72, shortPct: 28, longEur:  88000, shortEur:  34000, basket: 'M', exchange: 'EIX' },
]

// ALL – HAM
const positionsAllHAM: PositionAggregate[] = [
  { category: 'gold',     longPct: 61, shortPct: 39, longEur: 108000, shortEur:  67000, basket: 'B', exchange: 'HAM' },
  { category: 'silver',   longPct: 50, shortPct: 50, longEur:  44000, shortEur:  44000, basket: 'B', exchange: 'HAM' },
  { category: 'crypto',   longPct: 59, shortPct: 41, longEur:  83000, shortEur:  57000, basket: 'B', exchange: 'HAM' },
  { category: 'platinum', longPct: 54, shortPct: 46, longEur:  36000, shortEur:  31000, basket: 'M', exchange: 'HAM' },
  { category: 'eth',      longPct: 44, shortPct: 56, longEur:  58000, shortEur:  74000, basket: 'M', exchange: 'HAM' },
  { category: 'oil',      longPct: 65, shortPct: 35, longEur:  75000, shortEur:  40000, basket: 'M', exchange: 'HAM' },
]

// BER (Basket B) – EIX
const positionsBerEIX: PositionAggregate[] = [
  { category: 'gold',     longPct: 72, shortPct: 28, longEur:  98000, shortEur:  38000, basket: 'B', exchange: 'EIX' },
  { category: 'silver',   longPct: 38, shortPct: 62, longEur:  29000, shortEur:  47000, basket: 'B', exchange: 'EIX' },
  { category: 'crypto',   longPct: 63, shortPct: 37, longEur:  74000, shortEur:  43000, basket: 'B', exchange: 'EIX' },
  { category: 'platinum', longPct: 55, shortPct: 45, longEur:  31000, shortEur:  25000, basket: 'B', exchange: 'EIX' },
  { category: 'eth',      longPct: 52, shortPct: 48, longEur:  55000, shortEur:  51000, basket: 'B', exchange: 'EIX' },
  { category: 'oil',      longPct: 68, shortPct: 32, longEur:  61000, shortEur:  29000, basket: 'B', exchange: 'EIX' },
]

// BER (Basket B) – HAM
const positionsBerHAM: PositionAggregate[] = [
  { category: 'gold',     longPct: 65, shortPct: 35, longEur:  82000, shortEur:  44000, basket: 'B', exchange: 'HAM' },
  { category: 'silver',   longPct: 44, shortPct: 56, longEur:  33000, shortEur:  42000, basket: 'B', exchange: 'HAM' },
  { category: 'crypto',   longPct: 57, shortPct: 43, longEur:  68000, shortEur:  51000, basket: 'B', exchange: 'HAM' },
  { category: 'platinum', longPct: 49, shortPct: 51, longEur:  27000, shortEur:  28000, basket: 'B', exchange: 'HAM' },
  { category: 'eth',      longPct: 46, shortPct: 54, longEur:  47000, shortEur:  55000, basket: 'B', exchange: 'HAM' },
  { category: 'oil',      longPct: 61, shortPct: 39, longEur:  53000, shortEur:  34000, basket: 'B', exchange: 'HAM' },
]

// MUN (Basket M) – EIX
const positionsMunEIX: PositionAggregate[] = [
  { category: 'gold',     longPct: 58, shortPct: 42, longEur:  71000, shortEur:  51000, basket: 'M', exchange: 'EIX' },
  { category: 'silver',   longPct: 47, shortPct: 53, longEur:  22000, shortEur:  25000, basket: 'M', exchange: 'EIX' },
  { category: 'crypto',   longPct: 51, shortPct: 49, longEur:  49000, shortEur:  47000, basket: 'M', exchange: 'EIX' },
  { category: 'platinum', longPct: 64, shortPct: 36, longEur:  38000, shortEur:  21000, basket: 'M', exchange: 'EIX' },
  { category: 'eth',      longPct: 43, shortPct: 57, longEur:  35000, shortEur:  46000, basket: 'M', exchange: 'EIX' },
  { category: 'oil',      longPct: 74, shortPct: 26, longEur:  62000, shortEur:  22000, basket: 'M', exchange: 'EIX' },
]

// MUN (Basket M) – HAM
const positionsMunHAM: PositionAggregate[] = [
  { category: 'gold',     longPct: 53, shortPct: 47, longEur:  60000, shortEur:  53000, basket: 'M', exchange: 'HAM' },
  { category: 'silver',   longPct: 55, shortPct: 45, longEur:  26000, shortEur:  21000, basket: 'M', exchange: 'HAM' },
  { category: 'crypto',   longPct: 48, shortPct: 52, longEur:  43000, shortEur:  46000, basket: 'M', exchange: 'HAM' },
  { category: 'platinum', longPct: 59, shortPct: 41, longEur:  31000, shortEur:  22000, basket: 'M', exchange: 'HAM' },
  { category: 'eth',      longPct: 40, shortPct: 60, longEur:  29000, shortEur:  44000, basket: 'M', exchange: 'HAM' },
  { category: 'oil',      longPct: 70, shortPct: 30, longEur:  57000, shortEur:  24000, basket: 'M', exchange: 'HAM' },
]

export const mockPositionsByFilter: Record<string, PositionAggregate[]> = {
  'ALL|EIX': positionsAllEIX,
  'ALL|HAM': positionsAllHAM,
  'BER|EIX': positionsBerEIX,
  'BER|HAM': positionsBerHAM,
  'MUN|EIX': positionsMunEIX,
  'MUN|HAM': positionsMunHAM,
}

// Fallback für Legacy-Importe
export const mockPositions = positionsAllEIX
