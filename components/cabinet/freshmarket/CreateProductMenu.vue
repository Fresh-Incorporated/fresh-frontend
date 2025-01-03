<script setup lang="ts">
import {http} from "~/composables/useHttp"

const model = defineModel()
const {user, shops} = useUser()

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Вы точно хотите закрыть меню создания магазина? Всё будет утеряно.', {autofocus: false})
      .then(() => {
        done()
      })
      .catch(() => {})
}

const size = ref("30%")

const file = ref(null);
const name = ref("")
const description = ref("")

onMounted(() => {
  if (window.innerWidth > 1200) size.value = "30%"
  else if (window.innerWidth > 800) size.value = "50%"
  else size.value = "100%"
})

const createShop = async () => {
  const formData = new FormData();
  formData.append('icon', file.value); // Добавляем файл
  formData.append('name', name.value);
  formData.append('description', description.value);

  try {
    const response = await http.post('/freshmarket/shops/create', formData, {
      params: {
        name: name.value,
        description: description.value,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Магазин создан:', response.data);
    model.value = false;
  } catch (error) {
    console.error('Ошибка при создании магазина:', error);
    ElMessage.error(error.response.data.message || 'Ошибка создания магазина');
  }
};

const handleFileChange = (event) => {
  file.value = event.target.files[0]; // Получаем объект файла
};
</script>

<template>
  <div>
    <el-drawer
        v-model="model"
        title="Новый товар"
        direction="rtl"
        :size="size"

    >
      <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          class="w-full"
      />
      <el-input
          v-model="name"
          minlength="3"
          maxlength="24"
          placeholder="Название товара"
          show-word-limit
          type="text"
      />
      <el-input
          v-model="description"
          maxlength="240"
          placeholder="Описание товара"
          show-word-limit
          :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
          :parser="(value) => value.replace(/[\r\n]+/g, '')"
          type="textarea"
      />

      кол-во пердметов в товаре, и мб сделать чтобы не более 1 слота товар занимал
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="createShop">Создать товар</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style>
textarea {
  max-height: 300px;
}
</style>