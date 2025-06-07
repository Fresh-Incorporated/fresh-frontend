<script setup lang="ts">
const showBetaCookie = useCookie<boolean>('showBeta', { default: () => true })
</script>

<template>
<div v-if="showBetaCookie">
  <div class="fixed bottom-4 left-4 bg-sky-500 border border-sky-500 rounded-lg p-2 shadow-lg z-40 blur-xl opacity-25">
    <p class="font-semibold text-sky-500">Проект находится в Бета Версии!</p>
    <p class="text-sm text-neutral-800 dark:text-neutral-300">Отправляйте свои идеи и баги <br> на нашем <a class="text-blue-400" target="_blank" href="https://discord.com/invite/eGUxF7uwyV">дискорд сервере</a></p>
  </div>
  <div class="fixed bottom-4 left-4 bg-neutral-300 dark:bg-neutral-900 border border-sky-500 rounded-lg p-2 shadow-lg z-50">
    <p class="font-semibold text-blue-500 dark:text-sky-500">Проект находится в Бета Версии!</p>
    <p class="text-sm text-neutral-800 dark:text-neutral-300">Отправляйте свои идеи и баги <br> на нашем <a class="text-blue-600 dark:text-blue-400" target="_blank" href="https://discord.com/invite/eGUxF7uwyV">дискорд сервере</a></p>
    <button @click="showBetaCookie = false" class="absolute bottom-0 right-2 text-blue-500 hover:text-sky-500"><i class="pi pi-times"></i></button>
  </div>
</div>
</template>