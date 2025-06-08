<script setup lang="ts">
import FMProduct from "~/components/freshmarket/FMProduct.vue";
import {http} from "~/composables/useHttp"
import FMCartButton from "~/components/freshmarket/FMCart.vue";

const route = useRoute()
const shopTag = route.params.shop

const shop = ref({products: []})

onMounted(async () => {
  const response = await http.get(`/freshmarket/shop/info`, {
    params: {
      tag: shopTag
    }
  })

  shop.value = response.data
})

</script>

<template>
<div>
  <FMCartButton/>
  <div class="w-full h-full overflow-auto my-4 md:w-11/12 mx-auto space-y-2">
    <div class="flex items-end">
      <div class="w-24 h-24 aspect-square bg-neutral-900 border border-neutral-800 rounded-tl-lg rounded-tr-lg rounded-bl-lg">
        <img class="w-full h-full" :src="shop?.icon" alt="">
      </div>
      <div class="w-full bg-neutral-900 border border-l-0 border-neutral-800 h-16 rounded-tr-lg rounded-br-lg transform -translate-x-px z-10 px-2 flex flex-col justify-center">
        <p class="text-xl font-bold flex-1">{{ shop?.name }}</p>
        <p class="text-neutral-500 text-xs">{{ shop?.description }}</p>
      </div>
    </div>
    <div class="md:flex gap-2">
      <div class="bg-neutral-900 border border-neutral-800 rounded-lg w-64 h-16 mb-2">
        <div class="p-2 flex gap-1">
          <div class="w-12 h-12">
            <img class="w-full h-full" src="https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/11fd94e9-706b-486e-8274-60c55a55c01b/full" alt="">
          </div>
          <div class="flex flex-col justify-end py-1">
            <p class="font-medium flex-0.5">_zaralX__zaralX_</p>
            <div class="text-xs flex font-semibold">
              <div class="text-red-500 rounded-md px-1 py-0.5">Владелец</div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid w-full gap-2 md:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 overflow-hidden">
        <FMProduct v-for="product in shop?.products"
                   :id="product.id"
                   :name="product.name"
                   :description="product.description"
                   :icon="product.icon"
                   :price="product.price"
                   :count="product.count"
                   :slots_count="product.slots_count"
                   :stack_count="product.stack_count"
                   :shop_icon="shop.icon"
                   :shop_name="shop.name"
        />
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>