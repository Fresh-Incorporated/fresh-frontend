<script setup lang="ts">
const data = defineModel()
const currentRegistrations = defineModel('currentRegistrations')

const AreaChartData = ref<AreaChartItem[]>([])

interface AreaChartItem {
  date: string
  count: number
  total: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  count: { name: 'За день', color: '#1d6cef' },
  total: { name: 'Всего', color: '#1dd6ef' },
}

const enabledCategories: Record<string, BulletLegendItemInterface> = ref(structuredClone(categories))

const xFormatter = (i: number): string | number => `${AreaChartData.value[i]?.date}`

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

const toggleCategory = async (key: string) => {
  const current = { ...enabledCategories.value }
  if (current[key]) {
    delete current[key]
  } else {
    current[key] = categories[key]
  }
  enabledCategories.value = current
}
</script>

<template>
  <ShCard class="col-span-4 !py-0 overflow-hidden gap-0">
    <div class="h-8 flex justify-end items-center gap-4 mx-4">
      <div class="flex-1">Регистрации</div>
      <div @click="toggleCategory(key)" class="flex items-center gap-2 cursor-pointer" v-for="(category, key) in categories">
        <div :style="{background: category.color}" class="w-2 h-2 rounded-full"></div>
        <p class="text-sm pb-px">{{category.name}}</p>
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