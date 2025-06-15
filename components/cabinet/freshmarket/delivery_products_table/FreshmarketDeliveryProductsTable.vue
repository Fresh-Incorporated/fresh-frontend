<script setup lang="ts">
import { columns } from './delivery_products.columns'
import DataTable from "~/components/goodies/DataTable.vue";

const {user} = useUser()

const props = defineProps({
  data: Array,
  products: Array,
})

const compiledData = ref([])

onMounted(() => {
  for (const datum of props.data) {
    const product = props.products.find((p) => p.id === datum.id)
    compiledData.value.push(Object.assign({}, {
      pos_count: datum.count as number, // сколько в заказе, тк в product есть count на складе
    }, product))
  }
  console.log(compiledData.value)
})
</script>

<template>
  <div class="col-span-1 xl:col-span-2 2xl:col-span-4 relative">
    <DataTable :columns="columns" v-model:data="compiledData" v-if="compiledData?.length > 0" />
  </div>
</template>