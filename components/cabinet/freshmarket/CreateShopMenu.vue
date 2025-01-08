<script setup lang="ts">
import {http} from "~/composables/useHttp"
import IconUpload from "~/components/global/upload/IconUpload.vue";

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

  name.value = (user?.value?.nickname || "New") + " shop";
})

const createShop = async () => {
  const formData = new FormData();
  formData.append('icon', file.value); // Добавляем файл
  formData.append('name', name.value);
  formData.append('description', description.value);

  try {
    const response = await http.post('/freshmarket/shop/create', formData, {
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
  }
};

</script>

<template>
  <div>
    <el-drawer
        v-model="model"
        title="Новый магазин"
        direction="rtl"
        :size="size"
    >
      <div class="flex flex-col">
        <IconUpload v-model="file" />
        <p class="mt-2 text-neutral-200">Название магазина</p>
        <el-input
            v-model="name"
            minlength="3"
            maxlength="16"
            placeholder="Название магазина"
            show-word-limit
            type="text"
        />
        <p class="mt-2 text-neutral-200">Описание магазина</p>
        <el-input
            v-model="description"
            maxlength="240"
            placeholder="Описание магазина"
            show-word-limit
            :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
            :parser="(value) => value.replace(/[\r\n]+/g, '')"
            type="textarea"
        />
      </div>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="createShop">Создать магазин {{16 + Math.pow(16, shops.length) * shops.length}} АР</el-button>
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