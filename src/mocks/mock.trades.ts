import type { Trade } from '@/types/dto'

function iso(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60 * 1000).toISOString()
}

export const mockTrades: Trade[] = [
  // Gold
  { id: 'g1', category: 'gold',   timestamp: iso(3),  symbol: 'GC=F',         side: 'long',  quantity: 10.5, positionLabel: '10.5 Lots', last: 2842.50, changePct:  0.61 },
  { id: 'g2', category: 'gold',   timestamp: iso(12), symbol: 'GC=F',         side: 'short', quantity:  3.0, positionLabel: '3.0 Lots',  last: 2839.10, changePct: -0.22 },
  { id: 'g3', category: 'gold',   timestamp: iso(28), symbol: 'GOLD_MINING',  side: 'long',  quantity: 100,  positionLabel: '100 Shares',last:  945.20, changePct:  2.15 },
  { id: 'g4', category: 'gold',   timestamp: iso(45), symbol: 'GC=F',         side: 'long',  quantity:  2.0, positionLabel: '2.0 Lots',  last: 2840.80, changePct:  0.18 },
  { id: 'g5', category: 'gold',   timestamp: iso(61), symbol: 'GC=F',         side: 'short', quantity:  1.0, positionLabel: '1.0 Lots',  last: 2841.10, changePct: -0.07 },

  // Silver
  { id: 's1', category: 'silver', timestamp: iso(5),  symbol: 'SI=F', side: 'short', quantity: 500, positionLabel: '500 Oz', last: 23.15, changePct: -0.22 },
  { id: 's2', category: 'silver', timestamp: iso(14), symbol: 'SI=F', side: 'long',  quantity: 250, positionLabel: '250 Oz', last: 23.20, changePct:  0.12 },
  { id: 's3', category: 'silver', timestamp: iso(32), symbol: 'SI=F', side: 'short', quantity: 120, positionLabel: '120 Oz', last: 23.08, changePct: -0.45 },
  { id: 's4', category: 'silver', timestamp: iso(49), symbol: 'SI=F', side: 'long',  quantity:  80, positionLabel: '80 Oz',  last: 23.11, changePct:  0.06 },
  { id: 's5', category: 'silver', timestamp: iso(67), symbol: 'SI=F', side: 'short', quantity:  60, positionLabel: '60 Oz',  last: 23.09, changePct: -0.18 },

  // Bitcoin (crypto card)
  { id: 'c1', category: 'crypto',   timestamp: iso(2),  symbol: 'BTC/USD', side: 'long',  quantity:   1.2, positionLabel: '1.2 BTC',  last: 64230.10, changePct:  1.96 },
  { id: 'c2', category: 'crypto',   timestamp: iso(9),  symbol: 'BTC/USD', side: 'short', quantity:   0.3, positionLabel: '0.3 BTC',  last: 64280.00, changePct: -0.12 },
  { id: 'c3', category: 'crypto',   timestamp: iso(22), symbol: 'BTC/USD', side: 'long',  quantity:   0.5, positionLabel: '0.5 BTC',  last: 64190.50, changePct:  1.35 },
  { id: 'c4', category: 'crypto',   timestamp: iso(38), symbol: 'BTC/USD', side: 'short', quantity:   0.4, positionLabel: '0.4 BTC',  last: 64110.70, changePct: -0.28 },
  { id: 'c5', category: 'crypto',   timestamp: iso(55), symbol: 'BTC/USD', side: 'long',  quantity:   0.8, positionLabel: '0.8 BTC',  last: 64250.20, changePct:  0.19 },

  // Platinum
  { id: 'p1', category: 'platinum', timestamp: iso(4),  symbol: 'PL=F',  side: 'long',  quantity: 25,   positionLabel: '25 Oz', last: 997.80,  changePct:  0.12 },
  { id: 'p2', category: 'platinum', timestamp: iso(18), symbol: 'PL=F',  side: 'short', quantity: 10,   positionLabel: '10 Oz', last: 998.20,  changePct: -0.08 },
  { id: 'p3', category: 'platinum', timestamp: iso(35), symbol: 'PL=F',  side: 'long',  quantity: 15,   positionLabel: '15 Oz', last: 999.10,  changePct:  0.05 },
  { id: 'p4', category: 'platinum', timestamp: iso(52), symbol: 'PPLT', side: 'long',  quantity: 100,  positionLabel: '100 Shares', last: 98.45, changePct:  0.22 },
  { id: 'p5', category: 'platinum', timestamp: iso(68), symbol: 'PL=F',  side: 'short', quantity:  8,   positionLabel: '8 Oz',  last: 997.50,  changePct: -0.15 },

  // ETH
  { id: 'e1', category: 'eth', timestamp: iso(1),  symbol: 'ETH/USD', side: 'long',  quantity:  12.0, positionLabel: '12.0 ETH', last: 3452.30, changePct:  1.52 },
  { id: 'e2', category: 'eth', timestamp: iso(11), symbol: 'ETH/USD', side: 'short', quantity:   5.0, positionLabel: '5.0 ETH',  last: 3448.10, changePct: -0.31 },
  { id: 'e3', category: 'eth', timestamp: iso(26), symbol: 'ETH/USD', side: 'long',  quantity:   8.0, positionLabel: '8.0 ETH',  last: 3450.80, changePct:  0.18 },
  { id: 'e4', category: 'eth', timestamp: iso(42), symbol: 'ETH/USD', side: 'short', quantity:   3.0, positionLabel: '3.0 ETH',  last: 3447.20, changePct: -0.22 },
  { id: 'e5', category: 'eth', timestamp: iso(58), symbol: 'ETH/USD', side: 'long',  quantity:  10.0, positionLabel: '10.0 ETH', last: 3451.00, changePct:  0.09 },

  // Oil
  { id: 'o1', category: 'oil', timestamp: iso(6),  symbol: 'CL=F', side: 'long',  quantity: 100, positionLabel: '100 BBL', last: 74.15, changePct: -0.41 },
  { id: 'o2', category: 'oil', timestamp: iso(19), symbol: 'CL=F', side: 'short', quantity:  50, positionLabel: '50 BBL',  last: 74.08, changePct: -0.52 },
  { id: 'o3', category: 'oil', timestamp: iso(36), symbol: 'BZ=F', side: 'long',  quantity:  80, positionLabel: '80 BBL',  last: 77.20, changePct: -0.28 },
  { id: 'o4', category: 'oil', timestamp: iso(51), symbol: 'CL=F', side: 'long',  quantity:  40, positionLabel: '40 BBL',  last: 74.22, changePct:  0.05 },
  { id: 'o5', category: 'oil', timestamp: iso(64), symbol: 'CL=F', side: 'short', quantity:  30, positionLabel: '30 BBL',  last: 74.18, changePct: -0.12 },
]
