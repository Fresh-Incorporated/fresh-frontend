<script setup lang="ts">
import ProjectHead from "~/components/project/ProjectHead.vue";
import FMProductsList from "~/components/freshmarket/FMProductsList.vue";
import {http} from "~/composables/useHttp"
import FMCartButton from "~/components/freshmarket/FMCart.vue";

const productsModel = ref({
  products: [],
  loading: false
});

const load = async () => {
  if (productsModel.value.loading) return;

  productsModel.value = { ...productsModel.value, loading: true };

  try {
    const offset = productsModel.value.products.length;
    const newProducts = await http.get(`freshmarket/products?offset=${offset}`);

    productsModel.value = {
      ...productsModel.value,
      products: [...productsModel.value.products, ...newProducts.data],
    };
  } catch (error) {
    console.error('Ошибка загрузки продуктов:', error);
  } finally {
    productsModel.value = { ...productsModel.value, loading: false };
  }
};
</script>

<template>
<div v-infinite-scroll="load">
  <ProjectHead></ProjectHead>
  <FMCartButton />
  <FMProductsList v-model="productsModel" />
</div>
</template>

<style scoped>

</style>