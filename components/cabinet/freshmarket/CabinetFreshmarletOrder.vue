<script setup lang="ts">
import FreshmarketOrderHistory from "~/components/freshmarket/FreshmarketOrderHistory.vue";
import {http} from "~/composables/useHttp";

const {updateOrders} = useUser();

const props = defineProps({
  order: Object,
  products: Array,
})

const confirm = async () => {
  await http.post(`/freshmarket/order/${props.order.id}/confirm`)
  await updateOrders()
}
</script>

<template>
  <ShCard class="!p-2 relative gap-2">
    <ShCardTitle class="opacity-50 flex items-end gap-1">
      <Icon name="lucide:map-pin-house" size="18" />
      <p>ПУНКТ ВЫДАЧИ ЗАКАЗОВ</p>
    </ShCardTitle>
    <ShCardDescription>
      <button @click="branchInfo = order?.branch; openedBranchInfo = true" class="dark:text-neutral-200 hover:underline">Филиал: {{order?.branch?.name}}</button>
      <p v-if="order?.status == 4" class="text-neutral-500 dark:text-neutral-200">Ячейка: <span class="text-blue-500">{{order?.branchCell?.letter}}-{{order?.branchCell?.number}}</span></p>
    </ShCardDescription>
    <div class="absolute top-2 right-2">
      <ShBadge v-if="order?.status == 0" variant="secondary">Ожидает принятия</ShBadge>
      <ShBadge v-else-if="order?.status == 1" variant="secondary" class="text-blue-700 dark:text-blue-300">Собираем</ShBadge>
      <ShBadge v-else-if="order?.status == 2" variant="secondary" class="text-orange-600 dark:text-orange-500">Ищем курьера</ShBadge>
      <ShBadge v-else-if="order?.status == 3" variant="secondary" class="text-orange-600 dark:text-orange-400">Доставляем</ShBadge>
      <ShBadge v-else-if="order?.status == 4" variant="secondary" class="text-green-700 dark:text-green-400">Доставлен</ShBadge>
    </div>
    <ShCardContent class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-0 gap-2">
      <ShCard v-for="product in order?.products" class="flex-row gap-2 !p-0.5">
        <div class="w-12 h-12 aspect-square">
          <img :src="products?.find(p => p.id == product.id)?.icon" class="w-12 h-12 aspect-square" alt="">
        </div>
        <div class="w-full truncate relative py-1">
          <p class="truncate">{{products?.find(p => p.id == product.id)?.name}}</p>
          <p class="text-sm truncate absolute right-2 bottom-1 text-neutral-400">{{product?.count}} шт.</p>
        </div>
      </ShCard>
    </ShCardContent>
    <ShSeparator />
    <ShCardFooter class="!p-0 flex gap-4 mt-auto text-sm">
      <p>Цена: <strong class="text-primary">{{order?.price}} АР</strong></p>
      <div class="flex-1"></div>
      <!--          <p>{{order?.data?.products?.reduce((sum, product) => sum + product.count, 0)}} товар</p>-->
      <div class="relative">
        <div v-if="order.status === 4" class="absolute w-full h-full blur-lg animate-ping">
          <div class="w-full h-full opacity-50 bg-green-500 dark:bg-green-900"></div>
        </div>
        <ShButton v-if="order.status === 4" @click="confirm()" size="xs" variant="success" class="relative">Подтвердить получение</ShButton>
      </div>
      <FreshmarketOrderHistory :history="order?.history" :id="order.id">
        <ShButton size="xs" variant="ghost" class="relative">История</ShButton>
      </FreshmarketOrderHistory>
    </ShCardFooter>
  </ShCard>
</template>

<style scoped>

</style>