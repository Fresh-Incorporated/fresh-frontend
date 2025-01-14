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
  const response = await http.post(`freshmarket/work/delivery/order/${id}/deliver`)
  const index = orders.value.findIndex(item => item?.id === id);
  if (index !== -1) {
    orders.value[index] = response.data.order;
  } else {
    orders.value.push(response.data.order)
  }
}

const finish = async (id: number) => {
  const response = await http.post(`freshmarket/work/delivery/order/${id}/deliver/end`)
  const index = orders.value.findIndex(item => item?.id === id);
  if (index !== -1) {
    orders.value[index] = response.data.order;
  } else {
    orders.value.push(response.data.order)
  }
}
</script>

<template>
  <div class="w-full p-4">
    <div v-for="order in orders.filter((_order) => _order?.currentWorkerId == user?.id)" class="flex flex-col w-full border rounded-lg border-neutral-700 mb-4">
      <div class="p-2">
        <p class="font-semibold">ID: #{{ order.id }} [ПРИНЯТО ВАМИ]</p>
        <p class="font-medium text-neutral-300">Ячейка курьера: <span class="text-primary-dark">{{ order?.deliverCell?.letter }}-{{ order?.deliverCell?.number }}</span></p>
        <p class="font-medium text-neutral-300">Тип доставки: ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
        <p class="font-semibold text-neutral-200 mt-2">Информация точки назначения</p>
        <p class="font-medium text-neutral-300">Город: {{ order?.branchCell?.location?.city }}</p>
        <p class="font-medium text-neutral-300">Координаты: <span v-for="coordinate in order?.branchCell?.location?.coordinates">{{coordinate?.world}} X: {{coordinate?.x}} Y: {{coordinate?.y}} Z: {{coordinate?.z}}<br></span></p>
        <p class="font-medium text-neutral-300">Ячейка: <span class="text-secondary-dark">{{ order?.branchCell?.letter }}-{{ order?.branchCell?.number }}</span></p>
      </div>
      <el-popconfirm
          confirm-button-text="Подтвердить"
          cancel-button-text="Отмена"
          hide-icon
          title="Вы уверены что хотите завершить доставку? Это действие нельзя будет отменить!"
          @confirm="finish(order?.id)"
          :width="300"
      >
        <template #reference>
          <el-button class="m-2 mt-0">Завершить доставку</el-button>
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
        <p class="font-semibold">ID: #{{ order?.id }}</p>
        <el-button v-if="order?.status == 2" @click="accept(order?.id)"
                   :disabled="order.status != 2 || order?.currentWorkerId != null" type="success" plain>Принять
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>