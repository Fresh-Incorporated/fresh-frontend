<script setup lang="ts">
import FMCabinetFragmentSells from "~/components/cabinet/freshmarket/FMCabinetFragmentSells.vue";

definePageMeta({
  layout: 'cabinet'
})

const selectedShop = ref("v1")

const shops = [{
  key: 1,
  label: "l1",
  value: "v1"
}, {
  key: 2,
  label: "l2",
  value: "v2"
}]
</script>

<template>
  <div class="hidden">
    <div class="flex items-center gap-2 mb-4">
      <p>Выбран магазин:</p>
      <el-select
          v-model="selectedShop"
          placeholder="Выберите магазин"
          style="width: 200px"
      >
        <el-option
            v-for="item in shops"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      <FMCabinetFragmentSells/>
      <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

      </div>
      <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

      </div>
    </div>
  </div>
  <div class="flex flex-col items-center justify-center">
    <p class="text-xl">У вас нет ни единого магазина</p>
    <el-button type="success" plain>
      <p><i class="pi pi-plus text-xs"></i>  Создать</p>
    </el-button>
  </div>
</template>

<style scoped>

</style>