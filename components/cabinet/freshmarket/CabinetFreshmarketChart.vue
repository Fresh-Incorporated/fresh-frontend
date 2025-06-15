<script setup lang="ts">
import { format, subDays } from 'date-fns'
import {http} from "~/composables/useHttp";


const { user } = useUser()

const loading = defineModel<Boolean>('loading')
const shop = defineModel<Boolean>('shop')

interface Sale {
  orderId: number
  count: number
  price: number
  date: string
}

interface ProductSales {
  productId: number
  sales: Sale[]
}

const AreaChartData = ref<any[]>([])
const categories = ref<Record<string, { name: string; color: string }>>({
})

const xFormatter = (i: number): string | number => `${AreaChartData.value[i]?.date}`

onMounted(async () => {
  await updateChart()
})

watch(shop, async () => {
  await updateChart()
})

const updateChart = async () => {
  if (!shop.value) return;
  const response = await http.get(`/freshmarket/shop/${shop.value?.id}/sells`)
  const data: ProductSales[] = response.data.productLastSells

  const daysBack = 30
  const chartMap: Record<string, Record<string, { value: number; count: number }>> = {}

  // Список всех товаров
  const allProducts = shop.value?.products || []
  const productIds = allProducts.map(p => p.id.toString())

  // Назначение цветов и имен
  const preparedCategories: Record<string, { name: string; color: string }> = {}

  for (const product of allProducts) {
    const pid = product.id.toString()
    preparedCategories[pid] = {
      name: product.name || `Товар ${pid}`,
      color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
    }
  }
  categories.value = preparedCategories

  // Инициализация каждой даты и каждого продукта с нулями
  for (let i = 0; i < daysBack; i++) {
    const date = subDays(new Date(), i)
    const dayKey = format(date, 'yyyy-MM-dd')
    chartMap[dayKey] = {}

    for (const pid of productIds) {
      chartMap[dayKey][pid] = { value: 0, count: 0 }
    }
  }

  // Добавление данных о продажах
  for (const product of data) {
    const pid = product.productId.toString()

    for (const sale of product.sales) {
      const dayKey = format(new Date(sale.date), 'yyyy-MM-dd')
      if (!chartMap[dayKey]) continue

      chartMap[dayKey][pid].value += sale.price * sale.count
      chartMap[dayKey][pid].count += sale.count
    }
  }

  // Сборка данных для графика
  AreaChartData.value = Object.entries(chartMap)
      .map(([date, dayData]) => {
        const entry: Record<string, any> = { date }
        for (const pid of productIds) {
          entry[pid] = dayData[pid]?.value ?? 0 // Можно заменить на .count
        }
        return entry
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
</script>

<template>
  <ShCard v-model:loading="loading" class="col-span-1 2xl:col-span-3 h-64 w-full !py-0 overflow-hidden gap-0">
    <div class="h-8 flex justify-end items-center gap-4 mx-4">
      <div class="flex items-center gap-2" v-for="category in categories">
        <div :style="{background: category.color}" class="w-2 h-2 rounded-full"></div>
        <p class="text-sm pb-px">{{category.name}}</p>
      </div>
    </div>
    <AreaChart
        :key="Object.keys(categories).join(',')"
        style="width: calc(100% + 10px); transform: translateX(-5px)"
        :height="224"
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