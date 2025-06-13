<script setup lang="ts">
import {http} from "~/composables/useHttp"

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
    <ShCard v-for="order in orders.filter((_order) => _order?.currentWorkerId == user?.id)" class="flex flex-col w-full border rounded-lg !p-2">
      <div class="p-2">
        <p class="font-semibold">ID: #{{ order.id }} [ПРИНЯТО ВАМИ]</p>
        <p class="font-medium text-neutral-600 dark:text-neutral-300">Ячейка курьера: <span class="text-primary-dark">{{ order?.deliverCell?.letter }}-{{ order?.deliverCell?.number }}</span></p>
        <el-table :data="order?.products" style="width: 100%; height: 200px">
          <el-table-column prop="icon" label="#">
            <template #default="{ row }">
              <img :src="products.find(product => product.id === row.id)?.icon" alt="" class="w-12 h-12">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Название">
            <template #default="{ row }">
              {{products.find(product => product.id === row.id)?.name}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Описание">
            <template #default="{ row }">
              {{products.find(product => product.id === row.id)?.description}}
            </template>
          </el-table-column>
          <el-table-column prop="stack" label="Кол-во в каждом слоте">
            <template #default="{ row }">
              {{products.find(product => product.id === row.id)?.stack_count}}
            </template>
          </el-table-column>
          <el-table-column prop="stack" label="Кол-во слотов">
            <template #default="{ row }">
              {{products.find(product => product.id === row.id)?.slots_count}}
            </template>
          </el-table-column>
          <el-table-column prop="count" label="Кол-во ед." />
          <el-table-column prop="cell" label="Ячейка">
            <template #default="{ row }">
              <p class="text-blue-500 font-bold">{{products.find(product => product.id === row.id)?.cell?.letter}}-{{products.find(product => product.id === row.id)?.cell?.number}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ShButton variant="secondary" @click="finish(order?.id)">Завершить сбор заказа</ShButton>
    </ShCard>
    <div class="grid grid-cols-5 gap-4">
      <ShCard v-for="order in orders.filter((_order) => _order?.currentWorkerId != user?.id)" class="flex flex-col !p-2 gap-1">
        <p class="font-semibold">ID: #{{ order.id }}</p>
        <p class="text-sm">Товаров: {{order?.products?.reduce((sum, product) => sum + product?.count, 0)}} шт.</p>
        <ShButton :disabled="order.status != 0 || order?.currentWorkerId != null" size="sm" variant="success" class="w-full" @click="accept(order?.id)">Принять</ShButton>
      </ShCard>
    </div>
  </div>
</template>

<style scoped>

</style>