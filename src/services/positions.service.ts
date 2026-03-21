/**
 * PositionsService – Interface + Stub.
 *
 * Hinweis: Live-Bestandsdaten kommen über GlattLib (SignalR) via glattlib.store.ts.
 * Dieser Service ist für REST-basierte Positions-Aggregate vorgesehen, sofern
 * das Backend diese separat bereitstellt.
 *
 * TODO: HTTP-Anbindung implementieren.
 *   Beispiel:
 *     getPositionAggregates: () => http.get('/api/positions/aggregates', { params: filter })
 */

import type { PositionAggregate, FilterParams } from '@/types/dto'
import { mockPositionsByFilter } from '@/mocks/mock.positions'

export interface IPositionsService {
  getPositionAggregates(filter: FilterParams): Promise<PositionAggregate[]>
}

class MockPositionsService implements IPositionsService {
  async getPositionAggregates(filter: FilterParams): Promise<PositionAggregate[]> {
    const key = `${filter.location}|${filter.subBasket}`
    return mockPositionsByFilter[key] ?? []
  }
}

export const positionsService: IPositionsService = new MockPositionsService()
