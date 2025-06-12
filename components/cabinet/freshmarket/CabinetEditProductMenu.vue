<script setup lang="ts">
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";
import PreviewMinecraftShulker from "~/components/freshmarket/PreviewMinecraftShulker.vue";

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
})

const newIcon = ref()
const newName = ref(props.name)
const newDescription = ref(props.description)
const newPrice = ref(props.price)
const loading = ref(false)
const opened = defineModel()

watch(props, () => {
  newName.value = props.name
  newDescription.value = props.description
  newPrice.value = props.price

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
    const response = await http.post("/freshmarket/shop/" + props.shopId + "/product/" + props.id + "/edit", formData, {
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
    emit('updateProducts')
  } catch (error) {
    console.error('Ошибка при создании магазина:', error);
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
    <ShDialogContent class="sm:max-w-[425px]">
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
              :min="1"
              :max="1728"
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
          <ShLabel class="text-right">
            Кол-во предметов в каждом слоте для 1 ед. <span class="text-primary">[{{props.stack_count}} шт]</span>
          </ShLabel>
          <ShSlider
              class="col-span-3"
              :min="1"
              :max="64"
              :step="1"
              disabled
              :default-value="[props.stack_count]"
          />
        </div>

        <div class="flex flex-col justify-center gap-2">
          <ShLabel class="text-right">
            Кол-во слотов для 1 ед. <span class="text-primary">[{{props.slots_count}} шт]</span>
          </ShLabel>
          <ShSlider
              class="col-span-3"
              :min="1"
              :max="64"
              :step="1"
              disabled
              :default-value="[props.slots_count]"
          />
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
        <ShButton @click="editProduct" type="submit">
          Сохранить
        </ShButton>
      </ShDialogFooter>
    </ShDialogContent>
  </ShDialog>
</template>