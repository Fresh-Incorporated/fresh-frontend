<script setup lang="ts">
import FMProduct from "~/components/freshmarket/FMProduct.vue";

const model = defineModel()
</script>

<template>
<div class="w-full h-full overflow-auto mt-4">
  <div class="md:w-11/12 mx-auto grid gap-2 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <FMProduct v-for="product in model.products" />
  </div>
</div>
</template>

<style scoped>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>