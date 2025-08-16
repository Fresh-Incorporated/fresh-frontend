<script setup lang="ts">
import { computed } from 'vue';
import type { GameSeason } from '~/types/pixelwars';

interface Props {
  season?: GameSeason;
}

const props = defineProps<Props>();

const timeLeft = computed(() => {
  if (!props.season || !props.season.isActive) return null;
  
  const now = new Date();
  const end = new Date(props.season.endDate);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
});

const progressPercentage = computed(() => {
  if (!props.season || !props.season.isActive) return 0;
  
  const now = new Date();
  const start = new Date(props.season.startDate);
  const end = new Date(props.season.endDate);
  
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
});

const formatTime = (value: number) => value.toString().padStart(2, '0');
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ season?.name || 'Текущий сезон' }}
      </h3>
      <div class="text-sm text-gray-500">
        {{ season?.isActive ? 'Активен' : 'Завершен' }}
      </div>
    </div>

    <div v-if="season && season.isActive" class="space-y-4">
      <!-- Прогресс сезона -->
      <div>
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Прогресс сезона</span>
          <span>{{ progressPercentage.toFixed(1) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Время до конца сезона -->
      <div v-if="timeLeft">
        <h4 class="text-sm font-medium text-gray-700 mb-3">До конца сезона осталось:</h4>
        <div class="grid grid-cols-4 gap-2">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ formatTime(timeLeft.days) }}</div>
            <div class="text-xs text-gray-500">Дней</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ formatTime(timeLeft.hours) }}</div>
            <div class="text-xs text-gray-500">Часов</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ formatTime(timeLeft.minutes) }}</div>
            <div class="text-xs text-gray-500">Минут</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ formatTime(timeLeft.seconds) }}</div>
            <div class="text-xs text-gray-500">Секунд</div>
          </div>
        </div>
      </div>

      <!-- Даты сезона -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-500">Начало:</span>
          <div class="font-medium text-gray-900">
            {{ season.startDate.toLocaleDateString('ru-RU') }}
          </div>
        </div>
        <div>
          <span class="text-gray-500">Конец:</span>
          <div class="font-medium text-gray-900">
            {{ season.endDate.toLocaleDateString('ru-RU') }}
          </div>
        </div>
      </div>

      <!-- Награды сезона -->
      <div v-if="season.rewards && season.rewards.length > 0">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Награды сезона:</h4>
        <div class="space-y-2">
          <div
            v-for="reward in season.rewards.slice(0, 3)"
            :key="reward.rank"
            class="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900">#{{ reward.rank }}</span>
              <span class="text-xs text-gray-500">место</span>
            </div>
            <div class="text-sm text-gray-600">
              {{ reward.coins.toLocaleString() }} монет
            </div>
          </div>
          <div v-if="season.rewards.length > 3" class="text-xs text-gray-500 text-center">
            И еще {{ season.rewards.length - 3 }} наград...
          </div>
        </div>
      </div>
    </div>

    <!-- Заглушка если сезон не активен -->
    <div v-else class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Сезон не активен</h3>
      <p class="mt-1 text-sm text-gray-500">Ожидайте начала нового сезона</p>
    </div>
  </div>
</template> 