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
  <div>
    <div v-for="product in products" class="flex flex-col">
      <p>{{product.name}}</p>
      <p>{{product.description}}</p>
      <p>{{product}}</p>
      <el-button @click="accept(product.id)">Подтвердить</el-button>
      <el-button @click="decline(product.id)">Отклонить</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>