<script setup lang="ts">
const {shops} = useUser()

const props = defineProps({
  shop: Number,
})

const tableRowClassName = ({row, rowIndex}) => {
  if (row.verify_status == 0) {
    return 'warning-row'
  } else if (row.verify_status == -1) {
    return 'danger-row'
  }
  return ''
}
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-2">
    <el-table :row-class-name="tableRowClassName" :data="shops.find(_shop => _shop.id === shop)?.products" style="width: 100%; height: 100%;"
              class="rounded-xl">
      <el-table-column prop="icon" label="Иконка" width="80">
        <template #default="scope">
          <div class="flex justify-center">
            <img :src="scope.row.icon" class="w-10 aspect-square" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Название" width="180"/>
      <el-table-column prop="description" label="Описание"/>
      <el-table-column prop="refill" label="" width="140">
        <template #default="scope">
          <div class="flex justify-center">
            <el-button>
              Пополнить
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>