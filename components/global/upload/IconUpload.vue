<script setup lang="ts">
import { ref } from 'vue';

const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files ? input.files[0] : null;

  // Очистка предыдущего URL
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value);
  }

  // Установка нового файла и его URL
  file.value = selectedFile;
  fileUrl.value = file.value ? URL.createObjectURL(file.value) : null;
};
</script>

<template>
  <div class="w-48 h-48">
    <label for="dropzone-file" class="w-full h-full flex justify-center">
      <div v-if="!file" class="w-full h-full bg-neutral-800 rounded-lg cursor-pointer flex flex-col justify-center items-center text-neutral-500 hover:bg-neutral-900 hover:text-neutral-600 border-2 border-neutral-700 border-dashed">
        <i class="pi pi-image text-3xl"></i>
        <p class="font-onest">Иконка магазина</p>
        <p class="font-onest text-xs">PNG, JPG, JPEG (Макс. 2мб)</p>
      </div>
      <div v-else class="relative group w-full h-full bg-neutral-800 rounded-lg cursor-pointer flex flex-col justify-center items-center text-neutral-500 hover:bg-neutral-900 hover:text-neutral-600 border-2 border-neutral-700 border-dashed">
        <div class="absolute hidden w-full h-full bg-neutral-900/[0.75] z-20 group-hover:flex flex-col justify-center items-center text-neutral-400">
          <i class="pi pi-image text-3xl"></i>
          <p class="font-onest">Иконка</p>
          <p class="font-onest text-xs">PNG, JPG, JPEG (Макс. 2мб)</p>
        </div>
        <img :src="fileUrl" class="w-full h-full" alt="Загруженное изображение">
      </div>
      <input id="dropzone-file" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
    </label>
  </div>
</template>
