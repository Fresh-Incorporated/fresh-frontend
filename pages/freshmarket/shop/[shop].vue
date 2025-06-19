<script setup lang="ts">
import FMProduct from "~/components/freshmarket/FMProduct.vue";
import {http} from "~/composables/useHttp"
import FMCartButton from "~/components/freshmarket/FMCart.vue";

const route = useRoute()
const shopTag = route.params.shop

const shop = ref({products: []})

onMounted(async () => {
  try {
    const response = await http.get(`/freshmarket/shop/info`, {
      params: {
        tag: shopTag
      }
    })

    shop.value = response.data
  } catch (e) {
    showError({ statusCode: 404})
  }
})

</script>

<template>
<div>
  <FMCartButton/>
  <div class="w-full h-full overflow-auto my-4 md:w-11/12 mx-auto space-y-2">
    <div class="flex items-end">
      <div class="w-24 h-24 aspect-square bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-tl-lg rounded-tr-lg rounded-bl-lg">
        <img class="w-full h-full" :src="shop?.icon" alt="">
      </div>
      <div class="w-full bg-neutral-100 dark:bg-neutral-900 border border-l-0 border-neutral-200 dark:border-neutral-800 h-16 rounded-tr-lg rounded-br-lg transform -translate-x-px z-10 px-2 flex flex-col justify-center">
        <p class="text-xl font-bold">{{ shop?.name }}</p>
        <p class="text-neutral-500 text-xs break-all">{{ shop?.description?.length == 0 ? 'Описание отсутствует' : shop?.description }}</p>
      </div>
    </div>
    <div class="gap-2">
      <div class="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg w-full mb-2 flex flex-wrap gap-2 px-1">
        <div class="p-1 flex items-center gap-1">
          <div class="w-8 h-8">
            <img class="w-full h-full" :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${shop?.owner?.uuid}/full`" alt="">
          </div>
          <div class="flex flex-col justify-end px-1 py-1 text-xs">
            <p class="font-medium flex-0.5">{{shop?.owner?.nickname}}</p>
            <div class="text-xs flex font-semibold">
              <div class="text-red-500 rounded-md py-0.5">Владелец</div>
            </div>
          </div>
        </div>
        <div class="p-1 flex items-center gap-1" v-for="co_owner in shop?.co_owners">
          <div class="w-8 h-8">
            <img class="w-full h-full" :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${co_owner?.user?.uuid}/full`" alt="">
          </div>
          <div class="flex flex-col justify-end px-1 py-1 text-xs">
            <p class="font-medium flex-0.5">{{co_owner?.user?.nickname}}</p>
            <div class="flex font-semibold">
              <div class="text-orange-500 rounded-md py-0.5">Совладелец</div>
            </div>
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
                 :shop_tag="shop.tag"
      />
    </div>
  </div>
</div>
</template>

<style scoped>

</style>