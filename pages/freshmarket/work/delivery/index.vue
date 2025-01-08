<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMProductHistory from "~/components/freshmarket/work/FMProductHistory.vue";

definePageMeta({
  layout: 'freshmarketwork'
})

const {user} = useUser()

const orders = ref([])

onMounted(async () => {
  const responseData = (await http.get(`freshmarket/work/delivery/list/orders`))?.data;
  orders.value = responseData?.orders;
})

const accept = async (id: number) => {
  await http.post(`freshmarket/work/delivery/order/${id}/deliver`)
}

const finish = async (id: number) => {
  await http.post(`freshmarket/work/delivery/order/${id}/deliver/end`)
}
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-5 gap-4">
      <div v-for="order in orders" class="flex flex-col">
        <p class="font-semibold">ID: #{{ order.id }}</p>
        <p>Добавить инфу потом сюда</p>
        <el-button v-if="order?.currentWorkerId == user?.id && order?.status == 3"
                   @click="finish(order.id)">Завершить доставку
        </el-button>
        <el-button v-else-if="order?.status == 2" @click="accept(order.id)"
                   :disabled="order.status != 2 || order?.currentWorkerId != null">Принять
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>