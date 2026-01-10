<script setup lang="ts">
import { format, subDays } from 'date-fns'
import {VisLine, VisXYContainer, VisStackedBar, VisArea} from "@unovis/vue";

const {user, monthBalance, updateMonthBalance, userLoading} = useUser()

interface AreaChartItem {
  date: string
  balance: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  balance: { name: 'Баланс', color: '#1d6cef' },
}

const AreaChartData = ref<AreaChartItem[]>([
  { date: 'January', balance: 0 },
  { date: 'February', balance: 0 },
  { date: 'March', balance: 0 },
  { date: 'April', balance: 0 },
  { date: 'May', balance: 0 },
  { date: 'June', balance: 0 },
])

const x = (d: Object) => {
  return new Date(d.date)
}
const y = (d: Object, key: string) => {
  return d[key]
}

onMounted(async () => {
  await updateMonthBalance()
  AreaChartData.value = []

  let currentBalance = user.value?.balance
  for (let i = 0; i < 30; i++) {
    const date = subDays(new Date(), i)
    currentBalance -= monthBalance.value[format(date, 'yyyy-MM-dd')] ?? 0
    AreaChartData.value.push({
      date: format(date, 'yyyy-MM-dd'),
      balance: parseFloat(currentBalance.toFixed(2)),
    })
  }
  AreaChartData.value.reverse()
})

const svgDefs = computed(() => {
  const createGradientWithHex = (id: number, color: string) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="${color}" stop-opacity="1" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  `;
  const createGradientWithCssVar = (id: number, color: string) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">
      <stop offset="0%" style="stop-color:var(--vis-color0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:var(--vis-color0);stop-opacity:0" />
    </linearGradient>
  `;
  return createGradientWithHex(0, categories.balance.color);
});
</script>

<template>
  <ShCard v-model:loading="userLoading" class="col-span-1 2xl:col-span-3 h-41 !py-0 overflow-hidden">
    <div class="h-[160px] w-full">
      <VisXYContainer :svg-defs="svgDefs" class="h-[160px]" :data="AreaChartData">
        <template v-for="(i, iKey) in categories" :key="iKey">
          <VisArea
              :x="x"
              :y="(info) => y(info, iKey)"
              :color="`url(#gradient0-${i.color})`"
              :opacity="0.5"
              curve-type="linear"
          />
          <VisLine
              :x="x"
              :y="(info) => y(info, iKey)"
              :color="i.color"
              curve-type="linear"
          />
        </template>
      </VisXYContainer>
    </div>
  </ShCard>
</template>

<style scoped>

</style>