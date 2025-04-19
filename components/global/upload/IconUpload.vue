<script setup lang="ts">
import { ref } from 'vue';

const model = defineModel()
const props = defineProps({
  currentImage: String,
  showCurrentImage: Boolean,
  unique: String,
})
const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

const handleFileChange = (fileInput: File | null) => {
  errorMessage.value = null;

  if (fileInput && allowedTypes.includes(fileInput.type)) {
    // Очистка предыдущего URL
    if (fileUrl.value) {
      URL.revokeObjectURL(fileUrl.value);
    }

    // Установка нового файла и его URL
    file.value = fileInput;
    model.value = fileInput

    fileUrl.value = file.value ? URL.createObjectURL(file.value) : null;
  } else {
    errorMessage.value = 'Допустимы только файлы JPG, JPEG, PNG, SVG, WEBP';
    file.value = null;
    fileUrl.value = null;
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();

  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    handleFileChange(event.dataTransfer.files[0]);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<template>
  <div
      class="min-w-48 min-h-48 max-w-48 max-h-48 aspect-square"
      @drop="handleDrop"
      @dragover="handleDragOver"
  >
    <label :for="'dropzone-file-' + unique" class="w-full h-full flex justify-center">
      <div
          v-if="!file && !showCurrentImage"
          class="w-full h-full bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer flex flex-col justify-center items-center text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-900 hover:text-neutral-600 border-2 border-neutral-400 dark:border-neutral-700 border-dashed"
      >
        <i class="pi pi-image text-3xl"></i>
        <p class="font-onest">Иконка</p>
        <p class="font-onest text-xs text-center">PNG, JPG, JPEG, SVG, WEBP (Макс. 2мб)</p>
        <p v-if="errorMessage" class="text-red-500 text-xs">{{ errorMessage }}</p>
      </div>
      <div
          v-else
          class="relative group w-full h-full bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer flex flex-col justify-center items-center text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-900 hover:text-neutral-600 border-2 border-neutral-400 dark:border-neutral-700 border-dashed"
      >
        <div class="absolute hidden w-full h-full bg-neutral-900/[0.5] dark:bg-neutral-900/[0.75] z-20 group-hover:flex flex-col justify-center items-center text-neutral-400">
          <i class="pi pi-image text-3xl"></i>
          <p class="font-onest">Иконка</p>
          <p class="font-onest text-xs text-center">PNG, JPG, JPEG, SVG, WEBP (Макс. 2мб)</p>
        </div>
        <img :src="showCurrentImage ? currentImage : fileUrl" class="w-full h-full rounded-lg" alt="Загруженное изображение">
      </div>
      <input
          :id="'dropzone-file-' + unique"
          type="file"
          accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml"
          @change="event => handleFileChange(event.target.files ? event.target.files[0] : null)"
          class="hidden"
      />
    </label>
  </div>
</template>
