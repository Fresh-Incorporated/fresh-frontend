<script setup lang="ts">
const products = [{
  icon: "https://s3.zaralx.ru/test/fresh/market/shop_icon/ee23edc8-50c5-4375-9ad7-b913b661f8e0-1735853477716",
  name: "Name",
  description: "Description"
},{
  icon: "https://s3.zaralx.ru/test/fresh/market/shop_icon/ee23edc8-50c5-4375-9ad7-b913b661f8e0-1735853477716",
  name: "Name",
  description: "Description"
},{
  icon: "https://s3.zaralx.ru/test/fresh/market/shop_icon/ee23edc8-50c5-4375-9ad7-b913b661f8e0-1735853477716",
  name: "Name",
  description: "Description"
},{
  icon: "https://s3.zaralx.ru/test/fresh/market/shop_icon/ee23edc8-50c5-4375-9ad7-b913b661f8e0-1735853477716",
  name: "Name",
  description: "Description"
},{
  icon: "https://s3.zaralx.ru/test/fresh/market/shop_icon/ee23edc8-50c5-4375-9ad7-b913b661f8e0-1735853477716",
  name: "Name",
  description: "Description"
},{
  icon: "https://s3.zaralx.ru/test/fresh/market/shop_icon/ee23edc8-50c5-4375-9ad7-b913b661f8e0-1735853477716",
  name: "Name",
  description: "Description"
}]
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-2">
    <el-table :data="products" style="width: 100%; height: 100%;" class="rounded-xl">
      <el-table-column prop="icon" label="Иконка" width="80">
        <template #default="scope">
          <div class="flex justify-center">
            <img :src="scope.row.icon" class="w-10 aspect-square" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Название" width="180" />
      <el-table-column prop="description" label="Описание" />
    </el-table>
  </div>
</template>

<style scoped>

</style>