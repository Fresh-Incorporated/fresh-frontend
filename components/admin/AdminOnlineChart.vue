<script setup lang="ts">
import {http} from "~/composables/useHttp";

const AreaChartData = ref<AreaChartItem[]>([])

interface AreaChartItem {
  date: string
  online: number
  users: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  online: { name: 'Сейчас в сети', color: '#1def9f' },
  users: { name: 'Регистрации', color: '#631def' },
}

const enabledCategories: Record<string, BulletLegendItemInterface> = ref(structuredClone(categories))

const xFormatter = (i: number): string | number => `${AreaChartData.value[i]?.date}`

onMounted(() => {
  setInterval(() => {
    refresh()
  }, 10000)
})

const refresh = async () => {
  const res = await http.get("/stats")
  const data = res.data
  data.date = new Date()
  AreaChartData.value = [...AreaChartData.value, data]
  if (AreaChartData.value.length > 100) {
    AreaChartData.value.shift()
  }
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
      <div class="flex-1">Real time</div>
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