<script setup lang="ts">
import CabinetBalance from "~/components/cabinet/CabinetBalance.vue";

const {user, userLoading} = useUser()

definePageMeta({
  layout: 'cabinet'
})
</script>

<template>
<div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 w-full gap-4 px-2 lg:px-4">
  <CabinetBalance />
  <CabinetBalanceChart />
  <CabinetBalanceHistory />
</div>
</template>

<style scoped>

</style>