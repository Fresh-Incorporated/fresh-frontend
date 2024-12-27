<script setup lang="ts">
import ProjectHead from "~/components/project/ProjectHead.vue";
import FMProductsList from "~/components/freshmarket/FMProductsList.vue";

const productsModel = ref({products: [], loading: false});

const load = () => {
  if (productsModel.value.loading) return;
  productsModel.value.loading = true;
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      productsModel.value.products.push(1)
    }
    productsModel.value.loading = false;
  }, 1000)
}
</script>

<template>
<div v-infinite-scroll="load">
  <ProjectHead></ProjectHead>
  <FMProductsList v-model="productsModel" />
</div>
</template>

<style scoped>

</style>