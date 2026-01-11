<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import AreaLineChart, {type CategoryItem} from "~/components/goodies/charts/AreaLineChart.vue";

const data = defineModel<any[]>()

const AreaChartData = ref<AreaChartItem[]>([])

interface AreaChartItem {
  date: string
  [key: string]: string | number
}

const categories: Record<string, CategoryItem> = ref({})

// Подготовка данных
const prepareChartData = () => {
  if (!data.value?.length) return

  // Собираем список уникальных категорий (всего + филиалы)
  const firstItem = data.value[0]
  const branchNames = firstItem?.branches ? Object.keys(firstItem.branches) : []

  const allCategories: Record<string, BulletLegendItemInterface> = {
    total: { name: 'Всего', color: '#1dd6ef' },
  }

  // Динамически задаём цвета для филиалов
  const branchColors = ['#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#AF7EEB', '#FF9F40', '#6BE3FF', '#FF75A0']

  branchNames.forEach((name, index) => {
    allCategories[simpleHash(name)] = {
      name,
      color: branchColors[index % branchColors.length],
    }
  })

  categories.value = allCategories

  // Преобразуем данные для AreaChart
  AreaChartData.value = data.value.map(item => {
    const entry: AreaChartItem = {
      date: item.date,
      total: item.total,
    }

    for (const branchName of branchNames) {
      entry[simpleHash(branchName)] = item.branches?.[branchName] || 0
    }

    return entry
  })
}

// Следим за изменением data
watchEffect(() => {
  prepareChartData()
})

onMounted(() => {
  prepareChartData()
})

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16).slice(0, 6);
}
</script>

<template>
  <ShCard class="col-span-4 !py-0 overflow-hidden gap-0">
    <AreaLineChart :categories="categories" v-model="AreaChartData" categories-switch />
  </ShCard>
</template>

<style scoped>

</style>
