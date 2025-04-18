<script setup lang="ts">
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";

const shop = defineModel()

const props = defineProps({
  shop: Number,
  icon: String,
  name: String,
  description: String,
  tag: String,
  updateShops: Function
})

const newIcon = ref()
const newName = ref(props.name)
const newDescription = ref(props.description)
const newTag = ref(props.tag)
const loading = ref(false)

watch(props, () => {
  newName.value = props.name
  newDescription.value = props.description
  newTag.value = props.tag

  loading.value = false;
})



const inEdit = computed(() => {
  if (newName.value != props.name) return true
  if (newDescription.value != props.description) return true
  if (newTag.value != props.tag) return true
  if (newIcon.value) return true

  return false;
})

const editShop = async () => {
  loading.value = true

  const formData = new FormData();
  formData.append('icon', newIcon.value); // Добавляем файл
  formData.append('name', newName.value);
  formData.append('description', newDescription.value);
  // formData.append('tag', newTag.value);

  try {
    const response = await http.post("/freshmarket/shop/" + props.shop + "/edit", formData, {
      params: {
        name: newName.value,
        description: newDescription.value,
        // tag: newTag.value
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
    await props.updateShops();
  }
};

const cancel = async () => {
  newName.value = props.name;
  newDescription.value = props.description;
  newTag.value = props.tag;
  newIcon.value = null;
}

</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-[18.5rem] col-span-2 p-3 flex flex-col gap-2">
    <div class="flex gap-2">
      <IconUpload v-model="newIcon" :current-image="icon" :show-current-image="newIcon == null" />
      <div class="w-full flex flex-col">
        <el-input
            v-model="newName"
            minlength="3"
            maxlength="16"
            placeholder="Название магазина"
            show-word-limit
            type="text"
            class="w-full"
        />
        <el-input
            v-model="newDescription"
            maxlength="240"
            placeholder="Описание магазина"
            show-word-limit
            :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
            :parser="(value) => value.replace(/[\r\n]+/g, '')"
            type="textarea"
            class="w-full max-h-40 overflow-y-auto mt-auto mb-0"
            :rows="7"
            resize="none"
        />
      </div>
    </div>
    <div class="mt-auto mb-0">
      <el-input
          v-model="newTag"
          minlength="3"
          maxlength="16"
          placeholder="Тег магазина [В разработке]"
          show-word-limit
          type="text"
          class="w-full opacity-75"
          disabled
      >
        <template #prepend>fresh.zaralx.ru/freshmarket/shop/</template>
      </el-input>
    </div>
    <div class="ml-auto">
      <el-button plain :disabled="!inEdit" :loading="loading" @click="cancel">Отмена</el-button>
      <el-button :plain="!inEdit" type="success" :disabled="!inEdit" @click="editShop()" :loading="loading">Сохранить</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>