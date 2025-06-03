<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMStatsCard from "~/components/freshmarket/FMStatsCard.vue";

const {user} = useUser()

definePageMeta({
  layout: 'freshmarketwork'
})

const totalOrders = ref(0)
const totalCommissionBalance = ref(0)
const totalSpentOnShops = ref(0)

onMounted(async () => {
  let response = await http.get("/freshmarket/work/director/stats");
  totalOrders.value = response.data.totalOrders;
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
    </div>
  </div>
</template>

<style scoped>

</style>