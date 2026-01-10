<script setup lang="ts">
const active = defineModel({default: true})
</script>

<template>
  <transition>
    <div v-if="active" class="transform">
      <div class="h-full bg-gray-100 rounded-xl dark:bg-neutral-950 w-full">
        <div class="w-full h-full bg-gray-200 rounded-xl dark:bg-neutral-900 animate-pulse">

        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>