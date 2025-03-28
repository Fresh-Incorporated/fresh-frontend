<script setup lang="ts">
const scroll = ():void => {
  window.scrollTo(0, 400)
}
</script>

<template>
  <div class="w-full h-full relative border-b border-b-neutral-800 bg-gradient-to-t from-primary-dark/[0.1] via-transparent">
    <div
        class="z-0 absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#aaaaaa1a_1px,transparent_1px),linear-gradient(to_bottom,#aaaaaa1a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:64px_64px]"
    ></div>
    <div class="h-full hidden lg:block">
      <div class="absolute w-full h-full grid grid-cols-2 px-8 py-16 gap-8">
<!--        <div class="relative p-1 shadow-lg max-w-96 transform rotate-y-12 rotate-x-12 min-w-96 hover:rotate-y-0 duration-500 group">-->
<!--          <div class="absolute bg-primary-dark rounded-xl w-full h-full blur-lg opacity-50 group-hover:rotate-y-0 group-hover:rotate-x-0 duration-500">-->

<!--          </div>-->
<!--          <div class="bg-neutral-800 border border-primary-dark rounded-xl w-full h-full transform rotate-x-12s rotate-y-12 shadow-2xl overflow-hidden">-->
<!--            <div class="absolute bg-primary-dark w-32 h-32 blur-2xl opacity-50 rounded-full -translate-x-16 -translate-y-16">-->

<!--            </div>-->
<!--            <div class="absolute bg-primary-dark bottom-0 right-0 w-32 h-32 blur-2xl opacity-50 rounded-full translate-x-16 translate-y-16">-->

<!--            </div>-->
<!--            <div class="flex w-full h-full flex-col justify-center items-center font-fira gap-4">-->
<!--              <div class="flex items-center gap-2">-->
<!--                <div class="w-16 h-16 flex justify-center items-center bg-neutral-900 rounded-lg">-->
<!--                  <i class="pi pi-user text-4xl"></i>-->
<!--                </div>-->
<!--                <div class="h-16 flex flex-col py-1">-->
<!--                  <h1 class="text-2xl flex-1">Регистраций</h1>-->
<!--                  <p class="text-sm">-->
<!--                    <span class="font-medium text-primary-dark absolute blur-sm opacity-50">14888</span>-->
<!--                    <span class="font-medium text-primary-dark">14888</span> Пользователей</p>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="flex items-center gap-2">-->
<!--                <div class="w-16 h-16 flex justify-center items-center bg-neutral-900 rounded-lg">-->
<!--                  <i class="pi pi-user text-4xl"></i>-->
<!--                </div>-->
<!--                <div class="h-16 flex flex-col py-1">-->
<!--                  <h1 class="text-2xl flex-1">Регистраций</h1>-->
<!--                  <p class="text-sm">-->
<!--                    <span class="font-medium text-primary-dark absolute blur-sm opacity-50">14888</span>-->
<!--                    <span class="font-medium text-primary-dark">14888</span> Пользователей</p>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="relative p-1 rounded-xl shadow-lg max-w-96 transform rotate-y-12 -rotate-x-12 hover:rotate-y-0 duration-500 group ml-auto mr-0 min-w-96">-->
<!--          <div class="absolute bg-primary-dark rounded-xl w-full h-full blur-lg opacity-50 transform rotate-y-12 -rotate-x-12 group-hover:rotate-y-0 group-hover:rotate-x-0 duration-500">-->

<!--          </div>-->
<!--          <div class="bg-neutral-800 border border-primary-dark rounded-xl w-full h-full transform rotate-x-0 rotate-y-12 shadow-2xl overflow-hidden">-->
<!--            <div class="absolute bg-primary-dark w-32 h-32 blur-2xl opacity-50 rounded-full -translate-x-16 -translate-y-16">-->

<!--            </div>-->
<!--            <div class="absolute bg-primary-dark bottom-0 right-0 w-32 h-32 blur-2xl opacity-50 rounded-full translate-x-16 translate-y-16">-->

<!--            </div>-->
<!--            <div class="relative flex w-full h-full font-fira gap-4">-->
<!--              <div class="absolute blur-lg bottom-0 left-0 transform -translate-x-20">-->
<!--                <img class="h-48" src="/zaralx_3d.png" alt="">-->
<!--              </div>-->
<!--              <div class="absolute bottom-0 left-0 transform -translate-x-20">-->
<!--                <img class="h-48" src="/zaralx_3d.png" alt="">-->
<!--              </div>-->
<!--              <div class="blur-sm absolute right-0 transform p-4 text-3xl font-onest font-bold text-transparent text-stroke text-stroke-green-500">-->
<!--                ЛУЧШИЙ ПРОДАВЕЦ-->
<!--              </div>-->
<!--              <div class="absolute right-0 transform p-4 text-3xl font-onest font-bold text-transparent text-stroke text-stroke-green-500">-->
<!--                ЛУЧШИЙ ПРОДАВЕЦ-->
<!--              </div>-->
<!--              <div class="flex flex-col items-end justify-end w-full gap-2 px-8 py-4">-->
<!--                <div class="flex flex-col justify-center">-->
<!--                  <p class="text-sm font-onest text-right opacity-75">НИКНЕЙМ</p>-->
<!--                  <p class="text-xl font-medium text-right">_zaralX_</p>-->
<!--                </div>-->
<!--                <div class="flex flex-col justify-center">-->
<!--                  <p class="text-sm font-onest text-right opacity-75">ПРОДАНО</p>-->
<!--                  <p class="text-xl font-medium text-right">9999 Товаров</p>-->
<!--                </div>-->
<!--                <div class="flex flex-col justify-center">-->
<!--                  <p class="text-sm font-onest text-right opacity-75">ПЕРИОД</p>-->
<!--                  <p class="text-xl font-medium text-right">Декабрь</p>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="min-h-64 md:min-h-96 flex justify-center items-center text-center">
      <div class="animation-opacity-r-l">
        <h1 class="text-primary-light dark:text-primary-dark text-4xl md:text-6xl font-onest font-bold relative z-10">FreshMarket</h1>
        <p class="text-black dark:text-white opacity-80 md:text-nowrap text-xs md:text-base">
          Первый в мире майнкрафт маркетплейс
        </p>

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
              <i class="absolute pi pi-chevron-down animate-bounce mt-9 text-xs group-hover:text-base duration-1000 group-hover:text-white"></i>
              <i class="absolute pi pi-chevron-down animate-bounce mt-10 group-hover:text-xl duration-1000 group-hover:text-white"></i>
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