<script setup lang="ts">
const props = defineProps({

})
</script>

<template>
  <div class="w-full h-96 border border-neutral-800 bg-neutral-900 shadow-lg flex flex-col items-center rounded-lg">
    <div class="w-48 h-48 flex justify-center p-2">
      <img class="aspect-square" src="https://img.zaralx.ru/v1/minecraft/carrot" alt="">
    </div>
    <div class="flex-1 flex flex-col h-full w-full px-4 py-2">
      <div class="mb-1">
        <h3 class="text-lg font-medium">Супер дупер морковочка</h3>
        <p class="opacity-75 text-sm line-clamp-2">Эта морковка была выбита из самых главных чебоксаров сервера, а после что-то с ней сделали я хз</p>
      </div>
      <div class="flex items-center gap-2">
        <img class="w-5 h-5" src="/shop-icon.png" alt="">
        <p class="font-medium">_zaralX_'s Shop</p>
        <div class="flex-1 flex justify-end">
          <p class="text-xs font-rubik opacity-75"><i class="pi pi-star-fill text-yellow-400"></i> <span>4.7</span> <span>999 Оценок</span></p>
        </div>
      </div>
      <div class="flex-1 flex items-end">
        <div class="w-full">
          <p class="text-xs text-amber-500 font-medium">Осталось: 342</p>
          <el-progress :percentage="50" :stroke-width="10" striped status="warning" />
        </div>
      </div>
    </div>
    <div class="w-full">
      <button class="py-2 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-dark duration-200 w-full rounded-lg font-semibold font-montserrat"><i class="pi pi-shopping-cart"></i>
         9999 АР</button>
    </div>
  </div>
</template>

<style scoped>

</style>