<script setup lang="ts">
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";
import {toast} from "vue-sonner";

const {shops, updateShops} = useUser()
const shop = defineModel()

const props = defineProps({
  shop: Number,
  icon: String,
  name: String,
  description: String,
  tag: String
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
  formData.append('tag', newTag.value);

  try {
    const response = await http.post("/freshmarket/shop/" + props.shop + "/edit", formData, {
      params: {
        name: newName.value,
        description: newDescription.value,
        tag: newTag.value
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
    await updateShops();
  }
};

const cancel = async () => {
  newName.value = props.name;
  newDescription.value = props.description;
  newTag.value = props.tag;
  newIcon.value = null;
}

function copyShopLink() {
  navigator.clipboard.writeText(`https://fresh.zaralx.ru/freshmarket/shop/${newTag.value}`)
  toast.info("Ссылка на ваш магазин скопирована");
}

</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg border bg-neutral-50 dark:border-neutral-800 md:h-64 md:col-span-2 p-2 md:p-3 flex flex-col gap-2 relative">
    <div class="absolute z-10 bg-neutral-950/[.75] w-full h-full top-0 left-0 rounded-xl flex flex-col justify-center items-center" v-if="shops.find(s => s.id === props.shop)?.verify_status == 0">
      <p class="text-red-500 text-xl font-semibold">Редактирование не доступно</p>
      <p>Магазин на проверке</p>
    </div>
    <div class="flex flex-col items-center md:items-stretch md:flex-row gap-2">
      <IconUpload unique="shop-settings" v-model="newIcon" :current-image="icon" :show-current-image="newIcon == null"/>
      <div class="w-full flex flex-col gap-2 md:gap-0">
        <el-input
            v-model="newName"
            minlength="3"
            maxlength="16"
            placeholder="Название магазина"
            show-word-limit
            type="text"
            class="w-full"
            :class="newName == props.name ? '' : 'edited'"
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
            :class="newDescription == props.description ? '' : 'edited'"
        />
      </div>
    </div>
    <div class="mt-auto mb-0 md:flex gap-2">
      <el-input
          v-model="newTag"
          minlength="3"
          maxlength="16"
          :placeholder="tag"
          show-word-limit
          type="text"
          class="w-full opacity-75 mb-2 md:mb-0"
          :class="newTag == props.tag ? '' : 'edited'"
      >
        <template #prepend><button @click="copyShopLink" class="px-4 active:bg-green-600/[.5] rounded-l-md transition active:text-white">{{$device.isMobile ? '/freshmarket/shop/' : 'fresh.zaralx.ru/freshmarket/shop/'}}</button></template>
      </el-input>
      <div class="w-full flex md:w-auto justify-end">
        <el-popconfirm
            confirm-button-text="Подтвердить"
            cancel-button-text="Отмена"
            hide-icon
            title="Сохранить изменения? Магазин отправится на проверку, и товары станут недоступны для покупки."
            @confirm="editShop"
            @cancel="cancel"
            :width="300"
        >
          <template #reference>
            <el-button plain type="success" :disabled="!inEdit" :loading="loading">Сохранить</el-button>
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
  </div>
</template>

<style scoped>
:deep(.edited .el-input__wrapper:not(:focus-within)) {
  box-shadow: 0 0 0 1px var(--el-color-warning) inset !important;
}

:deep(.edited .el-textarea__inner:not(:focus-within)) {
  box-shadow: 0 0 0 1px var(--el-color-warning) inset !important;
}

:deep(.el-input-group .el-input-group__prepend) {
  padding: 0;
}
</style>