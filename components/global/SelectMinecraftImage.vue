<script setup lang="ts">
import axios from "axios";

const model = defineModel()

const categories = ref({})
const items = ref({})
const loading = ref(true)

onMounted(async () => {
  categories.value = (await axios.get("https://img.zaralx.ru/v1/minecraft/categories_list"))?.data
  items.value = (await axios.get("https://img.zaralx.ru/v1/minecraft/list"))?.data
  for (const category in categories.value) {
    categories.value[category].items = Object.keys(items.value)
        .filter(key => items.value[key].category_id == category)
        .reduce((result, key) => {
          result[key] = items.value[key];
          return result;
        }, {});
  }
  loading.value = false;
})
</script>

<template>
  <div class="w-full h-full rounded-lg" v-loading="loading">
    <div v-for="(category, category_id) in categories" :key="category_id" class="mt-2">
      <p class="text-neutral-300">{{category.name}}</p>
      <div class="h-px w-full bg-neutral-700 mb-2"></div>
      <div class="grid grid-cols-12 gap-2">
        <div v-for="(item, item_id) in category.items" :key="item_id">
          <div @click="model = item_id" class="cursor-pointer">
            <img :src="`https://img.zaralx.ru/v1/minecraft/${category?.folder}/${item_id}`" class="w-6 h-6" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>