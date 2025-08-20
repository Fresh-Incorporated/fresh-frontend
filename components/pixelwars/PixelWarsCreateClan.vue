<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  description: '',
  tag: ''
})

const isLoading = ref(false)

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.description || !formData.value.tag) {
    return
  }
  
  isLoading.value = true
  // Здесь будет логика создания клана
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <ShDialog>
    <ShDialogTrigger as-child>
      <slot />
    </ShDialogTrigger>
    <ShDialogContent class="sm:max-w-[500px] p-0 overflow-hidden">
      <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-6 border-b">
        <ShDialogHeader>
          <ShDialogTitle class="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="lucide:users" class="text-white" />
            </div>
            Создать новый клан
          </ShDialogTitle>
          <ShDialogDescription class="text-gray-600 mt-2">
            Создайте свой клан и начните покорять мир PixelWars вместе с друзьями
          </ShDialogDescription>
        </ShDialogHeader>
      </div>

      <ShScrollArea class="max-h-[calc(100vh-240px)]">
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <ShLabel for="name" class="text-sm font-medium text-gray-700">
                Название клана
              </ShLabel>
              <ShInput
                  id="name"
                  v-model="formData.name"
                  placeholder="Введите название клана"
                  class="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  maxlength="20"
              />
              <p class="text-xs text-gray-500">Максимум 20 символов</p>
            </div>

            <div class="space-y-2">
              <ShLabel for="description" class="text-sm font-medium text-gray-700">
                Описание
              </ShLabel>
              <ShTextarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Расскажите о вашем клане"
                  class="min-h-[80px] border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  maxlength="200"
              />
              <p class="text-xs text-gray-500">{{ formData.description.length }}/200 символов</p>
            </div>

            <div class="space-y-2">
              <ShLabel for="tag" class="text-sm font-medium text-gray-700">
                Тег клана
              </ShLabel>
              <div class="relative">
                <ShInput
                    id="tag"
                    v-model="formData.tag"
                    placeholder="PW"
                    class="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 uppercase tracking-wider font-mono"
                    maxlength="4"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                  <div class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                    {{ formData.tag || 'PW' }}
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500">Короткий идентификатор клана (2-4 символа)</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
            <div class="flex items-center gap-3 text-sm text-gray-700">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">Создание клана бесплатно!</p>
                <p class="text-gray-600">Вы получите базовые возможности и сможете приглашать игроков</p>
              </div>
            </div>
          </div>

          <ShDialogFooter class="flex gap-3 pt-4">
            <ShButton
                type="button"
                variant="outline"
                class="flex-1 h-11 border-gray-200 hover:bg-gray-50"
            >
              Отмена
            </ShButton>
            <ShButton
                :loading="isLoading"
                type="submit"
                :disabled="!formData.name || !formData.description || !formData.tag || isLoading"
                class="flex-1 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {{ isLoading ? 'Создаем...' : 'Создать клан' }}
            </ShButton>
          </ShDialogFooter>
        </form>
      </ShScrollArea>
    </ShDialogContent>
  </ShDialog>
</template>

<style scoped>
/* Дополнительные стили для анимаций */
.sh-dialog-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>