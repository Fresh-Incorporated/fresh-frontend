<script setup lang="ts">
import CabinetFreshmarletOrder from "~/components/cabinet/freshmarket/CabinetFreshmarletOrder.vue";

definePageMeta({
  layout: 'cabinet'
})

const {orders, updateOrders} = useUser();

onMounted(updateOrders)
</script>

<template>
<div class="px-2 lg:px-4 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 w-full gap-4">
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
    <div v-if="orders?.orders.filter(o => o.status == 5)?.length == 0" class="text-center">
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