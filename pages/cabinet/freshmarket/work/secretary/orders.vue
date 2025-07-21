<script setup lang="ts">
import {http} from "~/composables/useHttp"
import CabinetFreshmarketOrdersTable
  from "~/components/cabinet/freshmarket/orders_table/CabinetFreshmarketOrdersTable.vue";

definePageMeta({
  layout: 'cabinet'
})

const orders = ref([])
const products = ref([])

onMounted(async () => {
  await refresh()
})

const refresh = async () => {
  const response = await http.get("/freshmarket/work/secretary/orders/deprecated")
  orders.value = response.data.orders
  products.value = response.data.products
}
</script>

<template>
  <div class="grid grid-cols-5 gap-4 p-4">
    <ShCard class="col-span-5 !py-0 gap-0">
      <h2 class="p-2 font-semibold">Заказы которые долго не забирают</h2>
      <CabinetFreshmarketOrdersTable v-model="orders" v-model:products="products" @update-orders="refresh" />
    </ShCard>
  </div>
</template>

<style scoped>

</style>