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

onMounted(async () => {
  const response = await http.get(`/freshmarket/shop/${shopId}`)
  shop.value = response.data.shop
})
</script>

<template>
<div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 w-full gap-4 px-2 lg:px-4">
  <CabinetFreshmarketBalance :value="shop?.balance" :change="321" />
  <CabinetFreshmarketTotalRevenue :value="322" :change="322" />
  <CabinetDummy />
  <CabinetDummy />
  <CabinetFreshmarketChart :shop="shop" v-if="shop" />
  <CabinetDummy />
  <CabinetDummy class="col-span-4 h-80" />
</div>
</template>

<style scoped>

</style>