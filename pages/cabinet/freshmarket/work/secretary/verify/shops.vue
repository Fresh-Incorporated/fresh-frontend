<script setup lang="ts">
import {http} from "~/composables/useHttp"

definePageMeta({
  layout: 'cabinet'
})

const shops = ref([])

onMounted(async () => {
  await updateShopsList()
})

async function updateShopsList() {
  shops.value = (await http.get(`freshmarket/work/secretary/shops`))?.data;
}

const accept = async (id: number) => {
  await http.post(`freshmarket/work/secretary/shop/${id}/accept`).finally(async () => {
    await updateShopsList();
  })
}

const decline = async (id: number) => {
  await http.post(`freshmarket/work/secretary/shop/${id}/decline`).finally(async () => {
    await updateShopsList();
  })
}
</script>

<template>
  <div class="grid grid-cols-5 gap-4 p-4">
    <ShCard v-for="shop in shops" class="flex flex-col !p-2 gap-2">
      <img :src="shop.icon" class="w-full aspect-square" alt="">
      <div>
        <p>Название: <strong>{{shop.name}}</strong></p>
        <p>Описание: {{shop.description?.length > 0 ? shop.description : 'Отсутствует'}}</p>
      </div>
      <div class="w-full grid grid-cols-2 gap-2">
        <ShButton size="sm" variant="success" @click="accept(shop.id)">Подтвердить</ShButton>
        <ShButton size="sm" variant="destructive" @click="decline(shop.id)">Отклонить</ShButton>
      </div>
    </ShCard>
  </div>
</template>

<style scoped>

</style>