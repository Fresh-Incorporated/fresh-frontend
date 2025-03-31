<script setup lang="ts">
import {http} from "~/composables/useHttp";

definePageMeta({
  layout: 'freshmarketwork'
})

const generate = async (): Promise<void> => {
  await http.get("/freshmarket/work/director/salary/generate")
}

</script>

<template>
  <div class="w-full">
    <el-button @click="generate">Сгенерировать зарплатный отчёт</el-button>
  </div>
</template>

<style scoped>

</style>