<script setup lang="ts">
import {http} from "~/composables/useHttp"
import { ref } from 'vue';

definePageMeta({
  layout: 'freshmarketwork'
})

const name = ref("")
const description = ref("")
const coordinates = ref([{
  world: "overworld",
  x: null,
  y: null,
  z: null,
},{
  world: "nether",
  x: null,
  y: null,
  z: null,
},{
  world: "the_end",
  x: null,
  y: null,
  z: null,
}])
const type = ref("")
const city = ref("")
const files = ref([]);

const create = async () => {
  const formData = new FormData();

  // Добавляем все файлы в FormData
  files.value.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  formData.append("name", name.value)
  formData.append("description", description.value)
  formData.append("coordinates", JSON.stringify(coordinates.value))
  formData.append("type", type.value)
  formData.append("city", city.value)

  try {
    const response = await http.post(`/freshmarket/work/director/location/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Локация создана:', response.data);
    model.value = false;
  } catch (error) {
    console.error('Ошибка при создании локации:', error);
  }
};

const handleFileChange = (event) => {
  files.value = Array.from(event.target.files); // Сохраняем все выбранные файлы
};

</script>

<template>
  <div>
    <input
        type="file"
        @change="handleFileChange"
        multiple
        accept="image/*"
        class="w-full"
    />
    <el-input
        v-model="name"
        minlength="3"
        maxlength="24"
        placeholder="Название локации"
        show-word-limit
        type="text"
    />
    <el-input
        v-model="description"
        maxlength="320"
        placeholder="Описание локации"
        show-word-limit
        :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
        :parser="(value) => value.replace(/[\r\n]+/g, '')"
        type="textarea"
    />
    Координаты в верхнем мире
    <div class="flex">
      <el-input
          v-model="coordinates[0].x"
          placeholder="X"
          type="number"
      />
      <el-input
          v-model="coordinates[0].y"
          placeholder="Y"
          type="number"
      />
      <el-input
          v-model="coordinates[0].z"
          placeholder="Z"
          type="number"
      />
    </div>
    Координаты в нижнем мире
    <div class="flex">
      <el-input
          v-model="coordinates[1].x"
          placeholder="X"
          type="number"
      />
      <el-input
          v-model="coordinates[1].y"
          placeholder="Y"
          type="number"
      />
      <el-input
          v-model="coordinates[1].z"
          placeholder="Z"
          type="number"
      />
    </div>
    Координаты в эндер мире
    <div class="flex">
      <el-input
          v-model="coordinates[2].x"
          placeholder="X"
          type="number"
      />
      <el-input
          v-model="coordinates[2].y"
          placeholder="Y"
          type="number"
      />
      <el-input
          v-model="coordinates[2].z"
          placeholder="Z"
          type="number"
      />
    </div>
    <el-input
        v-model="type"
        placeholder="Тип локации"
        type="text"
    />
    <el-input
        v-model="city"
        placeholder="Город (При наличии)"
        type="text"
    />
    <el-button @click="create">
      Создать
    </el-button>
  </div>
</template>

<style scoped>

</style>