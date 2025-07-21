<script setup lang="ts">
import {http} from "~/composables/useHttp"
import {VisSingleContainer, VisDonut, VisTooltip} from '@unovis/vue'
import {Donut} from "@unovis/ts";

const props = defineProps({
  shopId: Number
})

interface DataModel {
  id: number,
  count: number
}

const data = ref({})
const donutData = ref<DataModel[]>([])
const value = (d: DataModel) => d.count
const triggers = {
  [Donut.selectors.segment]: (d: DataModel) =>  `
      <span>${data.value.products[d.data.id]?.name}: ${d.data.count} шт.</span>
    `
}

const hasData = computed(() => {
  return data.value.sells && Object.keys(data.value?.sells)?.length > 0
})

onMounted(async () => {
  const response = await http.get(`/freshmarket/shop/${props.shopId}/sells/total`)
  data.value = response.data
  donutData.value = Object.keys(response.data.sells).map(s => {
    return {
      id: s,
      color: response.data.products[s].color,
      count: response.data.sells[s]
    }
  })
})

const color = (d: number, i: number) => d.color
</script>

<template>
  <ShCard class="flex flex-row justify-center items-center h-64 px-3">
    <div class="aspect-square h-56 w-56">
      <div v-if="!hasData" class="w-full h-full flex justify-center items-center">
        Нет данных
      </div>
      <VisSingleContainer v-else :data="donutData" class="aspect-square h-56 w-56">
        <VisDonut
            :value="value"
            :radius="110"
            :arcWidth="20"
            centralLabel="Продажи"
            centralSubLabel="Продажи всех товаров магазина за всё время"
            :color="color"
        />
        <VisTooltip :triggers="triggers" />
      </VisSingleContainer>
    </div>
<!--    <div class="flex-1">-->
<!--    </div>-->
  </ShCard>
</template>

<style scoped>

</style>