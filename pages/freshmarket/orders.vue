<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMOrderHistory from "~/components/freshmarket/FMOrderHistory.vue";

const {orders} = useUser();

const confirm = async (id: number) => {
  await http.post(`/freshmarket/order/${id}/confirm`)
}

const openedHistory = ref(false)
const history = ref([])
</script>

<template>
<div>
  <FMOrderHistory v-model="openedHistory" :history="history" />
  <div class="px-2 md:px-16 my-4 md:my-8">
    <h2 class="text-xl font-onest">Текущие доставки</h2>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-1">
      <div class="bg-neutral-900 rounded-lg shadow-lg border border-neutral-800" v-for="order in orders?.orders.filter(o => o.status < 5).sort((a, b) => a.status < b.status ? -1 : 1)">
        <div class="p-2">
          <div class="flex">
            <p class="font-onest text-neutral-500 font-medium"><i class="pi pi-warehouse text-sm"></i>  ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
            <div class="flex-1"></div>
            <div>
              <div v-if="order?.status == 0" class="bg-neutral-800/[0.25] border border-neutral-800 rounded-lg px-2 py-0.5 text-sm text-neutral-300">Ожидает принятия</div>
              <div v-else-if="order?.status == 1" class="bg-blue-500/[0.25] border border-blue-500/[0.75] rounded-lg px-2 py-0.5 text-sm text-blue-300">Собираем</div>
              <div v-else-if="order?.status == 2" class="bg-yellow-800/[0.25] border border-yellow-800 rounded-lg px-2 py-0.5 text-sm text-orange-400">Ищем курьера</div>
              <div v-else-if="order?.status == 3" class="bg-amber-800/[0.25] border border-amber-800 rounded-lg px-2 py-0.5 text-sm text-orange-300">Доставляем</div>
              <div v-else-if="order?.status == 4" class="bg-green-500/[0.25] border border-green-500 rounded-lg px-2 py-0.5 text-sm text-green-300">Доставлен</div>
            </div>
          </div>
          <p class="text-neutral-200">Город: {{order?.branch?.city}}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 my-2">
            <div v-for="product in order?.products" class="border border-neutral-800 rounded-lg flex gap-2">
              <div class="w-12 h-12">
                <img :src="orders?.products?.find(p => p.id == product.id)?.icon" class="w-12 h-12" alt="">
              </div>
              <div class="w-full truncate relative">
                <p class="truncate">{{orders?.products?.find(p => p.id == product.id)?.name}}</p>
                <p class="text-sm truncate absolute right-2 bottom-1 text-neutral-400">{{product?.count}} шт.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-neutral-800 p-2 flex gap-4">
          <p>Цена: <strong class="text-blue-500">{{order?.price}} АР</strong></p>
          <div class="flex-1"></div>
          <p class="text-neutral-300">{{order?.data?.products?.reduce((sum, product) => sum + product.count, 0)}} товар</p>
          <el-button v-if="order.status === 4" @click="confirm(order.id)" size="small" type="success" plain>Подтвердить получение</el-button>
          <el-button @click="history = order?.history?.reverse(); openedHistory = true" size="small" type="info" text>История</el-button>
        </div>
      </div>
    </div>
    <h2 class="text-xl font-onest mt-8">Вы уже заказывали</h2>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-1">
      <div class="bg-neutral-900 rounded-lg shadow-lg border border-neutral-800" v-for="order in orders?.orders.filter(o => o.status == 5).sort((a, b) => a.status < b.status ? -1 : 1)">
        <div class="p-2">
          <div class="flex">
            <p class="font-onest text-neutral-500 font-medium"><i class="pi pi-warehouse text-sm"></i>  ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
            <div class="flex-1"></div>
            <div>
              <div v-if="order?.status == 0" class="bg-neutral-800/[0.25] border border-neutral-800 rounded-lg px-2 py-0.5 text-sm text-neutral-300">Ожидает принятия</div>
              <div v-else-if="order?.status == 1" class="bg-blue-500/[0.25] border border-blue-500/[0.75] rounded-lg px-2 py-0.5 text-sm text-blue-300">Собираем</div>
              <div v-else-if="order?.status == 2" class="bg-yellow-800/[0.25] border border-yellow-800 rounded-lg px-2 py-0.5 text-sm text-orange-400">Ищем курьера</div>
              <div v-else-if="order?.status == 3" class="bg-amber-800/[0.25] border border-amber-800 rounded-lg px-2 py-0.5 text-sm text-orange-300">Доставляем</div>
              <div v-else-if="order?.status == 4" class="bg-green-500/[0.25] border border-green-500 rounded-lg px-2 py-0.5 text-sm text-green-300">Доставлен</div>
            </div>
          </div>
          <p class="text-neutral-200">Город: {{order?.branch?.city}}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 my-2">
            <div v-for="product in order?.products" class="border border-neutral-800 rounded-lg flex gap-2">
              <div class="w-12 h-12">
                <img :src="orders?.products?.find(p => p.id == product.id)?.icon" class="w-12 h-12" alt="">
              </div>
              <div class="w-full truncate relative">
                <p class="truncate">{{orders?.products?.find(p => p.id == product.id)?.name}}</p>
                <p class="text-sm truncate absolute right-2 bottom-1 text-neutral-400">{{product?.count}} шт.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-neutral-800 p-2 flex gap-4">
          <p>Цена: <strong class="text-blue-500">{{order?.price}} АР</strong></p>
          <div class="flex-1"></div>
          <p class="text-neutral-300">{{order?.data?.products?.reduce((sum, product) => sum + product.count, 0)}} товар</p>
          <el-button v-if="order.status === 4" @click="confirm(order.id)" size="small" type="success" plain>Подтвердить получение</el-button>
          <el-button @click="history = order?.history?.reverse(); openedHistory = true" size="small" type="info" text>История</el-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>