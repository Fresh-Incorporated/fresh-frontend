<script setup lang="ts">
const {user} = useUser()
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-sky-900 h-64 relative overflow-hidden">
    <div class="absolute w-12 h-12 bg-sky-900 blur-2xl"></div>
    <div class="absolute w-40 h-40 bottom-0 right-0 translate-x-10 translate-y-10 rotate-8">
      <img class="w-full h-full opacity-50" src="https://img.zaralx.ru/v1/minecraft/deepslate_diamond_ore" alt="">
    </div>
    <div class="absolute w-12 h-12 bg-sky-900 blur-2xl bottom-0 right-0"></div>
    <div class="flex flex-col justify-center items-center w-full h-full font-medium absolute z-10">
      <div>
        <p class="text-lg">Ваш баланс</p>
      </div>
      <div>
        <p class="absolute text-sky-500 font-rubik text-2xl blur-sm opacity-50">{{user.balance}} АР</p>
        <p class="text-sky-500 font-rubik text-2xl">{{user.balance}} АР</p>
      </div>
      <div class="relative w-full mt-2">
        <div class="absolute w-full flex justify-center gap-2">
          <button class="border w-6 h-6 flex justify-center items-center text-xs rounded-md shadow-lg border-green-600 text-green-600 hover:text-white hover:bg-green-600 duration-200"><i class="pi pi-arrow-up"></i></button>
          <button class="border w-6 h-6 flex justify-center items-center text-xs rounded-md shadow-lg border-red-600 text-red-600 hover:text-white hover:bg-red-600 duration-200"><i class="pi pi-arrow-down"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>