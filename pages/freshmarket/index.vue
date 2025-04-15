<script setup lang="ts">
import ProjectHead from "~/components/project/ProjectHead.vue";
import FMProductsList from "~/components/freshmarket/FMProductsList.vue";
import {http} from "~/composables/useHttp"
import FMCartButton from "~/components/freshmarket/FMCart.vue";

const productsModel = ref({
  products: [],
  loading: false
});

const isAllLoaded = ref(false)

onMounted(async () => await load())

const load = async () => {
  if (productsModel.value.loading) return;
  if (isAllLoaded.value) return;

  productsModel.value = {...productsModel.value, loading: true};

  try {
    const offset = productsModel.value.products.length;
    const newProducts = await http.get(`freshmarket/products?offset=${offset}`);

    if (newProducts.data.length == 0) {
      isAllLoaded.value = true;
      return;
    }

    productsModel.value = {
      ...productsModel.value,
      products: [...productsModel.value.products, ...newProducts.data],
    };
  } catch (error) {
    console.error('Ошибка загрузки продуктов:', error);
  } finally {
    productsModel.value = {...productsModel.value, loading: false};
  }
};
</script>

<template>
  <div v-infinite-scroll="load" infinite-scroll-immediate="false">
    <ProjectHead></ProjectHead>
    <FMCartButton/>
    <FMProductsList v-model="productsModel"/>
    <transition>
      <div v-if="isAllLoaded && productsModel.products.length > 0"
           class="transform duration-500 flex justify-center my-6 text-xl items-center gap-2">
        <i class="pi pi-times"></i>Похоже, больше нет товаров по вашему запросу!
      </div>
      <div v-else-if="isAllLoaded && productsModel.products.length == 0"
           class="transform duration-500 flex justify-center my-6 text-xl items-center gap-2">
        <i class="pi pi-times"></i>Похоже, нет товаров по вашему запросу, попробуйте изменить фильтры!
      </div>
    </transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  @apply scale-100;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  @apply scale-0;
}
</style>