<script setup lang="ts">
const props = defineProps({
  title: String,
  value: Number,
})
</script>

<template>
  <div class="w-full h-48 bg-neutral-900 rounded-lg shadow-lg border border-neutral-800 flex flex-col justify-center items-center">
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      <div class="text-center px-4">
        <p class="text-2xl">{{ title }}</p>
        <p class="text-blue-500 text-lg">{{ value }}</p>
      </div>
    </template>
  </div>
</template>
