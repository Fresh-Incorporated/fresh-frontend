<script setup lang="ts">
import CabinetFragmentWelcome from "~/components/cabinet/CabinetFragmentWelcome.vue";
import CabinetFragmentBalance from "~/components/cabinet/CabinetFragmentBalance.vue";
import CabinetFragmentBalanceHistory from "~/components/cabinet/CabinetFragmentBalanceHistory.vue";
import CabinetFragmentSettings from "~/components/cabinet/CabinetFragmentSettings.vue";

definePageMeta({
  layout: 'cabinet'
})
</script>

<template>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8">
  <CabinetFragmentWelcome />
  <CabinetFragmentBalance />
  <CabinetFragmentBalanceHistory />
  <CabinetFragmentSettings />
</div>
</template>

<style scoped>

</style>