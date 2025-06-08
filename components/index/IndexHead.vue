<script setup lang="ts">
import { http } from "~/composables/useHttp"

const stats = ref({
  online: 0,
  users: 0
})

const animatedStats = ref({
  online: 0,
  users: 0
})

function animateValue(key: 'online' | 'users', end: number, duration = 2000) {
  const start = 0
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    animatedStats.value[key] = Math.floor(start + (end - start) * progress)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

onMounted(async () => {
  const res = await http.get("/stats")
  stats.value = res.data

  animateValue("online", stats.value.online)
  animateValue("users", stats.value.users)
})
</script>

<template>
  <div
      class="w-full h-full relative flex border-b border-neutral-300 dark:border-b-neutral-800 bg-linear-to-t from-primary-dark/[0.1] via-transparent">
    <div
        class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#aaaaaa1a_1px,transparent_1px),linear-gradient(to_bottom,#aaaaaa1a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-size-[64px_64px]"
    ></div>
    <div class="relative hidden lg:block">
      <div class="animation-opacity absolute w-4 h-4 top-32 left-64 text-blue-500">
        <div class="absolute -left-2 -top-2 w-4 h-4 flex justify-center items-center aspect-square">
          <i class="absolute pi pi-map-marker text-sm blur-sm animate-[pulse_5s_infinite_ease-in-out] animation-delay-150"></i>
          <i class="pi pi-map-marker text-sm"></i>
        </div>
        <div
            class="animation-opacity absolute -left-2 top-30 w-4 h-4 flex justify-center items-center aspect-square">
          <i class="pi pi-map text-sm absolute blur-sm animate-[pulse_5s_infinite_ease-in-out] animation-delay-300"></i>
          <i class="pi pi-map text-sm"></i>
        </div>
        <div
            class="animation-opacity absolute top-4 w-px h-24 bg-linear-to-b from-white/0 dark:via-white via-blue-500 to-white/0"></div>
        <div class="animation-opacity absolute left-4 h-px w-64 bg-linear-to-r dark:from-white from-blue-500"></div>
        <div
            class="animation-opacity absolute left-4 top-32 h-px w-96 bg-linear-to-r dark:from-white from-blue-500"></div>
        <div
            class="animation-opacity absolute -left-20 top-32 h-px w-16 bg-linear-to-l dark:from-white from-blue-500"></div>
        <div class="animation-opacity absolute top-36 w-px h-16 bg-linear-to-b dark:from-white from-blue-500"></div>
        <div class="animation-opacity absolute -top-20 w-px h-16 bg-linear-to-t dark:from-white from-blue-500"></div>
        <div class="animation-opacity absolute -left-20 h-px w-16 bg-linear-to-l dark:from-white from-blue-500"></div>
      </div>
    </div>
    <div class="min-h-64 md:min-h-96 flex items-center justify-center w-full lg:justify-start lg:pl-72">
      <div class="animation-opacity-r-l">
        <h1 class="text-primary-light dark:text-primary-dark text-4xl font-onest font-bold relative z-10 text-center lg:text-left">Fresh
          Inc.</h1>
        <!--        <div class="relative z-0">-->
        <!--          <div class="absolute w-24 h-2 bottom-0.5">-->
        <!--            <div class="absolute bg-primary-dark h-2 w-full blur-sm animation-line-init"></div>-->
        <!--            <div class="bg-white h-2 w-full animation-line-init"></div>-->
        <!--          </div>-->
        <!--        </div>-->
        <p class="text-blue-800 dark:text-white opacity-80 md:text-nowrap">
          Инновационная идея в мире Minecraft!
        </p>
        <div class="grid grid-cols-2 text-center mt-2 text-neutral-400 lg:hidden">
          <div>
            <p class="text-sm">Регистраций</p>
            <p class="text-blue-500 font-bold text-xl">{{ animatedStats.users }}</p>
          </div>
          <div>
            <p class="text-sm">Онлайн</p>
            <p class="text-blue-500 font-bold text-xl">{{ animatedStats.online }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-96 hidden lg:flex flex-col items-center justify-center">
      <div class="text-lg">
        <p class="text-center text-neutral-300 text-sm font-medium">Статистика</p>
        <div>
          <p><span class="text-blue-500 font-bold text-xl">{{ animatedStats.users }}</span> Регистраций</p>
        </div>
        <div>
          <p><span class="text-blue-500 font-bold text-xl">{{ animatedStats.online }}</span> Онлайн</p>
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
    transform: translateX(32px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>