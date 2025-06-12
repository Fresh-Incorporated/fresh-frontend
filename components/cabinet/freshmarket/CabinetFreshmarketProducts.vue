<script setup lang="ts">
import CabinetFreshmarketProduct from "~/components/cabinet/freshmarket/CabinetFreshmarketProduct.vue";
import CreateProductMenu from "~/components/cabinet/freshmarket/CreateProductMenu.vue";
import IncreaseShopLimitMenu from "~/components/cabinet/freshmarket/IncreaseShopLimitMenu.vue";

const emit = defineEmits(['updateProducts', 'updateShop'])

const props = defineProps({
  shopId: Number,
  shop: Object,
})

const products = defineModel('products')
</script>

<template>
  <ShCard class="col-span-1 xl:col-span-2 2xl:col-span-4">
    <ShCardHeader>
      <ShCardDescription class="flex flex-col md:flex-row gap-2 items-center">
        <p>Товары [{{ shop?.products?.length }}/{{ shop?.products_limit }}]</p>
        <div class="flex gap-2">
          <IncreaseShopLimitMenu @update-shop="emit('updateShop')" :products_limit="shop?.products_limit" :shop-id="shopId">
            <ShButton size="xs" variant="secondary">Увеличить лимит</ShButton>
          </IncreaseShopLimitMenu>
          <CreateProductMenu @update-products="emit('updateProducts')" :shop-id="shopId">
            <ShButton size="xs" variant="secondary">Создать товар</ShButton>
          </CreateProductMenu>
        </div>
      </ShCardDescription>
    </ShCardHeader>
    <ShCardContent class="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
          :refill_cell_letter="product.refillCell?.letter"
          :refill_cell_number="product.refillCell?.number"
          @updateProducts="emit('updateProducts')"
      />
    </ShCardContent>
  </ShCard>
</template>

<style scoped>

</style>