<script setup lang="ts">
import {http} from "~/composables/useHttp"
import type {CSSProperties} from "vue";

const props = defineProps({
  shop: Number,
})

const model = defineModel()

const {user, shops} = useUser()

interface Mark {
  style: CSSProperties
  label: string
}

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
const count = ref(1)
const countMarks = reactive<Marks>({
  1: '1',
  16: '16',
  64: '64',
})
const price = ref(1)

onMounted(() => {
  if (window.innerWidth > 1200) size.value = "30%"
  else if (window.innerWidth > 800) size.value = "50%"
  else size.value = "100%"
})

const createShop = async () => {
  const formData = new FormData();
  formData.append('icon', file.value);
  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('count', count.value);
  formData.append('price', price.value);

  try {
    const response = await http.post(`/freshmarket/shop/${props.shop}/product/create`, formData, {
      params: {
        name: name.value,
        description: description.value,
        count: count.value,
        price: price.value
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
      <el-slider v-model="count" :step="1" :max="64" :min="1" :marks="countMarks" />
      <div class="h-8"></div>
      <el-input-number v-model="price" :precision="1" :step="1" :min="0.5" :max="1000" />

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