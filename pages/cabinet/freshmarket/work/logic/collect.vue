<script setup lang="ts">
import {http} from "~/composables/useHttp"
import {formatDateRelative} from "../../../../../utils/convertDate";

definePageMeta({
  layout: 'cabinet'
})

const {user} = useUser()

const orders = ref([])
const products = ref([])


const updateData = async () => {
  const responseData = (await http.get(`freshmarket/work/logic/list/orders`))?.data;
  orders.value = responseData?.orders;
  products.value = responseData?.products;
}

onMounted(async () => {
  await updateData();
})

const accept = async (id: number) => {
  await http.post(`freshmarket/work/logic/order/${id}/collect`).finally(async () => {
    await updateData();
  })
}

const finish = async (id: number) => {
  await http.post(`freshmarket/work/logic/order/${id}/collect/end`).finally(async () => {
    await updateData();
  })
}
</script>

<template>
  <div class="w-full p-4 space-y-2">
    <ShCard :key="order.id" v-for="order in orders.filter((_order) => _order?.currentWorkerId == user?.id)" class="flex flex-col w-full border rounded-lg !p-2 gap-2">
      <div>
        <p class="font-semibold">ID: #{{ order.id }} [ПРИНЯТО ВАМИ]</p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Ячейка курьера: <span class="text-primary-dark">{{ order?.deliverCell?.letter }}-{{ order?.deliverCell?.number }}</span></p>
      </div>
      <CabinetFreshmarketCollectOrderTable :data="order?.products" :products="products" />
      <ShButton variant="secondary" @click="finish(order?.id)" confirmation>Завершить сбор заказа</ShButton>
    </ShCard>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      <ShCard v-for="order in orders.filter((_order) => _order?.currentWorkerId != user?.id)" class="flex flex-col !p-2 gap-1">
        <p class="absolute right-2 top-2 text-xs">{{ formatDateRelative(order.createdAt) }}</p>
        <p class="font-semibold">ID: #{{ order.id }}</p>
        <p class="text-sm">Товаров: {{order?.products?.reduce((sum, product) => sum + product?.count, 0)}} шт.</p>
        <ShButton :disabled="order.status != 0 || order?.currentWorkerId != null" size="sm" variant="success" class="w-full" @click="accept(order?.id)">Принять</ShButton>
      </ShCard>
    </div>
  </div>
</template>

<style scoped>

</style>