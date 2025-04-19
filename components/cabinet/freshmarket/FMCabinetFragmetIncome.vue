<script setup>
import FMSellsChart from "~/components/cabinet/freshmarket/FMSellsChart.vue";
import {http} from "~/composables/useHttp";
import { format, subDays, isSameDay, parseISO } from 'date-fns';

const props = defineProps({
  shop: Number,
})

const {shops, updateUser, updateShops} = useUser()

const shop = ref()
const lastSells = ref([])
const sevenDaysSells = ref([])
const loadedSellsData = ref(false)

const loadMenu = async () => {
  loadedSellsData.value = false;

  shop.value = shops.value?.find(i => i?.id === props?.shop);
  lastSells.value = (await http.get("/freshmarket/shop/"+props.shop+"/sells")).data;

  const today = new Date();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      total: 0
    };
  }).reverse();

  lastSells.value.forEach(sell => {
    const sellDate = parseISO(sell.createdAt);
    const matchedDay = last7Days.find(day => isSameDay(sellDate, new Date(day.date)));
    if (matchedDay) {
      matchedDay.total += sell.data.price * sell.data.count;
    }
  });

  sevenDaysSells.value = last7Days;
  loadedSellsData.value = true;
}

onMounted(async () => {
  await loadMenu();
})

watch(() => props.shop, async () => {
  await loadMenu();
})

const withdraw = async () => {
  await http.post("/freshmarket/shop/"+props.shop+"/withdraw")
  await updateUser()
  await updateShops()
}
</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg border bg-neutral-50 dark:border-neutral-800 h-64  col-span-2 overflow-hidden relative">
    <div class="flex">
      <div class="p-2">
        <p class="text-xl">Продажи</p>
        <p class="text-sm opacity-50">за неделю</p>
      </div>
      <div class="p-2 flex flex-col items-end ml-auto mr-0">
        <el-button type="primary" plain size="small" @click="withdraw">
          Вывести средства
        </el-button>
        <div class="flex items-center gap-1">
          <p class="text-sm text-nowrap text-sky-400 font-medium">Баланс магазина: {{ shop?.balance.toFixed(2) }}</p>
          <img class="w-4 h-4" src="https://img.zaralx.ru/v1/minecraft/deepslate_diamond_ore" alt="">
        </div>
      </div>
    </div>
    <div class="absolute w-full h-[85%] -bottom-2">
      <FMSellsChart :sells="sevenDaysSells" v-if="loadedSellsData"/>
    </div>
<!--    <input-->
<!--        type="file"-->
<!--        @change="handleFileChange"-->
<!--        accept="image/*"-->
<!--        class="w-full"-->
<!--    />-->
<!--    <el-input-->
<!--        v-model="name"-->
<!--        minlength="3"-->
<!--        maxlength="16"-->
<!--        placeholder="Название магазина"-->
<!--        show-word-limit-->
<!--        type="text"-->
<!--    />-->
<!--    <el-input-->
<!--        v-model="description"-->
<!--        maxlength="240"-->
<!--        placeholder="Описание магазина"-->
<!--        show-word-limit-->
<!--        :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"-->
<!--        :parser="(value) => value.replace(/[\r\n]+/g, '')"-->
<!--        type="textarea"-->
<!--    />-->

<!--    лимит товаров, тег магазина (например магазин "Шаурмечная" shaurma377 для ссылки /freshmarket/shop/shaurma377)-->
  </div>
</template>

<style scoped>

</style>