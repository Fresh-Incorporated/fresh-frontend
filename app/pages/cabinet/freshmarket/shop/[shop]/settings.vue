<script setup lang="ts">
import CabinetShopSettings from "~/components/cabinet/freshmarket/CabinetShopSettings.vue";
import {http} from "~/composables/useHttp";
import CabinetShopCoop from "~/components/cabinet/freshmarket/CabinetShopCoop.vue";

definePageMeta({
  layout: 'cabinet'
})

const route = useRoute()

const shopId = route.params.shop
const shop = ref({ co_owners: []})

onMounted(async () => {
  await updateShop()
})

const updateShop = async () => {
  const response = await http.get(`/freshmarket/shop/${shopId}`)
  shop.value = response.data.shop
}
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 w-full gap-4 px-2 lg:px-4">
    <CabinetShopSettings
        @update-shop="updateShop"
        :shop-id="shopId"
        :name="shop?.name"
        :description="shop?.description"
        :icon="shop?.icon"
        :tag="shop?.tag"
    />
    <CabinetShopCoop
        @update-shop="updateShop"
        v-model:co-owners="shop.co_owners"
        :shop-id="shopId"
    />
  </div>
</template>

<style scoped>

</style>