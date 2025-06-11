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
      class="min-w-48 min-h-48 max-w-48 max-h-48 aspect-square shadow-xs"
      @drop="handleDrop"
      @dragover="handleDragOver"
  >
    <label :for="'dropzone-file-' + unique" class="w-full h-full flex justify-center">
      <div
          v-if="!file && !showCurrentImage"
          class="w-full h-full cursor-pointer flex flex-col justify-center items-center active:text-primary border-input text-muted-foreground hover:border-ring hover:ring-ring/50 dark:bg-input/30 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none hover:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      >
        <i class="pi pi-image text-3xl"></i>
        <p class="font-onest">Иконка</p>
        <p class="font-onest text-xs text-center">PNG, JPG, JPEG, SVG, WEBP (Макс. 2мб)</p>
        <p v-if="errorMessage" class="text-red-500 text-xs">{{ errorMessage }}</p>
      </div>
      <div
          v-else
          class="relative group w-full h-full cursor-pointer flex flex-col justify-center items-center active:text-primary border-input text-muted-foreground hover:border-ring hover:ring-ring/50 dark:bg-input/30 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none hover:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      >
        <div class="rounded-md absolute hidden w-full h-full bg-neutral-900/[0.5] dark:bg-neutral-900/[0.75] z-20 group-hover:flex flex-col justify-center items-center">
          <i class="pi pi-image text-3xl"></i>
          <p class="font-onest">Иконка</p>
          <p class="font-onest text-xs text-center">PNG, JPG, JPEG, SVG, WEBP (Макс. 2мб)</p>
        </div>
        <img :src="showCurrentImage ? currentImage : fileUrl" class="w-full h-full rounded-md" alt="Загруженное изображение">
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
