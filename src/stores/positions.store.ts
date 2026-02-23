import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PositionAggregate } from '@/types/dto'
import { positionsService } from '@/services/positions.service'

export const usePositionsStore = defineStore('positions', () => {
  const aggregates = ref<PositionAggregate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAggregates() {
    loading.value = true
    error.value = null
    try {
      aggregates.value = await positionsService.getPositionAggregates()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Laden der Positionen'
    } finally {
      loading.value = false
    }
  }

  return { aggregates, loading, error, fetchAggregates }
})
