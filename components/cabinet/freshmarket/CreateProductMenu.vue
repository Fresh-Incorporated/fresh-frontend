<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";
import PreviewMinecraftShulker from "~/components/freshmarket/PreviewMinecraftShulker.vue";

const props = defineProps({
  shopId: Number,
})

const emit = defineEmits(['updateProducts'])

const formSchema = toTypedSchema(z.object({
  name: z.string().min(3).max(24),
  description: z.string().min(0).max(240).optional(),
  image: z.any().nullable(),
  stackCount: z.number().min(1).max(64),
  slotsCount: z.number().min(1).max(64),
  price: z.number().min(1).max(1728),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append('icon', image.value); // Добавляем файл
  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('stack_count', stackCount.value?.[0]);
  formData.append('slots_count', slotsCount.value?.[0]);
  formData.append('price', price.value);
  formData.append('minecraft_icon', minecraftIcon.value);

  try {
    const response = await http.post(`/freshmarket/shop/${props.shopId}/product/create`, formData, {
      params: {
        name: name.value,
        description: description.value,
        stack_count: stackCount.value?.[0],
        slots_count: slotsCount.value?.[0],
        price: price.value,
        minecraft_icon: minecraftIcon.value
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Магазин создан:', response.data);
    opened.value = false
    emit('updateProducts');
  } catch (error) {
    console.error('Ошибка при создании магазина:', error);
  }
})

const {user, shops, updateUser, updateShops} = useUser()

const image = ref(null);
const name = ref("")
const description = ref("")
const minecraftIcon = ref(null)
const stackCount = ref([1])
const slotsCount = ref([1])
const price = ref(1)
const opened = ref(false)

const isInternalChange = ref(false);
const showMinecraftImageSelect = ref(false)

watch(minecraftIcon, (newValue) => {
  if (!isInternalChange.value) {
    isInternalChange.value = true;
    showMinecraftImageSelect.value = false;
    image.value = null;

    // Откладываем сброс флага
    nextTick(() => {
      isInternalChange.value = false;
    });
  }
});

watch(image, (newValue) => {
  if (!isInternalChange.value) {
    isInternalChange.value = true;
    minecraftIcon.value = null;

    // Откладываем сброс флага
    nextTick(() => {
      isInternalChange.value = false;
    });
  }
});
</script>

<template>
  <ShSheet v-model:open="opened">
    <ShSheetTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShSheetTrigger>
    <ShSheetContent>
      <ShSheetHeader>
        <ShSheetTitle>Создание товара</ShSheetTitle>
        <ShSheetDescription>
          Заполните поля ниже и нажмите СОЗДАТЬ
        </ShSheetDescription>
      </ShSheetHeader>
      <form :validation-schema="formSchema" @submit="onSubmit" class="px-4 space-y-4">
        <ShFormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Название товара<span class="text-destructive">*</span></ShFormLabel>
            <ShFormControl>
              <ShInput v-model="name" :maxlength="24" type="text" v-bind="componentField" placeholder="Название товара" />
            </ShFormControl>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField v-slot="{ componentField }" name="description" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Описание товара</ShFormLabel>
            <ShFormControl>
              <ShTextarea v-model="description" :maxlength="240" type="text" v-bind="componentField" placeholder="Расскажите о своём магазине" />
            </ShFormControl>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField name="image">
          <ShFormItem>
            <ShFormLabel>Иконка товара<span class="text-destructive">*</span></ShFormLabel>
            <ShFormControl>
              <IconUpload unique="create-product" v-model="image" :current-image="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/item/${minecraftIcon}/icon`" :show-current-image="minecraftIcon" />
            </ShFormControl>
            <SelectMinecraftImage v-model="minecraftIcon">
              <ShButton variant="outline" class="w-full">Выбрать предмет из Minecraft</ShButton>
            </SelectMinecraftImage>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField v-slot="{ componentField }" name="slotsCount" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Кол-во слотов для 1 ед.<span class="text-destructive">*</span></ShFormLabel>
            <ShFormControl>
              <ShSlider
                  v-model="slotsCount"
                  :min="1"
                  :max="27"
                  :step="1"
                  v-bind="componentField"
                  @update:model-value="componentField['onUpdate:modelValue']"
              />
            </ShFormControl>
            <ShFormDescription>
              <span>Кол-во слотов: {{slotsCount?.[0]}}</span>
            </ShFormDescription>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField v-slot="{ componentField }" name="stackCount" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Кол-во предметов в каждом слоте для 1 ед.<span class="text-destructive">*</span></ShFormLabel>
            <ShFormControl>
              <ShSlider
                  v-model="stackCount"
                  :min="1"
                  :max="64"
                  :step="1"
                  v-bind="componentField"
                  @update:model-value="componentField['onUpdate:modelValue']"
              />
            </ShFormControl>
            <ShFormDescription>
              <span>В каждом слоте: {{stackCount?.[0]}}</span>
            </ShFormDescription>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField v-slot="{ componentField }" name="price" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Цена за 1 ед. товара<span class="text-destructive">*</span></ShFormLabel>
            <ShNumberField
                class="gap-2"
                :min="1"
                :max="1728"
                v-model="price"
                @update:model-value="componentField['onUpdate:modelValue']"
            >
              <ShNumberFieldContent>
                <ShNumberFieldDecrement />
                <ShFormControl>
                  <ShNumberFieldInput />
                </ShFormControl>
                <ShNumberFieldIncrement />
              </ShNumberFieldContent>
            </ShNumberField>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
      </form>
      <ShSheetFooter>
        <PreviewMinecraftShulker
            v-model:image="image"
            v-model:minecraft-icon="minecraftIcon"
            :slots="slotsCount?.[0]"
            :per-slot="stackCount?.[0]"
            :price="price"
        >
          <ShButton variant="secondary">
            Предпросмотр
          </ShButton>
        </PreviewMinecraftShulker>
        <ShButton @click="onSubmit">
          Создать
        </ShButton>
      </ShSheetFooter>
    </ShSheetContent>
  </ShSheet>
</template>

<style scoped>

</style>