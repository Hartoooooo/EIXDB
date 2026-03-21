<template>
  <div ref="rootRef" class="relative inline-block min-w-0">
    <!-- Trigger -->
    <button
      type="button"
      class="flex items-center justify-between gap-2 w-full min-w-[4rem] text-[10px] font-mono font-bold tracking-wider bg-surface2 border border-border rounded-md px-2 py-1.5 text-text-primary hover:border-text-secondary/50 transition-colors duration-150 text-left"
      :class="{ 'ring-1 ring-border': isOpen }"
      @click="toggle"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <svg
        class="w-3 h-3 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Panel -->
    <Transition name="dropdown">
      <div
        v-show="isOpen"
        class="absolute top-full left-0 right-0 mt-1 z-50 py-1 rounded-md bg-surface2 border border-border shadow-lg max-h-48 overflow-y-auto"
      >
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="w-full px-3 py-1.5 text-left text-[10px] font-mono font-bold tracking-wider transition-colors duration-100"
          :class="modelValue === opt.value
            ? 'bg-border text-text-primary'
            : 'text-text-secondary hover:bg-surface hover:text-text-primary'"
          @click="select(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: { value: string; label: string }[]
    placeholder?: string
  }>(),
  { placeholder: '—' }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt?.label ?? props.placeholder
})

function toggle() {
  isOpen.value = !isOpen.value
}

function select(value: string) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
