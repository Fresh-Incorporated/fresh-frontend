<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import IconUpload from "~/components/global/upload/IconUpload.vue";
import {http} from "~/composables/useHttp";

const formSchema = toTypedSchema(z.object({
  name: z.string().min(3).max(16),
  description: z.string().min(0).max(240).optional(),
  image: z.any().nullable(),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append('icon', image.value); // Добавляем файл
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
    opened.value = false
    await updateUser();
    await updateShops();
  } catch (error) {
    console.error('Ошибка при создании магазина:', error);
  }
})

const {user, shops, updateUser, updateShops} = useUser()

const image = ref(null);
const name = ref("")
const description = ref("")
const opened = ref(false)
</script>

<template>
  <ShSheet v-model:open="opened">
    <ShSheetTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShSheetTrigger>
    <ShSheetContent class="flex flex-col h-screen">
      <ShSheetHeader>
        <ShSheetTitle>Создание магазина</ShSheetTitle>
        <ShSheetDescription>
          Заполните поля ниже и нажмите СОЗДАТЬ
          <br>
          Мы берём комиссию 10% с каждой продажи!
        </ShSheetDescription>
      </ShSheetHeader>
      <form :validation-schema="formSchema" @submit="onSubmit" class="px-4 space-y-4 flex-1">
        <ShFormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Название магазина<span class="text-destructive">*</span></ShFormLabel>
            <ShFormControl>
              <ShInput v-model="name" :maxlength="16" type="text" v-bind="componentField" :placeholder="(user?.nickname || 'New') + ' shop'" />
            </ShFormControl>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField v-slot="{ componentField }" name="description" :validate-on-blur="!isFieldDirty">
          <ShFormItem>
            <ShFormLabel>Описание магазина</ShFormLabel>
            <ShFormControl>
              <ShTextarea v-model="description" :maxlength="240" type="text" v-bind="componentField" placeholder="Расскажите о своём магазине" />
            </ShFormControl>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
        <ShFormField name="image">
          <ShFormItem>
            <ShFormLabel>Иконка магазина</ShFormLabel>
            <ShFormControl>
              <IconUpload unique="create-shop" v-model="image"/>
            </ShFormControl>
            <ShFormMessage class="text-destructive" />
          </ShFormItem>
        </ShFormField>
      </form>
      <ShSheetFooter>
        <ShButton @click="onSubmit">
          Создать - {{16 + 64 * shops.length}} АР
        </ShButton>
      </ShSheetFooter>
    </ShSheetContent>
  </ShSheet>
</template>

<style scoped>

</style>