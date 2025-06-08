<script setup lang="ts">

</script>

<template>
  <div class="relative mt-16">
    <div class="bg-neutral-300/[0.75] dark:bg-neutral-950/[0.75] h-32 w-full absolute transform -top-32" style="clip-path: polygon(
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
          class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-size-[16px_16px] z-10"
      ></div>
    </div>
    <div class="bg-neutral-300/[0.75] dark:bg-neutral-950/[0.75] overflow-hidden relative">
      <div
          class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-size-[16px_16px] z-10"
      ></div>
      <div class="flex flex-col lg:flex-row w-full text-xl pb-4 px-2 md:px-16 space-y-4 md:space-y-0">
        <div class="flex-1 flex flex-col justify-end">
          <div>
            <p class="absolute font-rubik text-2xl blur-xs select-none text-black opacity-0 dark:opacity-50 dark:text-white">Fresh Inc.</p>
            <p class="font-rubik text-2xl text-nowrap text-black-600 dark:text-white">Fresh Inc.</p>
          </div>
          <div class="text-sm text-black dark:text-neutral-300">
            Мы - команда которая предлагает уникальные <br> решения для вашего игрового опыта!
          </div>
        </div>
        <div class="md:grid grid-cols-3 select-auto z-10 max-w-160 space-y-4">
          <div class="flex items-center md:items-end flex-col justify-end">
            <strong class="text-sm text-neutral-600 dark:text-neutral-400 pr-3">Документы</strong>
            <NuxtLink to="/info">
              <el-button text size="small" round>Правила использования</el-button>
            </NuxtLink>
            <NuxtLink to="/info">
              <el-button text size="small" round>Политика конфиденциальности</el-button>
            </NuxtLink>
          </div>
          <div class="flex items-center md:items-end flex-col justify-end">
            <strong class="text-sm text-neutral-600 dark:text-neutral-400 pr-3">Информация</strong>
            <NuxtLink to="/info">
              <el-button text size="small" round>О проекте</el-button>
            </NuxtLink>
            <NuxtLink to="/info">
              <el-button text size="small" round>Что такое FreshMarket?</el-button>
            </NuxtLink>
          </div>
          <div class="flex items-center md:items-end flex-col justify-end">
            <strong class="text-sm text-neutral-600 dark:text-neutral-400 pr-3">Связь</strong>
            <a href="https://discord.gg/eGUxF7uwyV" target="_blank">
              <el-button text size="small" round>Дискорд</el-button>
            </a>
            <a href="https://t.me/underzaral" target="_blank">
              <el-button text size="small" round>Телеграм</el-button>
            </a>
          </div>
        </div>
      </div>
      <div class="flex justify-center pb-2 text-neutral-300 text-sm md:text-base">
        <p>© 2025 zaralX Projects™. All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>