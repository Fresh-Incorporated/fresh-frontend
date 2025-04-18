<script setup lang="ts">
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";

const {updateShops} = useUser()
const opened = defineModel()

const props = defineProps({
  product: Number,
  shop: Number,
  icon: String,
  name: String,
  description: String,
  price: Number,
  stack_count: Number,
  slots_count: Number,
})

const newIcon = ref()
const newName = ref(props.name)
const newDescription = ref(props.description)
const newPrice = ref(props.price)
const loading = ref(false)

watch(props, () => {
  newName.value = props.name
  newDescription.value = props.description

  loading.value = false;
})

const inEdit = computed(() => {
  if (newName.value != props.name) return true
  if (newDescription.value != props.description) return true
  if (newPrice.value != props.price) return true
  if (newIcon.value) return true

  return false;
})

const editProduct = async () => {
  loading.value = true

  const formData = new FormData();
  formData.append('icon', newIcon.value); // Добавляем файл
  formData.append('name', newName.value);
  formData.append('description', newDescription.value);
  formData.append('price', newPrice.value);

  try {
    const response = await http.post("/freshmarket/shop/" + props.shop + "/product/" + props.product + "/edit", formData, {
      params: {
        name: newName.value == props.name ? null : newName.value,
        description: newDescription.value == props.description ? null : newDescription.value,
        price: newPrice.value,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Магазин отправлен на проверку:', response.data);
  } catch (error) {
    console.error('Ошибка при создании магазина:', error);
  } finally {
    loading.value = false;
    opened.value = false;
    await updateShops();
  }
};

const cancel = async () => {
  newName.value = props.name;
  newDescription.value = props.description;
  newIcon.value = null;
}

const stackCountMarks = reactive({
  1: '1',
  16: '16',
  64: '64',
})
const slotsCountMarks = reactive({
  1: '1',
  27: '27',
})
</script>

<template>
<el-dialog v-model="opened" width="350">
  <div>
    <div class="flex flex-col gap-2 items-center">
      <div class="w-full h-full flex gap-2">
        <IconUpload v-model="newIcon" :current-image="icon" :show-current-image="newIcon == null"/>
<!--        <p class="mt-2 text-neutral-200">Кол-во едениц товара в 1 слоте</p>-->
        <div class="flex-1 w-full grid grid-cols-2">
          <div class="flex items-center justify-end">
            <p class="text-nowrap [writing-mode:sideways-lr] text-xs text-neutral-500 transform translate-x-2">Кол-во ед. товара в 1 слоте</p>
            <el-slider height="90%" vertical v-model="props.stack_count" :step="1" :max="64" :min="1" :marks="stackCountMarks" disabled />
          </div>
          <!--        <p class="mt-4 text-neutral-200">Кол-во слотов которые занимает единица товара</p>-->
          <div class="flex items-center justify-end">
            <p class="text-nowrap [writing-mode:sideways-lr] text-xs text-neutral-500 transform translate-x-2">Кол-во слотов на 1 ед. товара</p>
            <el-slider height="90%" vertical v-model="props.slots_count" :step="1" :max="27" :min="1" :marks="slotsCountMarks" disabled />
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col gap-2">
        <el-input
            v-model="newName"
            minlength="3"
            maxlength="16"
            placeholder="Название товара"
            show-word-limit
            type="text"
            class="w-full"
            :class="newName == props.name ? '' : 'edited'"
        />
        <el-input
            v-model="newDescription"
            maxlength="240"
            placeholder="Описание товара"
            show-word-limit
            :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
            :parser="(value) => value.replace(/[\r\n]+/g, '')"
            type="textarea"
            class="w-full max-h-40 overflow-y-auto mt-auto mb-0"
            :rows="7"
            resize="none"
            :class="newDescription == props.description ? '' : 'edited'"
        />
        <el-input-number
            v-model="newPrice"
            :step="1" :min="1" :max="1000"
            placeholder="Цена"
            style="width: 100%"
            :class="newPrice == props.price ? '' : 'edited'"
        >
          <template #suffix>
            АР
          </template>
        </el-input-number>
      </div>
      <el-popconfirm
          confirm-button-text="Подтвердить"
          cancel-button-text="Отмена"
          hide-icon
          title="Сохранить изменения? Товар отправится на проверку, и станет недоступным для покупки."
          @confirm="editProduct"
          @cancel="cancel"
          :width="300"
          :teleported="false"
      >
        <template #reference>
          <el-button @click="newName == props.name && newDescription == props.description && newIcon == null ? editProduct() : null" plain type="success" :disabled="!inEdit" :loading="loading">Сохранить</el-button>
        </template>
        <template #actions="{ confirm, cancel }">
          <el-button size="small" @click="cancel">Отмена</el-button>
          <el-button
              type="danger"
              size="small"
              @click="confirm"
          >
            Сохранить
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</el-dialog>
</template>

<style scoped>
:deep(.edited .el-input__wrapper:not(:focus-within)) {
  box-shadow: 0 0 0 1px var(--el-color-warning) inset !important;
}

:deep(.edited .el-textarea__inner:not(:focus-within)) {
  box-shadow: 0 0 0 1px var(--el-color-warning) inset !important;
}
</style>