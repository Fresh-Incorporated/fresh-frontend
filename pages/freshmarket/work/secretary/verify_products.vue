<script setup lang="ts">
import {http} from "~/composables/useHttp"

definePageMeta({
  layout: 'freshmarketwork'
})

const products = ref([])

onMounted(async () => {
  products.value = (await http.get(`freshmarket/work/secretary/products`))?.data;
})

const accept = async (id: number) => {
  await http.post(`freshmarket/work/secretary/product/${id}/accept`)
}

const decline = async (id: number) => {
  await http.post(`freshmarket/work/secretary/product/${id}/decline`)
}
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <div v-for="product in products" class="flex flex-col">
      <img :src="product.icon" class="w-full aspect-square" alt="">
      <p class="font-semibold">{{product.name}}</p>
      <p>{{product.description}}</p>
      <p>Кол-во в стаке: {{product.stack_count}}</p>
      <p>Кол-во слотов: {{product.slots_count}}</p>
      <p>Ячейка: {{product.cell?.letter}}-{{product.cell?.number}}</p>
      <p>Склад: {{product.cell?.location?.name}}</p>
      <el-button @click="accept(product.id)">Подтвердить</el-button>
      <el-button @click="decline(product.id)">Отклонить</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>