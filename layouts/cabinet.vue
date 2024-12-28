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
    to: "/cabinet",
    pages: {
      "home": {
        label: "Дом",
        icon: "pi pi-home",
        to: "/cabinet"
      },
      "other": {
        label: "Другое",
        icon: "pi pi-bars",
        to: "/cabinet/other"
      }
    }
  },
  "fm_business": {
    label: "FreshMarket - Business",
    to: "/cabinet/freshmarket_business"
  }
}

const handleOpen = async (key: string, keyPath: string[]) => {
  const link = links[activeName.value].pages[key]
  await navigateTo(link.to)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
<div class="flex flex-col min-h-screen">
  <Header />
  <div class="flex-1 px-16">
    <el-tabs v-model="activeName" @tab-click="changePage">
      <el-tab-pane v-for="(value, key) in links" :label="value.label" :name="key" :key="key">
        <div class="flex">
          <el-menu
              :default-active="Object.keys(value.pages ?? {})[0]"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
          >
            <el-menu-item v-for="(page_value, page_key) in value.pages" :index="page_key" class="flex gap-2 items-center min-w-32">
              <i :class="page_value.icon"></i>
              <p class="my-3">{{page_value.label}}</p>
            </el-menu-item>
          </el-menu>
          <div class="m-2">
            <slot />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <Footer />
</div>
</template>

<style>
.el-tabs__header {
  margin: 0;
}
</style>