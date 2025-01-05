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
const imagesDialog = ref(false)
const cellsDialog = ref(false)
const cellsGeneratorDialog = ref(false)
const newCellsLetters = ref("A-D")
const newCellsNumbers = ref("1-10")
const newCells = ref([])

const showImagesDialog = (id: number) => {
  selectedLocationId.value = id;
  imagesDialog.value = true;
}

const showCellsDialog = (id: number) => {
  selectedLocationId.value = id;
  cellsDialog.value = true;
  updateNewCells();
}

const updateNewCells = () => {
  newCells.value = generateCombinations(newCellsLetters.value, newCellsNumbers.value)
}

function generateCombinations(letters, numbers) {
  // Разделяем строки на массивы, используя разделитель '-'
  const letterArray = letters.split('-');
  const numberArray = numbers.split('-');

  // Получаем диапазоны для букв и чисел
  const letterRange = [letterArray[0], letterArray[1]];
  const numberRange = [parseInt(numberArray[0]), parseInt(numberArray[1])];

  const result = [];

  // Генерируем все комбинации
  for (let i = letterRange[0].charCodeAt(0); i <= letterRange[1].charCodeAt(0); i++) {
    for (let j = numberRange[0]; j <= numberRange[1]; j++) {
      result.push({letter: String.fromCharCode(i), number: j});
    }
  }

  return result;
}

const confirmNewCells = async () => {
  await http.post(`/freshmarket/work/director/location/${locations.value[selectedLocationId.value].id}/cells/add`, {cells: newCells.value})
}

const enableLocation = async (id: number) => {
  await http.post(`/freshmarket/work/director/location/${id}/enable`)
}

const disableLocation = async (id: number) => {
  await http.post(`/freshmarket/work/director/location/${id}/disable`)
}
</script>

<template>
  <el-drawer v-model="cellsGeneratorDialog" title="Создание ячеек" direction="rtl">
    <template #default>
      <div>
        <el-input
            v-model="newCellsLetters"
            placeholder="Letters (A-Z)"
            :formatter="(value) => value.replace(/[^a-zA-Z-]+/g, '').toUpperCase()"
            :parser="(value) => value.replace(/[^a-zA-Z-]+/g, '').toUpperCase()"
            type="text"
            @change="updateNewCells"
        />
        <el-input
            v-model="newCellsNumbers"
            placeholder="Numbers (1-100)"
            :formatter="(value) => value.replace(/[^\d-]+/g, '').toUpperCase()"
            :parser="(value) => value.replace(/[^\d-]+/g, '').toUpperCase()"
            type="text"
            @change="updateNewCells"
        />
      </div>
      <div class="grid grid-cols-10">
        <p v-for="cell in newCells">{{cell.letter}}-{{cell.number}}</p>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cellsGeneratorDialog = false">Отменить</el-button>
        <el-button type="primary" @click="confirmNewCells">Создать</el-button>
      </div>
    </template>
  </el-drawer>
  <div class="w-full">
    <el-dialog
        v-model="cellsDialog"
        title="Ячейки"
        width="800"
    >
      <div class="overflow-y-scroll max-h-[60vh]">
        <div class="grid grid-cols-12">
          <div v-for="cell in locations[selectedLocationId]?.cells">
            {{cell.letter}}-{{cell.number}}
          </div>
        </div>
        <div>
          <el-button @click="cellsGeneratorDialog = true">
            Добавить ячейки
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        v-model="imagesDialog"
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
            <el-switch @change="async ($event) => {
              scope.row.loading = true
              if ($event) await enableLocation(scope.row.id).catch(() => {
                scope.row.enabled = false;
              })
              else await disableLocation(scope.row.id)
              scope.row.loading = false
            }" v-model="scope.row.enabled" :loading="scope.row.loading" :disabled="scope.row.cells == null ? true : scope.row.cells.length === 0" />
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
          <el-button @click="showImagesDialog(scope.$index)">Показать</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cells" label="Ячейки" width="140">
        <template #default="scope">
          <el-button @click="showCellsDialog(scope.$index)">Показать</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>