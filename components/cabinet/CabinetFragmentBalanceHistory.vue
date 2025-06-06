<script setup lang="ts">
import ProjectHead from "~/components/project/ProjectHead.vue";
import FMCartButton from "~/components/freshmarket/FMCart.vue";
import FMProductsList from "~/components/freshmarket/FMProductsList.vue";
import {http} from "~/composables/useHttp";

const {user, userLoading, balanceHistory, moreBalanceHistory} = useUser()
const allLoaded = ref(false);

const load = async () => {
  console.log(123);
  const newHistoryItems = await moreBalanceHistory()
  if (newHistoryItems.length < 20) {
    allLoaded.value = true;
  }
};

onMounted(() => {
  load()
})
</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 h-64 lg:col-span-2 relative overflow-hidden">
    <Skeleton v-model="userLoading" class="w-full h-full absolute z-20" />
    <el-scrollbar>
      <div v-infinite-scroll="load" infinite-scroll-immediate="false">
        <transition name="hide">
          <div v-if="balanceHistory.length > 0">
            <div v-for="bh in balanceHistory" class="h-16 flex gap-4 items-center relative p-1 border-b border-neutral-800 px-2 md:px-4">
              <div class="flex-1">
                <p class="text-xs text-blue-400/[.75]">{{
                    bh.action_type == "transfer" ? "Перевод средств" :
                      bh.action_type == "deposit" ? "Пополнение баланса" :
                          bh.action_type == "withdraw" ? "Вывод средств на SPWorlds" :
                              bh.action_type == "freshmarket_shop_withdraw" ? "Вывод из магазина FreshMarket" :
                                  bh.action_type == "freshmarket_order" ? "Заказ на FreshMarket" :
                                      bh.action_type == "freshmarket_pay" ? "Оплата FreshMarket" :
                                          bh.action_type
                  }}
                </p>
                <p class="text-sm md:text-base">{{bh.message}}</p>
              </div>
              <div class="mr-4 flex flex-col justify-center items-center">
                <p :class="{
                  'text-red-500': bh.value < 0,
                  'text-green-500': bh.value > 0,
                  'text-neutral-500': bh.value == 0,
                }" class="text-sm md:text-base">{{bh.value}} АР</p>
              </div>
              <p class="absolute bottom-1 right-1 text-xs text-neutral-600">{{ formatDateRelative(bh.createdAt) }}</p>
            </div>
          </div>
        </transition>
        <transition>
          <div v-if="allLoaded && balanceHistory.length > 0"
               class="transform duration-500 flex justify-center my-4 text-sm items-center gap-2 text-neutral-500">
            <i class="pi pi-times"></i>Больше нет операций
          </div>
          <div v-else-if="allLoaded && balanceHistory.length == 0"
               class="transform duration-500 flex justify-center items-center text-xl items-center gap-2 text-neutral-500 h-64">
            <i class="pi pi-times"></i>Нет операций
          </div>
        </transition>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>

</style>