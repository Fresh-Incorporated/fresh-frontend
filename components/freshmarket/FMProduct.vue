<script setup lang="ts">
const props = defineProps({
  name: String,
  description: String,
  price: Number,
  icon: String,
  shop_name: String,
  shop_icon: String,
  count: Number,
})
</script>

<template>
  <div class="w-full h-96 border border-neutral-800 bg-neutral-900 shadow-lg flex flex-col items-center rounded-lg relative">
    <div v-if="count === 0" class="absolute w-full h-full bg-neutral-900/[0.75] z-10 rounded-lg flex justify-center items-center">
      <p class="absolute blur-md text-3xl text-center font-semibold text-red-600">Товар закончился</p>
      <p class="text-3xl text-center font-semibold text-red-600">Товар закончился</p>
    </div>
    <div class="w-48 h-48 flex justify-center p-2">
      <img class="aspect-square" :src="props.icon" alt="">
    </div>
    <div class="flex-1 flex flex-col h-full w-full px-4 py-2">
      <div class="mb-1">
        <h3 class="text-lg font-medium">{{props.name}}</h3>
        <p class="opacity-75 text-sm line-clamp-2">{{props.description}}</p>
      </div>
      <div class="flex items-center gap-2">
        <img class="w-5 h-5" :src="props.shop_icon" alt="">
        <p class="font-medium">{{props.shop_name}}</p>
        <div class="flex-1 flex justify-end">
          <p class="text-xs font-rubik opacity-75"><i class="pi pi-star-fill text-yellow-400"></i> <span>4.7</span> <span>999 Оценок</span></p>
        </div>
      </div>
      <div class="flex-1 flex items-end" v-if="props.count < 10">
        <div class="w-full">
          <p class="text-xs text-amber-500 font-medium">Осталось: {{ props.count }}</p>
          <el-progress :percentage="props.count * 5" :stroke-width="10" striped status="warning" />
        </div>
      </div>
    </div>
    <div class="w-full">
      <button class="py-2 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-dark duration-200 w-full rounded-lg font-semibold font-montserrat"><i class="pi pi-shopping-cart"></i>
         {{props.price}} АР</button>
    </div>
  </div>
</template>

<style scoped>

</style>