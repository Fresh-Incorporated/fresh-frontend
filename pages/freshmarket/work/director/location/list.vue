<script setup lang="ts">
import {http} from "~/composables/useHttp"
import { ref } from 'vue';

definePageMeta({
  layout: 'freshmarketwork'
})

const locations = ref([])

onMounted(async () => {
  const response = await http.get(`freshmarket/work/director/locations`)

  locations.value = response.data
})

const selectedLocationId = ref(0)
const imageDialog = ref(false)

const showImageDialog = (id: number) => {
  selectedLocationId.value = id;
  imageDialog.value = true;
}
</script>

<template>
  <div class="w-full">
    <el-dialog
        v-model="imageDialog"
        title="Изображения"
        width="800"
    >
      <div class="overflow-y-scroll max-h-[60vh]">
        <div v-for="image in locations[selectedLocationId]?.images">
          <img :src="image.image" alt="image">
        </div>
      </div>
    </el-dialog>
    <el-table :data="locations" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="description" label="Описание" />
      <el-table-column prop="type" label="Тип" width="120" />
      <el-table-column prop="city" label="Город" />
      <el-table-column prop="enabled" label="Включено?" width="120">
        <template #default="scope">
          <div class="ml-5">
            <el-switch v-model="scope.row.enabled" :disabled="scope.row.cells == null ? true : scope.row.cells.length === 0" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="coordinates" label="Координаты" width="400">
        <template #default="scope">
          <div v-for="coordinate in scope.row.coordinates" class="grid grid-cols-4">
            <p>{{coordinate.world}}</p>
            <p>{{coordinate.x}}</p>
            <p>{{coordinate.y}}</p>
            <p>{{coordinate.z}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="images" label="Изображения" width="140">
        <template #default="scope">
          <el-button @click="showImageDialog(scope.$index)">Показать</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cells" label="Ячейки" width="140">
        <template #default="scope">
          <el-button>Показать</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>