<script setup lang="ts">
import {http} from "~/composables/useHttp"
import type {CSSProperties} from "vue";
import IconUpload from "~/components/global/upload/IconUpload.vue";

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
const stackCount = ref(1)
const stackCountMarks = reactive<Marks>({
  1: '1',
  16: '16',
  64: '64',
})
const slotsCount = ref(1)
const slotsCountMarks = reactive<Marks>({
  1: '1',
  27: '27',
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
  formData.append('stack_count', stackCount.value);
  formData.append('slots_count', slotsCount.value);
  formData.append('price', price.value);

  try {
    const response = await http.post(`/freshmarket/shop/${props.shop}/product/create`, formData, {
      params: {
        name: name.value,
        description: description.value,
        stack_count: stackCount.value,
        slots_count: slotsCount.value,
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
  }
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
      <div class="flex flex-col">
        <p class="mt-2 text-neutral-200">Иконка товара</p>
        <IconUpload v-model="file" />
        <p class="mt-2 text-neutral-200">Название товара</p>
        <el-input
            v-model="name"
            minlength="3"
            maxlength="24"
            placeholder="Название товара"
            show-word-limit
            type="text"
        />
        <p class="mt-2 text-neutral-200">Описание товара</p>
        <el-input
            v-model="description"
            maxlength="240"
            placeholder="Описание товара"
            show-word-limit
            :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
            :parser="(value) => value.replace(/[\r\n]+/g, '')"
            type="textarea"
        />
        <p class="mt-2 text-neutral-200">Кол-во едениц товара в 1 слоте</p>
        <el-slider v-model="stackCount" :step="1" :max="64" :min="1" :marks="stackCountMarks" />
        <p class="mt-4 text-neutral-200">Кол-во слотов которые занимает единица товара</p>
        <el-slider v-model="slotsCount" :step="1" :max="27" :min="1" :marks="slotsCountMarks" />
        <p class="mt-4 text-neutral-200">Цена товара</p>
        <el-input-number v-model="price" :step="1" :min="1" :max="1000">
          <template #suffix>
            АР
          </template>
        </el-input-number>
      </div>

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