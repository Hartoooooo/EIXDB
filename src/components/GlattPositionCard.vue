<template>
  <div class="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden">

    <!-- Card Header: Kategorie-Name + Aggregierte Summen -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold tracking-[0.18em] uppercase text-text-primary">
          {{ group.category }}
        </span>
        <span
          class="text-[10px] font-mono px-2 py-0.5 rounded bg-surface2 border border-border text-text-secondary tracking-wider"
        >
          {{ group.positions.length }}
        </span>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <div class="text-[9px] font-mono text-text-secondary tracking-[0.15em] uppercase mb-0.5">
            Wert
          </div>
          <div class="text-xs font-mono font-bold text-text-primary tabular-nums">
            {{ group.totalValue > 0 ? formatCurrencyEUR(group.totalValue) : '—' }}
          </div>
        </div>
        <div class="text-right">
          <div class="text-[9px] font-mono text-text-secondary tracking-[0.15em] uppercase mb-0.5">
            G/V
          </div>
          <div
            class="text-xs font-mono font-bold tabular-nums"
            :class="profitClass(group.totalProfit)"
          >
            {{ group.totalProfit !== 0
              ? (group.totalProfit > 0 ? '+' : '') + formatCurrencyEUR(group.totalProfit)
              : '—'
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- Positions Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="px-5 py-2 text-left text-[10px] font-mono font-normal text-text-secondary tracking-[0.15em] uppercase">
              ISIN
            </th>
            <th class="px-3 py-2 text-right text-[10px] font-mono font-normal text-text-secondary tracking-[0.15em] uppercase">
              Stück
            </th>
            <th class="px-3 py-2 text-right text-[10px] font-mono font-normal text-text-secondary tracking-[0.15em] uppercase">
              Wert
            </th>
            <th class="px-3 py-2 text-right text-[10px] font-mono font-normal text-text-secondary tracking-[0.15em] uppercase">
              G/V €
            </th>
            <th class="px-5 py-2 text-right text-[10px] font-mono font-normal text-text-secondary tracking-[0.15em] uppercase">
              G/V %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pos in group.positions"
            :key="pos.isin"
            class="border-b border-border/40 hover:bg-surface2/50 transition-colors duration-100"
          >
            <td class="px-5 py-2 text-[11px] font-mono text-text-primary tracking-wider">
              {{ pos.isin }}
            </td>
            <td
              class="px-3 py-2 text-[11px] font-mono text-right tabular-nums"
              :class="pos.size < 0 ? 'text-negative' : 'text-text-primary'"
            >
              {{ pos.size.toLocaleString('de-DE') }}
            </td>
            <td class="px-3 py-2 text-[11px] font-mono text-right tabular-nums text-text-primary">
              {{ pos.value !== null ? formatCurrencyEUR(pos.value) : '—' }}
            </td>
            <td
              class="px-3 py-2 text-[11px] font-mono text-right tabular-nums"
              :class="pos.profit === null ? 'text-text-secondary' : profitClass(pos.profit)"
            >
              {{ pos.profit !== null
                ? (pos.profit > 0 ? '+' : '') + formatCurrencyEUR(pos.profit)
                : '—'
              }}
            </td>
            <td
              class="px-5 py-2 text-[11px] font-mono text-right tabular-nums"
              :class="pos.profitPct === null ? 'text-text-secondary' : profitClass(pos.profitPct)"
            >
              {{ pos.profitPct !== null ? formatChangePct(pos.profitPct) : '—' }}
            </td>
          </tr>
          <tr v-if="group.positions.length === 0">
            <td colspan="5" class="px-5 py-4 text-center text-[11px] font-mono text-text-secondary">
              Keine Positionen
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { GlattCategoryGroup } from '@/types/glattlib'
import { formatCurrencyEUR, formatChangePct } from '@/utils/format'

defineProps<{
  group: GlattCategoryGroup
}>()

function profitClass(value: number): string {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-negative'
  return 'text-text-secondary'
}
</script>
