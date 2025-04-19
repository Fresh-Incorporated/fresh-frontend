<script setup lang="ts">
const {user} = useUser()

function getFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  return `${day}.${month}.${year}`;
}

</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 h-64 lg:col-span-2 relative overflow-hidden">
    <div class="absolute w-4 h-4 bg-black dark:bg-white blur-2xl"></div>
    <div class="absolute w-4 h-4 bg-black dark:bg-white blur-2xl bottom-0 right-0"></div>
    <div class="flex flex-col justify-center w-full h-full px-16">
      <div>
        <p class="text-3xl font-medium text-neutral-700 dark:text-neutral-200">Добрый день, {{user?.nickname}}!</p>
        <p class="text-neutral-700 dark:text-neutral-300">Сегодня: {{ getFormattedDate() }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>