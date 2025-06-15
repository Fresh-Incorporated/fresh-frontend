<script setup lang="ts">
import { columns } from './balance_history.columns'
import DataTable from "~/components/goodies/DataTable.vue";

const {user, userLoading, balanceHistory, moreBalanceHistory} = useUser()
const allLoaded = ref(false);

async function getData() {
  const newHistoryItems = await moreBalanceHistory()
  if (newHistoryItems.length < 20) {
    allLoaded.value = true;
  }
}

onMounted(async () => {
  await getData()
})

async function tableLoadMore(fullLoaded: () => void, callback: (...args: any[]) => void, args: any[]) {
  await getData()
  callback(...args)
  if (allLoaded.value) {
    fullLoaded()
  }
}
</script>

<template>
  <div class="col-span-1 xl:col-span-2 2xl:col-span-4 relative">
    <DataTable @load-more="tableLoadMore" :columns="columns" v-model:data="balanceHistory" pagination />
    <transition name="loaded">
      <Skeleton v-if="userLoading" class="w-full rounded-full absolute top-0 left-0 z-10 h-120" />
    </transition>
  </div>
</template>