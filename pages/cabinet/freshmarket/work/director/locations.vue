<script setup lang="ts">
import {http} from "~/composables/useHttp"
import {ref} from 'vue';

definePageMeta({
  layout: 'cabinet'
})

const locations = ref([])

onMounted(async () => {
  await refreshLocations()
})

const refreshLocations = async () => {
  const response = await http.get(`freshmarket/work/director/locations`)

  locations.value = response.data
}

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

const confirmNewCells = async (id: number) => {
  await http.post(`/freshmarket/work/director/location/${id}/cells/add`, {cells: newCells.value})
  cellsGeneratorDialog.value = false;
  cellsDialog.value = false;

}

const enableLocation = async (id: number) => {
  await http.post(`/freshmarket/work/director/location/${id}/enable`)
}

const disableLocation = async (id: number) => {
  await http.post(`/freshmarket/work/director/location/${id}/disable`)
}
</script>

<template>
  <div class="w-full p-4">
    <div class="w-full border rounded-md">
      <ShTable>
        <ShTableHeader>
          <ShTableRow>
            <ShTableHead>
              Название
            </ShTableHead>
            <ShTableHead>
              Описание
            </ShTableHead>
            <ShTableHead>
              Город
            </ShTableHead>
            <ShTableHead>
              Тип
            </ShTableHead>
            <ShTableHead>
              Включено?
            </ShTableHead>
            <ShTableHead>
              Координаты
            </ShTableHead>
            <ShTableHead>
              Изображения
            </ShTableHead>
            <ShTableHead>
              Ячейки
            </ShTableHead>
          </ShTableRow>
        </ShTableHeader>
        <ShTableBody>
          <template v-if="locations?.length">
            <ShTableRow
                v-for="row in locations"
            >
              <ShTableCell>{{ row.name }}</ShTableCell>
              <ShTableCell>{{ row.description }}</ShTableCell>
              <ShTableCell>{{ row.city }}</ShTableCell>
              <ShTableCell>{{ row.type }}</ShTableCell>
              <ShTableCell>
                <ShSwitch @update:model-value="async (newValue) => {
                  row.loading = true
                  if (newValue) await enableLocation(row.id).catch(() => {
                    row.enabled = false;
                  })
                  else await disableLocation(row.id)
                  row.loading = false
                }" v-model="row.enabled"
                          :disabled="(row.cells == null ? true : row.cells.length === 0) || row.loading"/>
              </ShTableCell>
              <ShTableCell>
                <div v-for="coordinate in row.coordinates" class="grid grid-cols-4">
                  <p>{{ coordinate.world }}</p>
                  <p>{{ coordinate.x }}</p>
                  <p>{{ coordinate.y }}</p>
                  <p>{{ coordinate.z }}</p>
                </div>
              </ShTableCell>
              <ShTableCell>
                <ShDialog v-model="imagesDialog">
                  <ShDialogTrigger as-child>
                    <ShButton variant="outline" size="sm">
                      Изображения {{row.images?.length}}
                    </ShButton>
                  </ShDialogTrigger>
                  <ShDialogContent>
                    <ShDialogTitle>Изображения</ShDialogTitle>
                    <div class="overflow-y-scroll max-h-[60vh]">
                      <div v-for="image in row?.images">
                        <img :src="image.image" alt="image">
                      </div>
                    </div>
                  </ShDialogContent>
                </ShDialog>
              </ShTableCell>
              <ShTableCell>
                <ShDialog v-model="cellsDialog">
                  <ShDialogTrigger as-child>
                    <ShButton variant="outline" size="sm">
                      Ячейки {{row.cells?.length}}
                    </ShButton>
                  </ShDialogTrigger>
                  <ShDialogContent>
                    <ShDialogTitle>Ячейки</ShDialogTitle>
                    <div class="grid grid-cols-12">
                      <div v-for="cell in row?.cells">
                        {{cell.letter}}-{{cell.number}}
                      </div>
                    </div>
                    <ShDialogFooter>
                      <ShSheet v-model="cellsGeneratorDialog" title="Создание ячеек" direction="rtl">
                        <ShSheetTrigger>
                          <ShButton>
                            Добавить ячейки
                          </ShButton>
                        </ShSheetTrigger>
                        <ShSheetContent>
                          <ShSheetTitle>Создание ячеек</ShSheetTitle>
                          <div>
                            <ShInput
                                v-model="newCellsLetters"
                                placeholder="Letters (A-Z)"
                                @update:model-value="updateNewCells"
                            />
                            <ShInput
                                v-model="newCellsNumbers"
                                placeholder="Numbers (1-100)"
                                @update:model-value="updateNewCells"
                            />
                          </div>
                          <div class="grid grid-cols-10">
                            <p v-for="cell in newCells">{{cell.letter}}-{{cell.number}}</p>
                          </div>
                          <ShDialogFooter>
                            <ShDialogClose>
                              <ShButton variant="secondary">Отменить</ShButton>
                            </ShDialogClose>
                            <ShButton @click="confirmNewCells(row.id)">Создать</ShButton>
                          </ShDialogFooter>
                        </ShSheetContent>
                      </ShSheet>
                    </ShDialogFooter>
                  </ShDialogContent>
                </ShDialog>
              </ShTableCell>
            </ShTableRow>
          </template>
          <template v-else>
            <ShTableRow>
              <ShTableCell :colspan="8" class="h-24 text-center">
                No results.
              </ShTableCell>
            </ShTableRow>
          </template>
        </ShTableBody>
      </ShTable>
    </div>
  </div>
</template>

<style scoped>

</style>