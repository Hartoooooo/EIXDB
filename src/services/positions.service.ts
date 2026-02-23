/**
 * PositionsService – Interface + Mock-Implementierung.
 *
 * Für die Backend-Integration: getPositionAggregates() durch
 * HTTP-Call gegen /api/positions/aggregates ersetzen.
 */

import type { PositionAggregate } from '@/types/dto'
import { mockPositions } from '@/mocks/mock.positions'

export interface IPositionsService {
  getPositionAggregates(): Promise<PositionAggregate[]>
}

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockPositionsService implements IPositionsService {
  async getPositionAggregates(): Promise<PositionAggregate[]> {
    await delay(350)
    return [...mockPositions]
  }
}

export const positionsService: IPositionsService = new MockPositionsService()
