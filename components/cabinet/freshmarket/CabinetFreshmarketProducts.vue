<script setup lang="ts">
import CabinetFreshmarketProduct from "~/components/cabinet/freshmarket/CabinetFreshmarketProduct.vue";
import CreateProductMenu from "~/components/cabinet/freshmarket/CreateProductMenu.vue";

const emit = defineEmits(['updateProducts'])

const props = defineProps({
  shopId: Number,
  shop: Object,
})

const products = defineModel('products')
</script>

<template>
  <ShCard class="col-span-4">
    <ShCardHeader>
      <ShCardDescription class="flex gap-2 items-center">
        <p>Товары [{{ shop?.products?.length }}/{{ shop?.products_limit }}]</p>
        <ShButton size="xs" variant="secondary">Увеличить лимит</ShButton>
        <CreateProductMenu @update-products="emit('updateProducts')" :shop-id="shopId">
          <ShButton size="xs" variant="secondary">Создать товар</ShButton>
        </CreateProductMenu>
      </ShCardDescription>
    </ShCardHeader>
    <ShCardContent class="grid grid-cols-4 gap-4">
      <CabinetFreshmarketProduct
          v-for="product in products"
          :shop-id="shopId"
          :id="product.id"
          :name="product.name"
          :description="product.description"
          :icon="product.icon"
          :price="product.price"
          :count="product.count"
          :refill_status="product.refill_status"
          :verify_status="product.verify_status"
          :stack_count="product.stack_count"
          :slots_count="product.slots_count"
          @updateProducts="emit('updateProducts')"
      />
    </ShCardContent>
  </ShCard>
</template>

<style scoped>

</style>