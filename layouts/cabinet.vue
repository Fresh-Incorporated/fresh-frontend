<script setup lang="ts">
import { ref } from 'vue'
import type {TabsPaneContext} from "element-plus";
import InBeta from "~/components/global/InBeta.vue";

const route = useRoute()

const activeCategory = ref('main')

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

for (const key in links) {
  if (route.path.startsWith(links[key].to)) {
    activeCategory.value = key
  }
}

const handleCategory = async (tab: TabsPaneContext, event: Event) => {
  const link = links[toRaw(tab).paneName.value]
  await navigateTo(link.to)
}
</script>

<template>
<div class="flex flex-col min-h-screen">
  <Header />
  <div class="flex-1 px-1 md:px-16">
    <el-tabs v-model="activeCategory" @tab-click="handleCategory">
      <el-tab-pane v-for="(value, key) in links" :label="value.label" :name="key" :key="key">
        <template #label>
          <div class="w-56 text-center flex justify-center items-center">
            <div class="select-none w-full flex justify-center items-center">
              <p>{{value.label}}</p>
            </div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <slot></slot>
  </div>
  <Footer />
  <InBeta />
</div>
</template>

<style scoped>
.el-dropdown {
  color: inherit;
}
</style>