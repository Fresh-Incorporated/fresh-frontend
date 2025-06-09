<script setup lang="ts">
import { columns } from './balance_history.columns'
import DataTable from "~/components/goodies/DataTable.vue";
import type {Payment} from "~/types/payment";

const data = ref<Payment[]>([])

async function getData(): Promise<Payment[]> {
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '489e1d42',
      amount: 125,
      status: 'processing',
      email: 'example@gmail.com',
    },
  ]
}

onMounted(async () => {
  data.value = await getData()
})
</script>

<template>
  <div class="container py-10 mx-auto col-span-4">
    <DataTable :columns="columns" :data="data" />
  </div>
</template>