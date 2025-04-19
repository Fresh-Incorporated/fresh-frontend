<script setup lang="ts"></script>

<template>
  <div
      class="w-full h-full relative flex border-b border-neutral-300 dark:border-b-neutral-800 bg-gradient-to-t from-primary-dark/[0.1] via-transparent">
    <div
        class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#aaaaaa1a_1px,transparent_1px),linear-gradient(to_bottom,#aaaaaa1a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:64px_64px]"
    ></div>
    <div class="relative hidden md:block">
      <div class="animation-opacity absolute w-4 h-4 top-32 left-64 text-blue-500">
        <div class="absolute -left-2 -top-2 w-4 h-4 flex justify-center items-center aspect-square">
          <i class="absolute pi pi-map-marker text-sm blur animate-[pulse_5s_infinite_ease-in-out] animation-delay-150"></i>
          <i class="pi pi-map-marker text-sm"></i>
        </div>
        <div
            class="animation-opacity absolute -left-2 top-[7.5rem] w-4 h-4 flex justify-center items-center aspect-square">
          <i class="pi pi-map text-sm absolute blur animate-[pulse_5s_infinite_ease-in-out] animation-delay-300"></i>
          <i class="pi pi-map text-sm"></i>
        </div>
        <div
            class="animation-opacity absolute top-4 w-px h-24 bg-gradient-to-b from-white/0 dark:via-white via-blue-500 to-white/0"></div>
        <div class="animation-opacity absolute left-4 h-px w-64 bg-gradient-to-r dark:from-white from-blue-500"></div>
        <div
            class="animation-opacity absolute left-4 top-32 h-px w-96 bg-gradient-to-r dark:from-white from-blue-500"></div>
        <div
            class="animation-opacity absolute -left-20 top-32 h-px w-16 bg-gradient-to-l dark:from-white from-blue-500"></div>
        <div class="animation-opacity absolute top-36 w-px h-16 bg-gradient-to-b dark:from-white from-blue-500"></div>
        <div class="animation-opacity absolute -top-20 w-px h-16 bg-gradient-to-t dark:from-white from-blue-500"></div>
        <div class="animation-opacity absolute -left-20 h-px w-16 bg-gradient-to-l dark:from-white from-blue-500"></div>
      </div>
    </div>
    <div class="min-h-64 md:min-h-96 flex items-center justify-center w-full md:justify-start md:pl-72">
      <div class="animation-opacity-r-l">
        <h1 class="text-primary-light dark:text-primary-dark text-4xl font-onest font-bold relative z-10">Fresh
          Inc.</h1>
        <!--        <div class="relative z-0">-->
        <!--          <div class="absolute w-24 h-2 bottom-0.5">-->
        <!--            <div class="absolute bg-primary-dark h-2 w-full blur animation-line-init"></div>-->
        <!--            <div class="bg-white h-2 w-full animation-line-init"></div>-->
        <!--          </div>-->
        <!--        </div>-->
        <p class="text-blue-800 dark:text-white opacity-80 md:text-nowrap">
          Инновационная идея в мире Minecraft!
        </p>
      </div>
    </div>
    <div class="w-full h-96 hidden lg:block">
      <!--      <ProjectOverview />-->
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