<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FreshmarketDeliveryProductsTable
  from "~/components/cabinet/freshmarket/delivery_products_table/FreshmarketDeliveryProductsTable.vue";

definePageMeta({
  layout: 'cabinet'
})

const {user} = useUser()

const orders = ref([])
const products = ref([])

const updateData = async () => {
  const responseData = (await http.get(`freshmarket/work/delivery/list/orders`))?.data;
  orders.value = responseData?.orders;
  products.value = responseData?.products
}

onMounted(async () => {
  await updateData();
})

const accept = async (id: number) => {
  await http.post(`freshmarket/work/delivery/order/${id}/deliver`).finally(async () => {
    await updateData();
  })

}

const finish = async (id: number) => {
  await http.post(`freshmarket/work/delivery/order/${id}/deliver/end`).finally(async () => {
    await updateData();
  })
}
</script>

<template>
  <div class="w-full p-4 space-y-2">
    <ShCard v-for="order in orders.filter((_order) => _order?.currentWorkerId == user?.id)" class="w-full border rounded-lg !p-2">
      <div class="p-1">
        <p class="font-semibold">ID: #{{ order.id }} [ПРИНЯТО ВАМИ]</p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Ячейка курьера: <span class="text-primary-dark">{{ order?.deliverCell?.letter }}-{{ order?.deliverCell?.number }}</span></p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Тип доставки: ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
        <p class="font-semibold text-neutral-600 dark:text-neutral-200 mt-2">Информация точки назначения</p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Город: {{ order?.branchCell?.location?.city }}</p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Координаты: <span v-for="coordinate in order?.branchCell?.location?.coordinates">{{coordinate?.world}} X: {{coordinate?.x}} Y: {{coordinate?.y}} Z: {{coordinate?.z}}<br></span></p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Ячейка: <span class="text-secondary-dark">{{ order?.branchCell?.letter }}-{{ order?.branchCell?.number }}</span></p>
      </div>
      <FreshmarketDeliveryProductsTable :data="order?.data?.products" :products="products" />
      <ShButton variant="secondary" @click="finish(order?.id)">Завершить доставку</ShButton>
    </ShCard>
    <div class="grid grid-cols-5 gap-4">
      <ShCard v-for="order in orders.filter((_order) => _order?.currentWorkerId != user?.id)" class="flex flex-col !p-2 gap-1">
        <p class="font-semibold">ID: #{{ order?.id }}</p>
        <p class="text-sm">Товаров: {{ order?.data?.products?.reduce((sum, product) => sum + product?.count, 0) }} шт.</p>
        <ShButton :disabled="order.status != 2 || order?.currentWorkerId != null" size="sm" variant="success" class="w-full" @click="accept(order?.id)">Принять</ShButton>
      </ShCard>
    </div>
  </div>
</template>

<style scoped>

</style>