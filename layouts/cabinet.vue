<script setup lang="ts">
import { ref } from 'vue'
import type {TabsPaneContext} from "element-plus";

const activeName = ref('main')

const changePage = async (tab: TabsPaneContext, event: Event) => {
  const link = links[toRaw(tab).paneName.value]
  await navigateTo(link.to)
}

const links = {
  "main": {
    label: "Общее",
    to: "/cabinet"
  },
  "fm_business": {
    label: "FreshMarket - Business",
    to: "/cabinet/freshmarket_business"
  }
}
</script>

<template>
<div class="flex flex-col min-h-screen">
  <Header />
  <div class="flex-1 px-16">
    <el-tabs v-model="activeName" @tab-click="changePage">
      <el-tab-pane v-for="(value, key) in links" :label="value.label" :name="key" :key="key">
        <slot />
      </el-tab-pane>
    </el-tabs>
  </div>
  <Footer />
</div>
</template>

<style scoped>

</style>