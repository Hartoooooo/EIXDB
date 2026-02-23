<template>
  <div
    class="animate-pulse rounded-xl bg-surface2"
    :style="{ height: height, width: width }"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  height?: string
  width?: string
}>(), {
  height: '1rem',
  width: '100%',
})
</script>
