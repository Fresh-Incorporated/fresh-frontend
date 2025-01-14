<script setup lang="ts">

</script>

<template>
<div class="relative mt-12">
  <div class="bg-neutral-950/[0.75] h-32 w-full absolute transform -top-32" style="clip-path: polygon(
                0% 60%,
                15% 65%,
                34% 66%,
                51% 62%,
                67% 50%,
                84% 45%,
                100% 46%,
                100% 100%,
                0% 100%
        );">
    <div
        class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:16px_16px] z-10"
    ></div>
  </div>
  <div class="bg-neutral-950/[0.75] overflow-hidden relative">
    <div
        class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:16px_16px] z-10"
    ></div>
    <div class="flex w-full text-xl pb-4 px-16">
      <div class="flex-1">
        <div>
          <p class="absolute font-rubik text-2xl blur-sm opacity-50 select-none">Fresh Inc.</p>
          <p class="font-rubik text-2xl text-nowrap">Fresh Inc.</p>
        </div>
        <div class="text-sm text-neutral-300">
          Мы - команда которая предлагает уникальные <br> решения для вашего игрового опыта!
        </div>
      </div>
      <div class="grid grid-cols-3 select-auto z-10 max-w-[40rem]">
        <div class="flex flex-col items-end justify-end">
          <strong class="text-sm text-neutral-400 pr-3">Документы</strong>
          <el-button text size="small" round>Правила использования</el-button>
          <el-button text size="small" round>Политика конфиденциальности</el-button>
        </div>
        <div class="flex flex-col items-end justify-end">
          <strong class="text-sm text-neutral-400 pr-3">Информация</strong>
          <el-button text size="small" round>О проекте</el-button>
          <el-button text size="small" round>Что такое FreshMarket?</el-button>
        </div>
        <div class="flex flex-col items-end justify-end">
          <strong class="text-sm text-neutral-400 pr-3">Связь</strong>
          <el-button text size="small" round>Дискорд</el-button>
          <el-button text size="small" round>Телеграм</el-button>
        </div>
      </div>
    </div>
    <div class="flex justify-center pb-2 text-neutral-300">
      <p>© 2025 zaralX Projects™. All Rights Reserved.</p>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>