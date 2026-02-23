/**
 * PositionsService – Interface + Mock-Implementierung.
 *
 * Für die Backend-Integration: getPositionAggregates() durch
 * HTTP-Call gegen /api/positions/aggregates?location=...&exchange=... ersetzen.
 */

import type { PositionAggregate, FilterParams } from '@/types/dto'
import { mockPositionsByFilter } from '@/mocks/mock.positions'

export interface IPositionsService {
  getPositionAggregates(filter: FilterParams): Promise<PositionAggregate[]>
}

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockPositionsService implements IPositionsService {
  async getPositionAggregates(filter: FilterParams): Promise<PositionAggregate[]> {
    await delay(350)
    const key = `${filter.location}|${filter.exchange}`
    return [...(mockPositionsByFilter[key] ?? mockPositionsByFilter['ALL|EIX'])]
  }
}

export const positionsService: IPositionsService = new MockPositionsService()
