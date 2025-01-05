<script setup lang="ts">
import {http} from "~/composables/useHttp"

definePageMeta({
  layout: 'freshmarketwork'
})

const shops = ref([])

onMounted(async () => {
  shops.value = (await http.get(`freshmarket/work/secretary/shops`))?.data;
})

const accept = async (id: number) => {
  await http.post(`freshmarket/work/secretary/shop/${id}/accept`)
}

const decline = async (id: number) => {
  await http.post(`freshmarket/work/secretary/shop/${id}/decline`)
}
</script>

<template>
<div class="grid grid-cols-5 gap-4">
  <div v-for="shop in shops" class="flex flex-col">
    <img :src="shop.icon" class="w-full aspect-square" alt="">
    <p class="font-semibold">{{shop.name}}</p>
    <p>{{shop.description}}</p>
    <el-button @click="accept(shop.id)">Подтвердить</el-button>
    <el-button @click="decline(shop.id)">Отклонить</el-button>
  </div>
</div>
</template>

<style scoped>

</style>