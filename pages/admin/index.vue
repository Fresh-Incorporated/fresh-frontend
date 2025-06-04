<script setup lang="ts">
import AdminCard from "~/components/admin/AdminCard.vue";
import {http} from "~/composables/useHttp"

const {user} = useUser()

const userBalances = ref(0)
const shopBalances = ref(0)
const totalSpentOnShops = ref(0)
const totalUsers = ref(0)

onMounted(async () => {
  const response = await http.get("/admin/stats")
  totalSpentOnShops.value = response.data.totalSpentOnShops
  userBalances.value = response.data.totalBalanceUsers
  shopBalances.value = response.data.totalBalanceShops
  totalUsers.value = response.data.totalUsers
})
</script>

<template>
<div>
  <div v-if="user?.admin" class="grid grid-cols-4 px-16 my-2 gap-4">
    <AdminCard title="Балансы игроков" :value="userBalances" />
    <AdminCard title="Балансы магазинов" :value="shopBalances" />
    <AdminCard title="Минимальный баланс карты" :value="userBalances + shopBalances" />
    <AdminCard title="Затрачено на создание магазинов" :value="totalSpentOnShops" />
    <AdminCard title="Регистраций" :value="totalUsers" />
  </div>
  <div v-else>
    Съебал отсюда
  </div>
</div>
</template>

<style scoped>

</style>