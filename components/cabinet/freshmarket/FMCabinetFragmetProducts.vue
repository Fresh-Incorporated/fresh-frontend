<script setup lang="ts">
const {shops} = useUser()

const props = defineProps({
  shop: Number,
})
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-2">
    <el-table :data="shops.find(_shop => _shop.id === shop)?.products" style="width: 100%; height: 100%;" class="rounded-xl">
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