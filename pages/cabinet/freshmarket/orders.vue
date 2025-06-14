<script setup lang="ts">
import {http} from "~/composables/useHttp";
import FreshmarketOrderHistory from "~/components/freshmarket/FreshmarketOrderHistory.vue";
import CabinetFreshmarletOrder from "~/components/cabinet/freshmarket/CabinetFreshmarletOrder.vue";

definePageMeta({
  layout: 'cabinet'
})

const {orders, updateOrders} = useUser();

const openedBranchInfo = ref(false)
const branchInfo = ref({})

onMounted(updateOrders)
</script>

<template>
<div class="px-2 lg:px-4 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 w-full gap-4">
  <el-dialog
      v-model="openedBranchInfo"
      :title="branchInfo?.name"
      width="500"
      align-center
  >
    <div>
      <div class="w-full aspect-video">
        <el-carousel height="889" indicator-position="none">
          <el-carousel-item v-for="image in branchInfo?.images" :key="item">
            <img class="w-full h-full" :src="image?.image" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex flex-col">
          <h1 class="text-xl  text-white">{{ branchInfo?.name }}</h1>
          <p v-if="branchInfo?.description != null">{{ branchInfo?.description }}</p>
        </div>
        <div v-if="branchInfo?.city != null">
          <span>Город: </span>
          <span>{{ branchInfo?.city }}</span>
        </div>
        <div class="w-full">
          <h1 class="text-center text-white text-lg">Как добраться?</h1>
          <div class="w-full">
            <div v-if="branchInfo?.coordinates.some((someBranch) => someBranch.world == 'nether')" class="w-full flex justify-between">
              <span>Координаты в метро:</span>
              <span>{{ branchInfo?.coordinates.find((someBranch) => someBranch.world == 'nether').x }} {{ branchInfo?.coordinates.find((someBranch) => someBranch.world == 'nether').z }}</span>
            </div>
            <div v-if="branchInfo?.coordinates.some((someBranch) => someBranch.world == 'the_end')" class="w-full flex justify-between">
              <span>Координаты в энде:</span>
              <span>{{ branchInfo?.coordinates.find((someBranch) => someBranch.world == 'the_end').x }} {{branchInfo?.coordinates.find((someBranch) => someBranch.world == 'overworld').y }} {{branchInfo?.coordinates.find((someBranch) => someBranch.world == 'overworld').z }}</span>
            </div>
            <div v-if="branchInfo?.coordinates.some((someBranch) => someBranch.world == 'overworld')" class="w-full flex justify-between">
              <span>Координаты в верхнем мире:</span>
              <span>{{ branchInfo?.coordinates.find((someBranch) => someBranch.world == 'overworld').x }}  {{branchInfo?.coordinates.find((someBranch) => someBranch.world == 'overworld').y }} {{branchInfo?.coordinates.find((someBranch) => someBranch.world == 'overworld').z }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="openedBranchInfo = false">
          Закрыть
        </el-button>
      </div>
    </template>
  </el-dialog>
  <ShCard class="!p-4 2xl:col-span-2">
    <ShCardTitle>
      Текущие доставки
    </ShCardTitle>
    <div v-if="orders?.orders.filter(o => o.status < 5)?.length == 0" class="text-center">
      <p class="text-card-foreground text-sm">Похоже, тут ничего нет :(</p>
      <p>Время сделать новый заказ!</p>
    </div>
    <div class="space-y-2">
      <CabinetFreshmarletOrder
          v-for="order in orders?.orders.filter(o => o.status < 5).sort((a, b) => a.status < b.status ? -1 : 1)"
          :order="order"
          :products="orders?.products"
      />
    </div>
  </ShCard>
  <ShCard class="!p-4 2xl:col-span-2">
    <ShCardTitle>
      История заказов
    </ShCardTitle>
    <div v-if="orders?.orders.filter(o => o.status < 5)?.length == 0" class="text-center">
      <p class="text-card-foreground text-sm">Похоже, тут ничего нет :(</p>
    </div>
    <div class="space-y-2">
      <CabinetFreshmarletOrder
          v-for="order in orders?.orders.filter(o => o.status == 5).sort((a, b) => a.status < b.status ? -1 : 1)"
          :order="order"
          :products="orders?.products"
      />
    </div>
  </ShCard>
</div>
</template>

<style scoped>

</style>