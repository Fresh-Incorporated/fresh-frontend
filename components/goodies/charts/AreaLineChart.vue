<script setup lang="ts">
import {
  VisArea,
  VisCrosshair,
  VisLine,
  VisTooltip,
  VisXYContainer,
} from '@unovis/vue'

export interface AreaChartItem {
  date: string
  [key: string]: any
}

export interface CategoryItem {
  name: string | number
  color?: string
}

const props = defineProps({
  categoriesSwitch: Boolean,
  showCategories: {
    type: Boolean,
    default: true
  },
  hideCategoriesWithZero: Boolean
})

// Модель данных и категории
const AreaChartData = defineModel<AreaChartItem[]>()
const categories = defineModel<Record<string, CategoryItem>>('categories')
const enabledCategories = ref<string[]>([])
const useCategories = ref<string[]>([])

onMounted(() => {
  enabledCategories.value = [...Object.keys(categories.value)]
  useCategories.value = categories.value
})

watch(categories, (newValue) => {
  enabledCategories.value = [...Object.keys(newValue)]
  useCategories.value = newValue
})

// x и y-функции
const x = (d: AreaChartItem): Date => new Date(d.date)
const y = (d: AreaChartItem, key: string): number => d[key]

// SVG градиенты
const svgDefs = computed((): string => {
  return Object.entries(categories.value)
      .map(([key, { color }]) =>
          color
              ? `<linearGradient id="gradient${key}-${color}" gradientTransform="rotate(90)">
             <stop offset="0%" stop-color="${color}" stop-opacity="1" />
             <stop offset="100%" stop-color="${color}" stop-opacity="0" />
           </linearGradient>`
              : '',
      )
      .join('')
})

// Tooltip шаблон
const template = (d: AreaChartItem): string => {
  const rows = Object.entries(categories.value).map(
      ([key, { color, name }]) => `
      <div class="flex items-center gap-2">
        <div style="background: ${color}" class="w-2 h-2 rounded-full"></div>
        ${name}: ${d[key]}
      </div>`,
  )

  return `<div>${formatDateAbsolute(d.date)}<br>${rows.join('')}</div>`
}

// Цвет для Crosshair
const color = (_: unknown, i: number): string => {
  const keys = Object.keys(categories.value)
  const key = keys[Math.floor(i / 2)]
  return categories.value[key]?.color || '#000'
}

const toggleCategory = (key: string) => {
  if (enabledCategories.value.includes(key)) {
    enabledCategories.value = enabledCategories.value.filter(c => c != key)
  } else {
    enabledCategories.value.push(key)
  }

  const newCategories = {}

  for (const category of Object.keys(categories.value)) {
    if (!enabledCategories.value.includes(category)) continue
    newCategories[category] = categories.value[category]
  }

  useCategories.value = newCategories
}
</script>

<template>
  <div>
    <div v-if="showCategories" class="h-8 flex flex-wrap justify-end items-center gap-x-3 mx-4 text-neutral-400 select-none">
      <div @click="toggleCategory(key)" v-for="(category, key) in categories" class="flex items-center gap-2" :class="{
        'hidden': hideCategoriesWithZero && AreaChartData.reduce((acc, cur) => cur[key] ? cur[key] + acc : acc, 0) == 0,
        'cursor-pointer': categoriesSwitch,
        'opacity-50': !enabledCategories.includes(key)
      }">
        <div :style="{background: category.color}" class="w-2 h-2 rounded-full"></div>
        <p class="text-xs pb-px text-nowrap">{{category.name}}</p>
      </div>
    </div>
    <VisXYContainer :svg-defs="svgDefs" class="h-[150px]" :data="AreaChartData">
      <VisTooltip />
      <template v-for="(cat, key) in useCategories" :key="key">
        <VisLine :x="x" :y="(d) => y(d, key)" :color="cat.color" />
        <VisArea
            :x="x"
            :y="(d) => y(d, key)"
            :color="`url(#gradient${key}-${cat.color})`"
            :opacity="0.5"
        />
      </template>
      <VisCrosshair :color="color" :template="template" />
    </VisXYContainer>
  </div>
</template>

<style scoped>
</style>
