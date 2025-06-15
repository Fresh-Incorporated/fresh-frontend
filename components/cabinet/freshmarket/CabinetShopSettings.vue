<script setup lang="ts">
import {http} from "~/composables/useHttp";
import {toast} from "vue-sonner";
import IconUpload from "~/components/global/upload/IconUpload.vue";

const emit = defineEmits(['updateShop'])

const {updateShops} = useUser()

const {isMobile} = useDevice()

const props = defineProps({
  shopId: Number,
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
    const response = await http.post("/freshmarket/shop/" + props.shopId + "/edit", formData, {
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
    await updateShops()
    emit('updateShop');
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
  <ShCard outlined class="rounded-sm col-span-2">
    <ShCardHeader>
      <ShCardTitle>Настройки магазина</ShCardTitle>
      <ShCardDescription>Настройте магазин в этом разделе</ShCardDescription>
    </ShCardHeader>
    <ShCardContent class="space-y-4 p-1 md:p-4">
      <ShCard class="flex flex-row items-center justify-between p-4 gap-2 rounded-sm col-span-2">
        <ShLabel for="webpush-global" class="text-base block">
          <p>Иконка магазина</p>
        </ShLabel>
        <IconUpload unique="shop-settings" v-model="newIcon" :current-image="icon" :show-current-image="newIcon == null"/>
      </ShCard>
      <ShCard class="flex flex-сol items-between justify-between p-4 gap-2 rounded-sm col-span-2">
        <ShLabel for="webpush-global" class="text-base block">
          <p>Название магазина</p>
        </ShLabel>
        <ShInput v-model="newName" :placeholder="props.name" :maxlength="16" type="text" />
      </ShCard>
      <ShCard class="flex flex-сol items-between justify-between p-4 gap-2 rounded-sm col-span-2">
        <ShLabel for="webpush-global" class="text-base block">
          <p>Описание магазина</p>
        </ShLabel>
        <ShTextarea v-model="newDescription" :placeholder="props.description" :maxlength="240" />
      </ShCard>
      <ShCard class="flex flex-сol items-between justify-between p-4 gap-2 rounded-sm col-span-2">
        <ShLabel for="webpush-global" class="text-base block">
          <p>Тег магазина</p>
        </ShLabel>
        <div class="relative w-full items-center">
          <ShInput id="tag" v-model="newTag" :placeholder="props.name" :maxlength="16" type="text" :class="{
            'pl-64': !isMobile,
          }" />
          <label v-if="!isMobile" @click="copyShopLink" for="tag" class="absolute start-0 inset-y-0 flex items-center justify-center px-2 text-sm border-r bg-neutral-400/[.1]">
            fresh.zaralx.ru/freshmarket/shop/
          </label>
        </div>
      </ShCard>
      <ShCard class="flex flex-сol items-between justify-between p-4 gap-2 rounded-sm col-span-2">
        <ShButton :disabled="!inEdit" @click="editShop">
          Сохранить
        </ShButton>
      </ShCard>
    </ShCardContent>
  </ShCard>
</template>

<style scoped>

</style>