<script setup lang="ts">
import CreateProductMenu from "~/components/cabinet/freshmarket/CreateProductMenu.vue";

const props = defineProps({
  shop: Number,
})

const opened = ref(false);
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 flex justify-center items-center">
    <CreateProductMenu :shop="shop" v-model="opened" />
    <el-button @click="opened = true" plain type="success">
      Создать товар
    </el-button>
  </div>
</template>

<style scoped>

</style>