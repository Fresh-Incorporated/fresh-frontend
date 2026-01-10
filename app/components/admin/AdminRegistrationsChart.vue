<script setup lang="ts">
import AreaLineChart, {type CategoryItem} from "~/components/goodies/charts/AreaLineChart.vue";

const data = defineModel()
const currentRegistrations = defineModel('currentRegistrations')

const AreaChartData = ref<AreaChartItem[]>([])

interface AreaChartItem {
  date: string
  count: number
  total: number
}

const categories: Record<string, CategoryItem> = {
  count: { name: 'За день', color: '#1d6cef' },
  total: { name: 'Всего', color: '#1dd6ef' },
}

onMounted(() => {
  refresh()
})

const refresh = () => {
  const chartData = data.value

  let currentTotal = currentRegistrations.value - chartData.reduce((sum, p) => parseInt(p.count) + sum, 0)

  for (const p of chartData) {
    currentTotal += p.count
    p.total = currentTotal
  }

  AreaChartData.value = chartData;
}
</script>

<template>
  <ShCard class="col-span-4 !py-0 overflow-hidden gap-0">
    <AreaLineChart :categories="categories" v-model="AreaChartData" categories-switch />
  </ShCard>
</template>

<style scoped>

</style>