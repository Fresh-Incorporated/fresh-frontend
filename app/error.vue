<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="text-center space-y-8">
      <p class="text-lg!">Внимание, ошибка!</p>
      <p class="text-3xl! font-bold">{{error?.statusCode}}</p>
      <NuxtLink to="/public"><ShButton>Вернуться на главную</ShButton></NuxtLink>
    </div>
  </div>
</template>