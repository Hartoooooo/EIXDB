import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'risikodb-theme'

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (_) {}
}

export const useThemeStore = defineStore('theme', () => {
  const stored = (() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v === 'light' || v === 'dark' ? v : 'dark'
    } catch {
      return 'dark'
    }
  })()

  const isDark = ref(stored === 'dark')
  applyTheme(stored)

  watch(isDark, (dark) => {
    applyTheme(dark ? 'dark' : 'light')
  })

  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
})
