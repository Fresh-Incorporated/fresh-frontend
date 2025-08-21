<script setup lang="ts">

const {user} = useUser()

const totalClanPixels = ref(0);
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ user?.pwClan?.name || 'Информация о клане' }}
      </h3>
      <button
        @click="emit('toggle-expand')"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          :class="['w-5 h-5 transform transition-transform', { 'rotate-180': isExpanded }]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <div v-if="user.pwClan" class="space-y-3">
      <!-- Основная информация -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Тег клана:</span>
          <div class="font-medium text-gray-900">[{{ user?.pwClan?.tag?.toUpperCase() }}]</div>
        </div>
        <div>
          <span class="text-sm text-gray-500">Уровень:</span>
          <div class="font-medium text-gray-900">{{ user?.pwClan?.level }}</div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Участники:</span>
          <div class="font-medium text-gray-900">0</div>
        </div>
        <div>
          <span class="text-sm text-gray-500">Средний уровень:</span>
          <div class="font-medium text-gray-900">{{ user?.pwClan?.level }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Всего пикселей:</span>
          <div class="font-medium text-gray-900">{{ totalClanPixels.toLocaleString() }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-500">Опыт клана:</span>
          <div class="font-medium text-gray-900">{{ user?.pwClan?.xp }}</div>
        </div>
      </div>

      <!-- Ранг сезона -->
      <div v-if="user?.pwClan?.rank" class="pt-2 border-t border-gray-100">
        <span class="text-sm text-gray-500">Ранг сезона:</span>
        <div class="font-medium text-yellow-600">#{{ user?.pwClan?.rank }}</div>
      </div>

      <!-- Описание -->
      <div v-if="user?.pwClan?.description" class="pt-2 border-t border-gray-100">
        <span class="text-sm text-gray-500">Описание:</span>
        <div class="text-sm text-gray-700 mt-1">{{ user?.pwClan?.description }}</div>
      </div>
    </div>

    <!-- Заглушка если клан не выбран -->
    <div v-else-if="!user?.pwClan" class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Клан не выбран</h3>
      <p class="mt-1 text-sm text-gray-500">Выберите клан для просмотра статистики</p>
    </div>
  </div>
</template> 