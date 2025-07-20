<script setup lang="ts">
import { format, subDays } from 'date-fns'
import {http} from "~/composables/useHttp";
import {VisXYContainer, VisLine, VisCrosshair, VisArea, VisTooltip} from '@unovis/vue'

const { user } = useUser()

const loading = defineModel<Boolean>('loading')
const shop = defineModel<Boolean>('shop')
const props = defineProps({
  shopId: Number
})

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

const bulletItems = ref([])

const x = (d: Object) => {
  return new Date(d.date)
}
const y = (d: Object, key: number) => {
  return d[key]
}

onMounted(async () => {
  await updateChart()
})

watch(shop, async () => {
  await updateChart()
})

const updateChart = async () => {
  if (!shop.value) return;
  const response = await http.get(`/freshmarket/shop/${props.shopId}/sells`)
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
      color: product.color || `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
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

const color = (d: any, i: number) => {
  return Object.values(categories.value).map(c => c.color)[i]
}

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

  return Object.entries(categories.value).map((color) =>
      createGradientWithHex(color?.[0], color?.[1]?.color)
  ).join("");
});

const template = (d: any) => {
  const giveProducts = Object.entries(d).filter(a => typeof a[1] === 'number' && a[1] > 0)
  const products = []
  for (const gp of giveProducts) {
    const product = shop.value.products.find(p => p.id == gp[0])
    products.push(`<div class="flex items-center gap-2"><div style="background: ${product.color}" class="w-2 h-2 rounded-full"></div> ${product.name}: ${gp[1]} АР</div>`)
  }

  return `<div>
${d.date}<br>
${products.join("<br>")}
</div>`
}
</script>

<template>
  <ShCard v-model:loading="loading" class="col-span-1 2xl:col-span-3 h-64 w-full !py-0 overflow-hidden gap-0">
    <div class="h-8 flex flex-wrap justify-end items-center gap-x-3 mx-4 text-neutral-400 select-none">
      <div class="flex items-center gap-2" v-for="(category, key) in categories" :class="{
        'hidden': AreaChartData.reduce((acc, cur) => cur[key] ? cur[key] + acc : acc, 0) == 0
      }">
        <div :style="{background: category.color}" class="w-2 h-2 rounded-full"></div>
        <p class="text-xs pb-px text-nowrap">{{category.name}}</p>
      </div>
    </div>
    <div class="absolute mt-7 h-[224px] w-full">
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
    </div>
  </ShCard>
</template>

<style scoped>

</style>