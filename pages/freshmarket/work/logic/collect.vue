<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMProductHistory from "~/components/freshmarket/work/FMProductHistory.vue";

definePageMeta({
  layout: 'freshmarketwork'
})

const {user} = useUser()

const orders = ref([])
const products = ref([])

onMounted(async () => {
  const responseData = (await http.get(`freshmarket/work/logic/list/orders`))?.data;
  orders.value = responseData?.orders;
  products.value = responseData?.products;
})

const accept = async (id: number) => {
  await http.post(`freshmarket/work/logic/order/${id}/collect`)
}

const finish = async (id: number) => {
  await http.post(`freshmarket/work/logic/order/${id}/collect/end`)
}
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-5 gap-4">
      <div v-for="order in orders" class="flex flex-col">
        <p class="font-semibold">ID: #{{ order.id }}</p>
        <p>Добавить инфу потом сюда</p>
        <el-button v-if="order?.currentWorkerId == user?.id && order?.status == 1"
                   @click="finish(order.id)">Завершить сбор
        </el-button>
        <el-button v-else-if="order?.status == 0" @click="accept(order.id)"
                   :disabled="order.status != 0 || order?.currentWorkerId != null">Принять
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>