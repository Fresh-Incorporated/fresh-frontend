<script setup lang="ts">
const {user, monthBalance, updateMonthBalance} = useUser()
import { format, subDays } from 'date-fns'

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

const xFormatter = (i: number): string | number => `${AreaChartData.value[i]?.date}`

onMounted(async () => {
  await updateMonthBalance()
  AreaChartData.value = []

  let currentBalance = user.value.balance
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
</script>

<template>
  <ShCard class="col-span-3 h-27 py-0 overflow-hidden">
    <AreaChart
        style="width: calc(100% + 10px); transform: translateX(-5px)"
        :height="108"
        :data="AreaChartData"
        :categories="categories"
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