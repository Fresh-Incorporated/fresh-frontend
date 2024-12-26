<script setup lang="ts">

import IndexHead from "~/components/index/IndexHead.vue";
</script>

<template>
<div>
  <IndexHead />
  <div class="mt-16 flex justify-center items-center">
    <NuxtLink to="/freshmarket">
      <el-button type="primary" plain size="large" class="!py-6 !px-8"><p class="text-2xl font-montserrat"><i class="pi pi-bolt"></i> Начать покупки!</p></el-button>
    </NuxtLink>
  </div>
</div>
</template>

<style scoped>

</style>