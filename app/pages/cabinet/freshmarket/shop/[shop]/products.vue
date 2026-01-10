<script setup lang="ts">
import CabinetDummy from "~/components/cabinet/CabinetDummy.vue";
import {http} from "~/composables/useHttp"
import CabinetFreshmarketChart from "~/components/cabinet/freshmarket/CabinetFreshmarketChart.vue";

definePageMeta({
  layout: 'cabinet'
})

const route = useRoute()

const shopId = route.params.shop
const shop = ref()
const products = ref()

onMounted(async () => {
  await updateShop()
})

const updateShop = async () => {
  const response = await http.get(`/freshmarket/shop/${shopId}`)
  shop.value = response.data.shop
  products.value = response.data.shop.products
}
</script>

<template>
<div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 w-full gap-4 px-2 lg:px-4">
  <CabinetFreshmarketProducts @update-products="updateShop" @update-shop="updateShop" v-model:products="products" :shop-id="shopId" :shop="shop" />
</div>
</template>

<style scoped>

</style>