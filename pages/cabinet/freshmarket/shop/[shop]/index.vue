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
  <ShCard v-if="shop?.verify_status == 0" class="col-span-4 py-2 px-4 text-yellow-500 border-yellow-400/[.5] !bg-yellow-500/[.1] flex-row items-center gap-2 font-medium">
    <Icon name="lucide:message-circle-warning" size="20" />
    <p class="transform translate-y-px">Магазин на проверке</p>
  </ShCard>
  <ShCard v-if="shop?.verify_status == -1" class="col-span-4 py-2 px-4 text-red-500 border-red-400/[.5] !bg-red-500/[.1] flex-row items-center gap-2 font-medium">
    <Icon name="lucide:message-circle-warning" size="20" />
    <p class="transform translate-y-px">Магазин не прошёл проверку</p>
  </ShCard>
  <CabinetFreshmarketBalance @update-shop="updateShop" :value="shop?.balance" :shop-id="shopId" />
  <CabinetDummy />
<!--  <CabinetFreshmarketTotalRevenue :value="322" :change="322" />-->
  <CabinetDummy />
  <CabinetDummy />
  <CabinetFreshmarketChart :shop="shop" v-if="shop" />
  <CabinetDummy />
  <CabinetFreshmarketProducts @update-products="updateShop" @update-shop="updateShop" v-model:products="products" :shop-id="shopId" :shop="shop" />
</div>
</template>

<style scoped>

</style>