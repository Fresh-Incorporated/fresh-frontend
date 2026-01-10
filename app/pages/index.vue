<script setup lang="ts">

import IndexHead from "~/components/index/IndexHead.vue";
</script>

<template>
<div>
  <IndexHead />
  <div class="my-6 md:my-16 flex flex-col justify-center items-center gap-8 md:gap-16">
    <div class="w-full px-2 md:grid grid-cols-2 gap-4 lg:px-64 md:h-96">
      <div class="w-full flex flex-col justify-center">
        <NuxtLink to="/public" class="text-3xl font-rubik font-semibold hover:underline">О нас</NuxtLink>
        <p class="font-light text-base">Fresh Inc. — это инновационный IT-проект, созданный для воплощения самых амбициозных идей и предоставления уникальных решений для пользователей сервера СПм.
          <br> Наша миссия — объединить технологии, креативность и практичность, чтобы создавать удобные, современные и полезные инструменты для всех участников экосистемы.</p>
      </div>
      <div class="w-full hidden md:flex justify-center items-center">
        <img class="w-96" src="/index1.png" alt="">
      </div>
    </div>
    <div class="w-full px-2 md:grid grid-cols-2 gap-4 lg:px-64 md:h-96">
      <div class="w-full hidden md:flex justify-center items-center">
        <img class="w-96" src="/index2.png" alt="">
      </div>
      <div class="w-full flex flex-col justify-center">
        <NuxtLink to="/freshmarket" class="text-3xl font-rubik font-semibold text-right hover:underline">FreshMarket</NuxtLink>
        <p class="font-light text-base text-right">FreshMarket — место, где пользователи могут покупать, продавать товары, создавая активную и динамичную экономику.</p>
        <p class="font-light text-base text-right">Начните покупать СЕЙЧАС или станьте новым продавцом!</p>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>