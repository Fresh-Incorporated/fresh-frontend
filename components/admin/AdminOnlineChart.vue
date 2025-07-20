<script setup lang="ts">
import {http} from "~/composables/useHttp";
import {VisArea, VisCrosshair, VisLine, VisTooltip, VisXYContainer} from "@unovis/vue";
import AreaLineChart, {type CategoryItem} from "~/components/goodies/charts/AreaLineChart.vue";

const AreaChartData = ref<AreaChartItem[]>([])

interface AreaChartItem {
  date: string
  online: number
  users: number
}

const categories: Record<string, CategoryItem> = {
  online: { name: 'Сейчас в сети', color: '#1def9f' },
  users: { name: 'Регистрации', color: '#631def' },
}

onMounted(() => {
  setInterval(() => {
    refresh()
  }, 2000)
})

const refresh = async () => {
  const res = await http.get("/stats")
  const data = res.data
  data.date = new Date()
  AreaChartData.value = [...AreaChartData.value, data]
  if (AreaChartData.value.length > 300) {
    AreaChartData.value.shift()
  }
}
</script>

<template>
  <ShCard class="col-span-4 !py-0 overflow-hidden gap-0">
    <AreaLineChart :categories="categories" v-model="AreaChartData" categories-switch />
  </ShCard>
</template>

<style scoped>

</style>