<script setup lang="ts">
import FMSellsChart from "~/components/cabinet/freshmarket/FMSellsChart.vue";
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 lg:col-span-2 relative overflow-hidden">
    <div class="absolute w-4 h-4 bg-white blur-2xl"></div>
    <div class="absolute w-4 h-4 bg-white blur-2xl bottom-0 right-0"></div>
    <div class="flex flex-col justify-center w-full h-full">
      <div class="h-8">
        <div class="p-4">
          <p class="text-2xl font-medium">Статистика продаж</p>
        </div>
      </div>
      <div class="flex-1 translate-y-5">
        <ClientOnly>
          <FMSellsChart />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>