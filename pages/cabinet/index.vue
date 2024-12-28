<script setup lang="ts">
import CabinetFragmentWelcome from "~/components/cabinet/CabinetFragmentWelcome.vue";
import CabinetFragmentBalance from "~/components/cabinet/CabinetFragmentBalance.vue";

definePageMeta({
  layout: 'cabinet'
})
</script>

<template>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
  <CabinetFragmentWelcome />
  <CabinetFragmentBalance />
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

  </div>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

  </div>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

  </div>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-3">

  </div>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

  </div>
</div>
</template>

<style scoped>

</style>