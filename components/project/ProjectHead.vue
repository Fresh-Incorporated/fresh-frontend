<script setup lang="ts">
import {http} from "~/composables/useHttp"
import AnimatedNumbers from "~/components/goodies/AnimatedNumbers.vue";

const scroll = ():void => {
  window.scrollTo(0, 400)
}

const stats = ref({
  totalOrders: 0,
  last24hOrders: 0,
  lastProducts: []
})
const loadingStats = ref(true)
onMounted(async () => {
  stats.value = (await http.get("/freshmarket/stats")).data
  stats.value.lastProducts = stats.value.lastProducts.slice(0, 8)
  loadingStats.value = false
})
</script>

<template>
  <div class="w-full h-full relative border-b border-b-neutral-200 dark:border-b-neutral-800 bg-linear-to-t from-primary-dark/[0.1] via-transparent">
    <div
        class="z-0 absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#aaaaaa1a_1px,transparent_1px),linear-gradient(to_bottom,#aaaaaa1a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-size-[64px_64px]"
    ></div>
    <div class="h-full hidden lg:block">
      <div class="absolute w-full grid grid-cols-8 grid-rows-1 bottom-0 px-1 py-1 gap-2 overflow-hidden">
        <ShCard v-for="product in stats.lastProducts" class="flex-row gap-1 !p-0 rounded-sm">
          <div class="w-8 h-8 aspect-square">
            <img :src="product.icon" class="w-8 h-8 aspect-square" alt="">
          </div>
          <div class="w-full truncate relative py-0.5">
            <p class="truncate text-xs">{{product.name}}</p>
            <p class="truncate text-[0.5rem] opacity-75 w-[calc(100%-32px)]">{{product.description.length == 0 ? "Описание отсутствует" : product.description}}</p>
            <p class="text-[0.6rem] truncate absolute right-1 bottom-0.5 text-neutral-400">{{product.count}} шт.</p>
          </div>
        </ShCard>
      </div>
    </div>
    <div class="min-h-64 md:min-h-96 flex justify-center items-center text-center">
      <div class="animation-opacity-r-l">
        <h1 class="text-primary-light dark:text-primary-dark text-4xl md:text-6xl font-onest font-bold relative z-10">FreshMarket</h1>
        <p class="text-black dark:text-white opacity-80 md:text-nowrap text-xs md:text-base">
          Первый в мире майнкрафт маркетплейс
        </p>

        <div class="relative">
          <Skeleton v-model="loadingStats" class="absolute top-0 left-0 z-10 h-4 w-full" />
          <p class="text-black dark:text-white opacity-90 md:text-nowrap text-[0.7rem] md:text-xs mt-1">
            Всего заказов: <AnimatedNumbers v-model="stats.totalOrders" /> | Заказов за сутки: <AnimatedNumbers v-model="stats.last24hOrders" />
          </p>
        </div>

        <div class="relative flex justify-center">
          <div @click="scroll" class="cursor-pointer select-none relative mt-4 border border-primary-dark rounded-lg flex justify-center text-primary-dark font-bold group">
            <div class="absolute w-full h-full">
              <div class="absolute w-full h-0 group-hover:h-full flex justify-center items-center overflow-hidden duration-1000">
                <p class="text-white text-nowrap overflow-hidden text-sm md:text-base">Начать покупки</p>
              </div>
              <div class="w-0 group-hover:w-full duration-1000 h-full bg-primary-dark rounded-md flex justify-center text-white overflow-clip">
              </div>
            </div>
            <div class="py-1 px-8 flex justify-center">
              <p class="text-sm md:text-base">Начать покупки</p>
              <Icon name="lucide:chevron-down" size="20" class="absolute animate-bounce mt-9 group-hover:text-base duration-1000 group-hover:text-white" />
              <Icon name="lucide:chevron-down" size="24" class="absolute animate-bounce mt-10 group-hover:text-xl duration-1000 group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.animation-line-init {
  animation: line-init ease-in-out 1s;
}

.animation-opacity {
  animation: opacity ease-in-out 1s;
}

.animation-opacity-r-l {
  animation: opacity-r-l ease-out 1s;
}

@keyframes line-init {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes opacity-r-l {
  0% {
    transform: translateY(32px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>