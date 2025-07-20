<script setup lang="ts">
import {http} from "~/composables/useHttp";
import {VisArea, VisCrosshair, VisLine, VisTooltip, VisXYContainer} from "@unovis/vue";

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

const x = (d: Object) => {
  return new Date(d.date)
}
const y = (d: Object, key: string) => {
  return d[key]
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

const svgDefs = computed(() => {
  const createGradientWithHex = (id: number, color: string) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="${color}" stop-opacity="1" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  `; // БЛЯ НАДО КОМПОНЕНТ СДЕЛАТЬ А ТО ЭТО ПИЗДЕЦ ВСЁ ПОВТОРЯТЬ

  return Object.entries(categories).map((color) =>
      createGradientWithHex(color[0], color[1].color)
  ).join("");
});

const template = (d: any) => {
  const products = []
  for (const category in categories) {
    products.push(`<div class="flex items-center gap-2"><div style="background: ${categories[category].color}" class="w-2 h-2 rounded-full"></div> ${categories[category].name}: ${d[category]} АР</div>`)
  }

  return `<div>
${formatDateAbsolute(d.date)}<br>
${products.join("")}
</div>`
}

const color = (d: any, i: number) => {
  console.log(d)
  return Object.values(categories).map(c => c.color)[i]
}
</script>

<template>
  <ShCard class="col-span-4 !py-0 overflow-hidden gap-0">
    <div class="h-8 flex justify-end items-center gap-4 mx-4">
      <div class="flex-1">Real time</div>
    </div>
    <VisXYContainer :svg-defs="svgDefs" class="h-[224px]" :data="AreaChartData">
      <VisTooltip />
      <template v-for="(i, iKey) in categories" :key="iKey">
        <VisLine
            :x="x"
            :y="(info) => y(info, iKey)"
            :color="i.color"
        />
        <VisArea
            :x="x"
            :y="(info) => y(info, iKey)"
            :color="`url(#gradient${iKey}-${i.color})`"
            :opacity="0.5"
        />
      </template>
      <VisCrosshair :color="color" :template="template" />
    </VisXYContainer>
  </ShCard>
</template>

<style scoped>

</style>