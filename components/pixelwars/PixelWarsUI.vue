<script setup lang="ts">
import SeasonProgress from "~/components/pixelwars/SeasonProgress.vue";
import ClanStats from "~/components/pixelwars/ClanStats.vue";

// Props для получения данных от родительского компонента
const props = defineProps<{
  selectedPixel: any;
  view: any;
  wsStatus: string;
  messageQueue: any[];
  isProcessingQueue: boolean;
  isCapturing: boolean;
  canCapturePixel: boolean;
  isSelectedPixelCaptured: boolean;
  currentSeason: any;
  currentClan: any;
  clanMembers: any[];
  isClanStatsExpanded: boolean;
}>();

// Emits для отправки событий родительскому компоненту
const emit = defineEmits<{
  'capture-pixel': [pixel: any];
  'connect-websocket': [];
  'disconnect-websocket': [];
  'toggle-clan-stats': [];
}>();

// Обработчики событий
const handleCapturePixel = (pixel: any) => {
  emit('capture-pixel', pixel);
};

const connectWebSocket = () => {
  emit('connect-websocket');
};

const disconnectWebSocket = () => {
  emit('disconnect-websocket');
};

const toggleClanStats = () => {
  emit('toggle-clan-stats');
};

const getSelectedPixelUser = () => {
  if (!props.selectedPixel || props.selectedPixel.type !== 'state') {
    return null;
  }
  return props.selectedPixel.ownerId;
};
</script>

<template>
  <div class="absolute top-1 left-1 flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20">
    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
      <span class="text-white font-bold text-sm">PW</span>
    </div>
    <div>
      <h1 class="text-lg font-bold text-gray-800">Pixel Wars</h1>
      <p class="text-xs text-gray-600">Захватывай пиксели!</p>
    </div>
  </div>

  <!-- Статус WebSocket -->
  <div class="absolute top-1 left-64 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20">
    <div class="flex items-center space-x-3">
      <div class="flex items-center space-x-2">
        <div :class="{
                'w-3 h-3 rounded-full': true,
                'bg-green-500': wsStatus === 'connected',
                'bg-yellow-500': wsStatus === 'connecting',
                'bg-red-500': wsStatus === 'error',
                'bg-gray-400': wsStatus === 'disconnected'
              }"></div>
        <span class="text-sm font-medium text-gray-700">
                {{ wsStatus === 'connected' ? 'Онлайн' :
            wsStatus === 'connecting' ? 'Подключение...' :
                wsStatus === 'error' ? 'Ошибка' : 'Оффлайн' }}
              </span>
      </div>

      <div class="flex space-x-2">
        <button
            @click="connectWebSocket"
            :disabled="wsStatus === 'connecting' || wsStatus === 'connected'"
            class="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Подключиться
        </button>
        <button
            @click="disconnectWebSocket"
            :disabled="wsStatus !== 'connected'"
            class="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Отключиться
        </button>
      </div>
    </div>

    <!-- Индикатор очереди сообщений -->
    <div v-if="wsStatus === 'connected'" class="text-xs text-gray-600">
      <div class="flex items-center justify-between">
        <span>Очередь: {{ messageQueue.length }} сообщений</span>
        <div v-if="isProcessingQueue" class="flex items-center space-x-1 text-blue-600">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Обработка...</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Прогресс сезона -->
  <div class="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20">
    <SeasonProgress :season="currentSeason || undefined" />
  </div>

  <!-- Левая панель с информацией о выбранном пикселе -->
  <div v-if="selectedPixel" class="absolute left-1 top-32 pointer-events-auto">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 max-w-xs">
      <div class="flex items-center space-x-2 mb-3">
        <div class="w-3 h-3 rounded-full" :class="{
            'bg-black': selectedPixel.type === 'border',
            'bg-green-500': selectedPixel.type === 'state',
            'bg-sky-500': selectedPixel.type === 'sea'
          }"></div>
        <h3 class="text-sm font-semibold text-gray-800">Выбранный пиксель</h3>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Координаты:</span>
          <span class="font-mono font-medium text-gray-800">({{ selectedPixel.x }}, {{ selectedPixel.y }})</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-600">Тип:</span>
          <span class="font-medium" :class="{
              'text-black': selectedPixel.type === 'border',
              'text-green-600': selectedPixel.type === 'state',
              'text-sky-600': selectedPixel.type === 'sea'
            }">
              {{ selectedPixel.type === 'border' ? 'Граница' :
              selectedPixel.type === 'state' ? 'Территория' : 'Вода' }}
            </span>
        </div>

        <!-- Информация о захвате для территорий -->
        <div v-if="selectedPixel.type === 'state'" class="pt-2 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Статус:</span>
            <span :class="isSelectedPixelCaptured ? 'text-green-600' : 'text-gray-500'" class="font-medium">
                {{ isSelectedPixelCaptured ? 'Захвачен' : 'Свободен' }}
              </span>
          </div>

          <div v-if="isSelectedPixelCaptured" class="text-xs text-gray-500 mt-1">
            ID: {{ getSelectedPixelUser() || 'Неизвестно' }}
          </div>
        </div>

        <!-- Кнопка захвата -->
        <button
            v-if="selectedPixel.type === 'state' && !isSelectedPixelCaptured"
            @click="handleCapturePixel(selectedPixel)"
            :disabled="!canCapturePixel || isCapturing"
            class="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg
              v-if="isCapturing"
              class="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ isCapturing ? 'Захватываем...' : 'Захватить пиксель' }}</span>
        </button>

        <!-- Индикатор успешного захвата -->
        <div v-if="isSelectedPixelCaptured" class="mt-2 text-sm text-green-600 flex items-center space-x-2 bg-green-50 p-2 rounded-lg">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>Пиксель захвачен!</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Правая панель с информацией о виде -->
  <div class="absolute right-1 bottom-1 pointer-events-auto">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
      <h3 class="text-sm font-semibold text-gray-800 mb-3">Навигация</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Масштаб:</span>
          <span class="font-mono font-medium text-gray-800">{{ view.scale.toFixed(2) }}x</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Позиция:</span>
          <span class="font-mono font-medium text-gray-800">({{ Math.round(view.panX) }}, {{ Math.round(view.panY) }})</span>
        </div>
      </div>

      <div class="mt-3 pt-3 border-t border-gray-200">
        <button class="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
          Сбросить вид
        </button>
      </div>
    </div>
  </div>

  <!-- Нижняя панель со статистикой клана -->
  <div class="absolute bottom-1 left-1 pointer-events-auto">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
      <ClanStats
          :clan="currentClan || undefined"
          :members="clanMembers"
          :is-expanded="isClanStatsExpanded"
          @toggle-expand="toggleClanStats"
      />
    </div>
  </div>

  <!-- Информационная панель в центре (только при загрузке) -->
  <div v-if="false" class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Pixel Wars</h2>
      <p class="text-gray-600">Захватывай пиксели и доминируй на карте!</p>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили для анимаций */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Плавные переходы для всех элементов */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>