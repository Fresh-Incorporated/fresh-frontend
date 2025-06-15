<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMStatsCard from "~/components/freshmarket/FMStatsCard.vue";

const {user} = useUser()

definePageMeta({
  layout: 'cabinet'
})

const totalOrders = ref(0)
const totalCells = ref(0)
const usedCells = ref(0)
const shopCells = ref(0)
const totalCommissionBalance = ref(0)
const totalSpentOnShops = ref(0)

onMounted(async () => {
  let response = await http.get("/freshmarket/work/director/stats");
  totalOrders.value = response.data.totalOrders;
  totalCells.value = response.data.totalCells;
  usedCells.value = response.data.usedCells;
  shopCells.value = response.data.shopCells;
  response = await http.get("/freshmarket/work/director/balance");
  totalCommissionBalance.value = response.data.totalCommissionBalance;
  totalSpentOnShops.value = response.data.totalSpentOnShops;
})
</script>

<template>
  <div class="w-full">
    <div v-if="user?.fm_worker >= 4" class="grid grid-cols-4 px-4 my-4 gap-4">
      <FMStatsCard title="Всего заказов" :value="totalOrders" />
      <FMStatsCard title="Всего АР с комки" :value="totalCommissionBalance" />
      <FMStatsCard title="Затрачено на создание магазинов" :value="totalSpentOnShops" />
      <FMStatsCard />
      <FMStatsCard title="Всего ячеек склада" :value="totalCells" />
      <FMStatsCard title="Занято ячеек склада" :value="usedCells" />
      <FMStatsCard title="Может быть занято ячеек склада" :value="shopCells" />
      <FMStatsCard title="100% доступных ячеек" :value="totalCells - shopCells" />
    </div>
  </div>
</template>

<style scoped>

</style>