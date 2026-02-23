export function changeColor(value: number): string {
  return value >= 0 ? '#22C55E' : '#EF4444'
}

export function changeTextClass(value: number): string {
  return value >= 0 ? 'text-positive' : 'text-negative'
}

export function changeBgClass(value: number): string {
  return value >= 0 ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
}

export function sideBgClass(side: 'long' | 'short'): string {
  return side === 'long'
    ? 'bg-positive/15 text-positive border border-positive/30'
    : 'bg-negative/15 text-negative border border-negative/30'
}

export const CATEGORY_ACCENT: Record<string, string> = {
  gold:     '#F5C542',
  silver:   '#C0C0C0',
  crypto:   '#FF8A3D',
  platinum: '#E5E4E2',
  eth:      '#627EEA',
  oil:      '#C0C0C0', /* Öl-Chartlinie in Silber */
}

export const CATEGORY_ACCENT_CLASS: Record<string, string> = {
  gold:     'text-gold',
  silver:   'text-silver',
  crypto:   'text-crypto',
  platinum: 'text-platinum',
  eth:      'text-eth',
  oil:      'text-oil',
}

export const CATEGORY_BORDER_CLASS: Record<string, string> = {
  gold:     'border-gold/40',
  silver:   'border-silver/40',
  crypto:   'border-crypto/40',
  platinum: 'border-platinum/40',
  eth:      'border-eth/40',
  oil:      'border-oil/40',
}

export const CATEGORY_GLOW_CLASS: Record<string, string> = {
  gold:     'shadow-[0_0_20px_rgba(245,197,66,0.08)]',
  silver:   'shadow-[0_0_20px_rgba(138,180,248,0.08)]',
  crypto:   'shadow-[0_0_20px_rgba(255,138,61,0.08)]',
  platinum: 'shadow-[0_0_20px_rgba(229,228,226,0.08)]',
  eth:      'shadow-[0_0_20px_rgba(98,126,234,0.08)]',
  oil:      'shadow-[0_0_20px_rgba(26,26,26,0.08)]',
}
