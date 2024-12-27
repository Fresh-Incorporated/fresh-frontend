<script setup lang="ts">
import FMProduct from "~/components/freshmarket/FMProduct.vue";

const model = defineModel()
</script>

<template>
<div class="w-full h-full overflow-auto my-4">
  <div class="md:w-11/12 mx-auto grid gap-2 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <FMProduct v-for="product in model.products" />
  </div>
  <transition>
    <div v-if="model.loading" class="transform duration-500 flex justify-center my-4 text-xl items-center gap-2"><i class="pi pi-spinner animate-spin"></i>Загружаем больше товаров</div>
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