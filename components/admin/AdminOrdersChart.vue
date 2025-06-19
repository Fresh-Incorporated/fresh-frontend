<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'

const data = defineModel<any[]>()

const AreaChartData = ref<AreaChartItem[]>([])

interface AreaChartItem {
  date: string
  [key: string]: string | number
}

const categories: Record<string, BulletLegendItemInterface> = ref({})

const enabledCategories: Record<string, BulletLegendItemInterface> = ref({})

const xFormatter = (i: number): string | number => `${AreaChartData.value[i]?.date}`

const toggleCategory = (key: string) => {
  const current = { ...enabledCategories.value }
  if (current[key]) {
    delete current[key]
  } else {
    current[key] = categories.value[key]
  }
  enabledCategories.value = current
}

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
    allCategories[name] = {
      name,
      color: branchColors[index % branchColors.length],
    }
  })

  categories.value = allCategories
  enabledCategories.value = structuredClone(allCategories)

  // Преобразуем данные для AreaChart
  AreaChartData.value = data.value.map(item => {
    const entry: AreaChartItem = {
      date: item.date,
      total: item.total,
    }

    for (const branchName of branchNames) {
      entry[branchName] = item.branches?.[branchName] || 0
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
</script>

<template>
  <ShCard class="col-span-4 !py-0 overflow-hidden gap-0">
    <div class="h-8 flex justify-end items-center gap-4 mx-4">
      <div class="flex-1">Заказы</div>
      <div
          v-for="(category, key) in categories"
          :key="key"
          @click="toggleCategory(key)"
          class="flex items-center gap-2 cursor-pointer"
      >
        <div :style="{ background: category.color }" class="w-2 h-2 rounded-full"></div>
        <p class="text-sm pb-px">{{ category.name }}</p>
      </div>
    </div>

    <AreaChart
        style="width: calc(100% + 10px); transform: translateX(-5px)"
        :height="164"
        :data="AreaChartData"
        :categories="enabledCategories"
        :y-num-ticks="-1"
        :x-num-ticks="-1"
        :y-grid-line="false"
        :legend-position="LegendPosition.Top"
        :hide-legend="true"
        :x-formatter="xFormatter"
        :curve-type="CurveType.Linear"
    />
  </ShCard>
</template>

<style scoped>

</style>
