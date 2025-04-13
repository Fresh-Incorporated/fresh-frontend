<script setup lang="ts">
import {http} from "~/composables/useHttp";

definePageMeta({
  layout: 'freshmarketwork'
})

const route = ref()
const result = ref()

const send = async () => {
  result.value = (await http.get(route.value)).data
}
</script>

<template>
  <div class="w-full">
    <el-input v-model="route" placeholder="путь /" />
    <el-button @click="send">Запросить данные</el-button>
    {{result}}
  </div>
</template>

<style scoped>

</style>