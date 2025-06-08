<script setup lang="ts">
import FMProduct from "~/components/freshmarket/FMProduct.vue";

const model = defineModel()
</script>

<template>
<div class="w-full h-full overflow-auto my-4">
  <div class="md:w-11/12 mx-auto grid gap-2 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 overflow-hidden">
<!--    <div class="h-96 col-span-2 border border-neutral-800 bg-neutral-900 flex flex-col justify-center items-center">-->
<!--      <p class="text-3xl">Здесь могла быть ваша реклама</p>-->
<!--      <p class="text-xl opacity-50">Тут одиноко..</p>-->
<!--    </div>-->
    <FMProduct v-for="product in model.products"
               :id="product.id"
               :name="product.name"
               :description="product.description"
               :icon="product.icon"
               :price="product.price"
               :count="product.count"
               :slots_count="product.slots_count"
               :stack_count="product.stack_count"
               :shop_icon="product.shop.icon"
               :shop_name="product.shop.name"
               :shop_tag="product.shop.tag"
    />
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