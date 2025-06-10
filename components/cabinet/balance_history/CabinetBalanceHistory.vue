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
  <div class="col-span-4">
    <DataTable @load-more="tableLoadMore" :columns="columns" v-model:data="balanceHistory" pagination />
  </div>
</template>