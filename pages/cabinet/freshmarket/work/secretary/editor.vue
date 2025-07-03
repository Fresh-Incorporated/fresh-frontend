<script setup lang="ts">
import {http} from "~/composables/useHttp"
import CabinetFreshmarketShopEditorTable
  from "~/components/cabinet/freshmarket/shops_editor_table/CabinetFreshmarketShopEditorTable.vue";
import CabinetFreshmarketProductEditorTable
  from "~/components/cabinet/freshmarket/products_editor_table/CabinetFreshmarketProductEditorTable.vue";

definePageMeta({
  layout: 'cabinet'
})

const shops = ref([])
const products = ref([])

const searchShop = ref({
  id: null,
  name: null,
  tag: null,
  limit: 5
})

const searchProduct = ref({
  id: null,
  name: null,
  cell: null,
  limit: 5
})

onMounted(async () => {
  await updateShops()
  await updateProducts()
})

const updateShops = async () => {
  shops.value = []
  shops.value = (await http.get("/freshmarket/work/secretary/shops/search", {
    params: searchShop.value
  })).data.shops
}

const updateProducts = async () => {
  products.value = []
  products.value = (await http.get("/freshmarket/work/secretary/products/search", {
    params: searchProduct.value
  })).data.products
}
</script>

<template>
  <div class="grid grid-cols-5 gap-4 p-4">
    <ShCard class="col-span-5 !py-0 gap-0">
      <h2 class="p-2 font-semibold">Магазины</h2>
      <div class="grid grid-cols-5 p-2 gap-2">
        <div class="grid w-full items-center gap-1.5 relative">
          <ShButton size="xs" variant="outline" class="absolute right-0 -top-2" @click="searchShop.id = null" v-if="searchShop.id != null">Очистить</ShButton>
          <ShLabel>ID</ShLabel>
          <ShInput v-model="searchShop.id" type="number" min="0" />
        </div>
        <div class="grid w-full items-center gap-1.5 relative">
          <ShButton size="xs" variant="outline" class="absolute right-0 -top-2" @click="searchShop.name = null" v-if="searchShop.name != null">Очистить</ShButton>
          <ShLabel>Название</ShLabel>
          <ShInput v-model="searchShop.name" />
        </div>
        <div class="grid w-full items-center gap-1.5 relative">
          <ShButton size="xs" variant="outline" class="absolute right-0 -top-2" @click="searchShop.tag = null" v-if="searchShop.tag != null">Очистить</ShButton>
          <ShLabel>Тег</ShLabel>
          <ShInput v-model="searchShop.tag" />
        </div>
        <div class="grid w-full items-center gap-1.5 relative">
          <ShLabel>Лимит</ShLabel>
          <ShInput v-model="searchShop.limit" type="number" min="0" max="50" />
        </div>
        <div class="grid w-full items-center gap-1.5">
          <ShLabel> </ShLabel>
          <ShButton @click="updateShops">Поиск</ShButton>
        </div>
      </div>
      <CabinetFreshmarketShopEditorTable v-model:shops="shops" />
    </ShCard>
    <ShCard class="col-span-5 !py-0 gap-0">
      <h2 class="p-2 font-semibold">Товары</h2>
      <div class="grid grid-cols-5 p-2 gap-2">
        <div class="grid w-full items-center gap-1.5 relative">
          <ShButton size="xs" variant="outline" class="absolute right-0 -top-2" @click="searchProduct.id = null" v-if="searchProduct.id != null">Очистить</ShButton>
          <ShLabel>ID</ShLabel>
          <ShInput v-model="searchProduct.id" type="number" min="0" />
        </div>
        <div class="grid w-full items-center gap-1.5 relative">
          <ShButton size="xs" variant="outline" class="absolute right-0 -top-2" @click="searchProduct.name = null" v-if="searchProduct.name != null">Очистить</ShButton>
          <ShLabel>Название</ShLabel>
          <ShInput v-model="searchProduct.name" />
        </div>
        <div class="grid w-full items-center gap-1.5 relative">
          <ShButton size="xs" variant="outline" class="absolute right-0 -top-2" @click="searchProduct.cell = null" v-if="searchProduct.cell != null">Очистить</ShButton>
          <ShLabel>Ячейка</ShLabel>
          <ShInput placeholder="Пример: C-23" v-model="searchProduct.cell" />
        </div>
        <div class="grid w-full items-center gap-1.5 relative">
          <ShLabel>Лимит</ShLabel>
          <ShInput v-model="searchProduct.limit" type="number" min="1" max="50" />
        </div>
        <div class="grid w-full items-center gap-1.5">
          <ShLabel> </ShLabel>
          <ShButton @click="updateProducts">Поиск</ShButton>
        </div>
      </div>
      <CabinetFreshmarketProductEditorTable v-model:products="products" />
    </ShCard>
  </div>
</template>

<style scoped>

</style>