<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMProductHistory from "~/components/freshmarket/work/FMProductHistory.vue";

definePageMeta({
  layout: 'freshmarketwork'
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
  <div class="w-full p-4">
    <div v-for="order in orders.filter((_order) => _order?.currentWorkerId == user?.id)" class="flex flex-col w-full border rounded-lg border-neutral-700 mb-4">
      <div class="p-2">
        <p class="font-semibold">ID: #{{ order.id }} [ПРИНЯТО ВАМИ]</p>
        <p class="font-medium text-neutral-300">Ячейка курьера: <span class="text-primary-dark">{{ order?.deliverCell?.letter }}-{{ order?.deliverCell?.number }}</span></p>
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
          <el-table-column prop="stack" label="Кол-во в слоте">
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
      <el-popconfirm
          confirm-button-text="Подтвердить"
          cancel-button-text="Отмена"
          hide-icon
          title="Вы уверены что хотите завершить сбор заказа? Это действие нельзя будет отменить!"
          @confirm="finish(order?.id)"
          :width="300"
      >
        <template #reference>
          <el-button class="m-2 mt-0">Завершить сбор</el-button>
        </template>
        <template #actions="{ confirm, cancel }">
          <el-button size="small" @click="cancel">Отмена</el-button>
          <el-button
              type="danger"
              size="small"
              @click="confirm"
          >
            Подтвердить
          </el-button>
        </template>
      </el-popconfirm>

    </div>
    <div class="grid grid-cols-5 gap-4">
      <div v-for="order in orders.filter((_order) => _order?.currentWorkerId != user?.id)" class="flex flex-col">
        <p class="font-semibold">ID: #{{ order.id }}</p>
        <p>Товаров: {{order?.products?.reduce((sum, product) => sum + product?.count, 0)}} шт.</p>
        <el-button v-if="order?.status == 0" @click="accept(order.id)"
                   :disabled="order.status != 0 || order?.currentWorkerId != null" type="success" plain>Принять
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>