<script setup lang="ts">
import ProjectHead from "~/components/project/ProjectHead.vue";
import FMProductsList from "~/components/freshmarket/FMProductsList.vue";

const productsModel = ref({products: []})

const load = () => {
  productsModel.value.products.push(1)
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