<script setup lang="ts">
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";
import PreviewMinecraftShulker from "~/components/freshmarket/PreviewMinecraftShulker.vue";
import FreshmarketTagsSelect from "~/components/freshmarket/FreshmarketTagsSelect.vue";

const emit = defineEmits(['updateProducts'])

const props = defineProps({
  id: Number,
  shopId: Number,
  icon: String,
  name: String,
  description: String,
  price: Number,
  stack_count: Number,
  slots_count: Number,
  isSecretary: Boolean,
  count: Number,
  tags: Array,
})

const newIcon = ref()
const newName = ref(props.name)
const newDescription = ref(props.description)
const newPrice = ref(props.price)
const newTags = ref(props.tags)
const newCount = ref(props.count)
const newStackCount = ref([props.stack_count])
const newSlotsCount = ref([props.slots_count])
const loading = ref(false)
const opened = defineModel({ default: false })

watch(props, () => {
  newName.value = props.name
  newDescription.value = props.description
  newPrice.value = props.price

  loading.value = false;
})

const sortById = arr => [...arr].sort();

const inEdit = computed(() => {
  if (newName.value != props.name) return true
  if (newDescription.value != props.description) return true
  if (newPrice.value != props.price) return true
  if (newStackCount.value[0] != props.stack_count) return true
  if (newSlotsCount.value[0] != props.slots_count) return true
  if (props.count != null && newCount.value != props.count) return true

  if (
      JSON.stringify(sortById(newTags.value.map(tag => tag.id))) !==
      JSON.stringify(sortById(props.tags.map(tag => tag.id)))
  ) return true;
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
  formData.append('tags', JSON.stringify(sortById(newTags.value.map(tag => tag.id))) !==
      JSON.stringify(sortById(props.tags.map(tag => tag.id))) ? newTags.value.map(tag => tag.id).join("_") : null);
  if (props.isSecretary) {
    formData.append('slots_count', newSlotsCount.value[0]);
    formData.append('stack_count', newStackCount.value[0]);
    formData.append('count', newCount.value);
  }

  try {
    const url = props.isSecretary ? "/freshmarket/work/secretary/product/" + props.id + "/edit" : "/freshmarket/shop/" + props.shopId + "/product/" + props.id + "/edit"
    const response = await http.post(url, formData, {
      params: {
        name: newName.value == props.name ? null : newName.value,
        description: newDescription.value == props.description ? null : newDescription.value,
        tags: newTags.value && JSON.stringify(sortById(newTags.value.map(tag => tag.id))) !==
        JSON.stringify(sortById(props.tags.map(tag => tag.id))) ? newTags.value.map(tag => tag.id).join("_") : null,
        price: newPrice.value,
        slots_count: props.isSecretary ? (newSlotsCount.value[0] == props.slots_count ? null : newSlotsCount.value[0]) : null,
        stack_count: props.isSecretary ? (newStackCount.value[0] == props.stack_count ? null : newStackCount.value[0]) : null,
        count: props.isSecretary ? (newCount.value == props.count ? null : newCount.value) : null
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Магазин отправлен на проверку:', response.data);
    emit('updateProducts')
  } catch (error) {
    console.error('Ошибка при изменении магазина:', error);
  } finally {
    loading.value = false;
    opened.value = false;
  }
};

const cancel = async () => {
  newName.value = props.name;
  newDescription.value = props.description;
  newIcon.value = null;
}
</script>

<template>
  <ShDialog v-model:open="opened">
    <ShDialogTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShDialogTrigger>
    <ShDialogScrollContent class="w-screen px-2 sm:px-6 sm:max-w-[450px]">
      <ShDialogHeader>
        <ShDialogTitle>Изменение товара {{props.name}}</ShDialogTitle>
        <ShDialogDescription>
          Не забудьте сохранить изменения после редактирования!
        </ShDialogDescription>
      </ShDialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <ShLabel for="description" class="text-right">
            Иконка
          </ShLabel>
          <IconUpload unique="edit-product" v-model="newIcon" :current-image="icon" :show-current-image="newIcon == null"/>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <ShLabel for="name" class="text-right">
            Название
          </ShLabel>
          <ShInput id="name" :maxlength="24" v-model="newName" :placeholder="props.name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <ShLabel for="description" class="text-right">
            Описание
          </ShLabel>
          <ShTextarea id="description" :maxlength="240" v-model="newDescription" :placeholder="props.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <ShLabel class="text-right">
            Цена
          </ShLabel>
          <ShNumberField
              class="gap-2 col-span-3"
              :min="0.01"
              :max="1728"
              :step="0.01"
              v-model="newPrice"
          >
            <ShNumberFieldContent>
              <ShNumberFieldDecrement />
              <ShNumberFieldInput />
              <ShNumberFieldIncrement />
            </ShNumberFieldContent>
          </ShNumberField>
        </div>

        <div class="flex flex-col justify-center gap-2">
          <ShLabel class="text-right text-nowrap">
            Кол-во предметов в каждом слоте для 1 ед. <span class="text-primary">[{{props.stack_count}} шт<span v-if="newStackCount[0] != props.stack_count"> <Icon name="lucide:arrow-right" size="14" class="absolute" />    {{newStackCount[0]}} шт</span>]</span>
          </ShLabel>
          <ShSlider
              v-model="newStackCount"
              class="col-span-3"
              :min="1"
              :max="64"
              :step="1"
              :disabled="!props.isSecretary"
          />
        </div>

        <div class="flex flex-col justify-center gap-2">
          <ShLabel class="text-right">
            Кол-во слотов для 1 ед. <span class="text-primary">[{{props.slots_count}} шт<span v-if="newSlotsCount[0] != props.slots_count"> <Icon name="lucide:arrow-right" size="14" class="absolute" />    {{newSlotsCount[0]}} шт</span>]</span>
          </ShLabel>
          <ShSlider
              v-model="newSlotsCount"
              class="col-span-3"
              :min="1"
              :max="64"
              :step="1"
              :disabled="!props.isSecretary"
          />
        </div>
        <div class="flex flex-col justify-center gap-2">
          <ShLabel class="text-right">
            Теги
          </ShLabel>
          <FreshmarketTagsSelect not-form v-model="newTags" :tags="tags"/>
        </div>
        <div v-if="isSecretary" class="grid grid-cols-4 items-center gap-4">
          <ShLabel class="text-right">
            На складе
          </ShLabel>
          <ShNumberField
              class="gap-2 col-span-3"
              :min="0"
              :max="10000"
              :step="1"
              v-model="newCount"
          >
            <ShNumberFieldContent>
              <ShNumberFieldDecrement />
              <ShNumberFieldInput />
              <ShNumberFieldIncrement />
            </ShNumberFieldContent>
          </ShNumberField>
        </div>
      </div>
      <ShDialogFooter>
        <PreviewMinecraftShulker
            v-model:image="newIcon"
            :default-image="props.icon"
            :slots="props.slots_count"
            :per-slot="props.stack_count"
            :price="props.price"
        >
          <ShButton variant="secondary">
            Посмотреть 1 ед. товара
          </ShButton>
        </PreviewMinecraftShulker>
        <ShButton :disabled="!inEdit" @click="editProduct" type="submit">
          Сохранить
        </ShButton>
      </ShDialogFooter>
    </ShDialogScrollContent>
  </ShDialog>
</template>