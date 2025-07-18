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

onMounted(async () => {
  const response = await http.get(`/freshmarket/shop/${props.shopId}/sells/total`)
  data.value = response.data
  donutData.value = Object.keys(response.data.sells).map(s => {
    return {
      id: s,
      count: response.data.sells[s]
    }
  })
  console.log(donutData.value)
})
</script>

<template>
  <ShCard class="flex flex-row justify-center items-center h-64 px-3">
    <div class="aspect-square h-56 w-56">
      <VisSingleContainer :data="donutData" class="aspect-square h-56 w-56">
        <VisDonut
            :value="value"
            :radius="110"
            :arcWidth="20"
            centralLabel="Продажи"
            centralSubLabel="Продажи всех товаров магазина за всё время"
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