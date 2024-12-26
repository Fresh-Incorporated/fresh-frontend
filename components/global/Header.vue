<script setup lang="ts">

</script>

<template>
  <el-affix>
    <div class="h-14 w-full bg-black/[.2] backdrop-blur border-b-[1px] border-neutral-800 shadow-lg p-1">
      <div
          class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:16px_16px] -z-10"
      ></div>
      <div class="flex h-full">
        <div class="flex items-center h-full gap-1 w-60">
          <img class="h-8" src="/logo.svg" alt="">
          <p class="font-rubik text-xl">FreshMarket</p>
        </div>
        <div class="w-full flex justify-center items-center">
          <ElButton text round bg>
            Главная
          </ElButton>
          <ElButton text round>
            Другое
          </ElButton>
          <ElButton text round>
            Другое
          </ElButton>
          <ElButton text round>
            Другое
          </ElButton>
        </div>
        <div class="flex h-full w-60 justify-center items-center">
          <ElButton>
            <div class="flex gap-1">
              <i class="pi pi-user"></i>
              Войти
            </div>
          </ElButton>
        </div>
      </div>
    </div>
  </el-affix>
  123
  <div class="h-[200vh]"></div>
</template>

<style scoped>

</style>