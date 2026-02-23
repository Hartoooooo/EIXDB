import type { PositionAggregate } from '@/types/dto'

export const mockPositions: PositionAggregate[] = [
  { category: 'gold',     longPct: 68, shortPct: 32, longEur: 125000, shortEur:  59000 },
  { category: 'silver',   longPct: 42, shortPct: 58, longEur:  38000, shortEur:  52000 },
  { category: 'crypto',   longPct: 55, shortPct: 45, longEur:  91000, shortEur:  74000 },
  { category: 'platinum', longPct: 60, shortPct: 40, longEur:  42000, shortEur:  28000 },
  { category: 'eth',     longPct: 48, shortPct: 52, longEur:  66000, shortEur:  71000 },
  { category: 'oil',     longPct: 72, shortPct: 28, longEur:  88000, shortEur:  34000 },
]
