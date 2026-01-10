<script setup lang="ts">
import {http} from "~/composables/useHttp"
import { ref } from 'vue';

definePageMeta({
  layout: 'freshmarketwork'
})

const opened = ref(false);

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
    opened.value = false;
  } catch (error) {
    console.error('Ошибка при создании локации:', error);
  }
};

const handleFileChange = (event) => {
  files.value = Array.from(event.target.files); // Сохраняем все выбранные файлы
};

</script>

<template>
  <ShDialog>
    <ShDialogTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShDialogTrigger>
    <ShDialogContent>
      <ShDialogTitle>
        Создание локации
      </ShDialogTitle>
      <ShInput
          type="file"
          @change="handleFileChange"
          multiple
          accept="image/*"
          class="w-full"
      />
      <ShInput
          v-model="name"
          minlength="3"
          maxlength="24"
          placeholder="Название локации"
          show-word-limit
          type="text"
      />
      <ShInput
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
        <ShInput
            v-model="coordinates[0].x"
            placeholder="X"
            type="number"
        />
        <ShInput
            v-model="coordinates[0].y"
            placeholder="Y"
            type="number"
        />
        <ShInput
            v-model="coordinates[0].z"
            placeholder="Z"
            type="number"
        />
      </div>
      Координаты в нижнем мире
      <div class="flex">
        <ShInput
            v-model="coordinates[1].x"
            placeholder="X"
            type="number"
        />
        <ShInput
            v-model="coordinates[1].y"
            placeholder="Y"
            type="number"
        />
        <ShInput
            v-model="coordinates[1].z"
            placeholder="Z"
            type="number"
        />
      </div>
      Координаты в эндер мире
      <div class="flex">
        <ShInput
            v-model="coordinates[2].x"
            placeholder="X"
            type="number"
        />
        <ShInput
            v-model="coordinates[2].y"
            placeholder="Y"
            type="number"
        />
        <ShInput
            v-model="coordinates[2].z"
            placeholder="Z"
            type="number"
        />
      </div>
      <ShSelect v-model="type" class="w-full">
        <ShSelectTrigger>
          <ShButton variant="outline" class="w-full"><ShSelectValue placeholder="Тип локации" /></ShButton>
        </ShSelectTrigger>
        <ShSelectContent>
          <ShSelectGroup>
            <ShSelectItem
                key="storage"
                value="storage"
            >Склад</ShSelectItem>
            <ShSelectItem
                key="refill"
                value="refill"
            >Ячейки пополнения</ShSelectItem>
            <ShSelectItem
                key="branch"
                value="branch"
            >Филиал</ShSelectItem>
            <ShSelectItem
                key="deliver"
                value="deliver"
            >Ячейки доставки</ShSelectItem>
          </ShSelectGroup>
        </ShSelectContent>
      </ShSelect>
      <ShInput
          v-model="city"
          placeholder="Город (При наличии)"
          type="text"
      />
      <ShDialogFooter>
        <ShButton @click="create">
          Создать
        </ShButton>
      </ShDialogFooter>
    </ShDialogContent>
  </ShDialog>
</template>

<style scoped>

</style>