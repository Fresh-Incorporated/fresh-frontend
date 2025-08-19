<script setup lang="ts">
import PixelWarsMap from "~/components/pixelwars/PixelWarsMap.vue";
import ClanStats from "~/components/pixelwars/ClanStats.vue";
import SeasonProgress from "~/components/pixelwars/SeasonProgress.vue";
import {computed, nextTick, onMounted, ref} from "vue";
import {http} from "~/composables/useHttp";
import type {BasePixel, Clan, GameSeason, Player, ViewState} from "~/types/pixelwars";

const view = ref<ViewState>({
  scale: 1,
  panX: 0,
  panY: 0
});

const borderPixels = ref<BasePixel[]>([]);
const statePixels = ref<BasePixel[]>([]);
const selectedPixel = ref<BasePixel | null>(null);
const isCapturing = ref(false);

// Игровые данные
const currentClan = ref<Clan | null>(null);
const clanMembers = ref<Player[]>([]);
const currentSeason = ref<GameSeason | null>(null);
const isClanStatsExpanded = ref(false);

// WebSocket
const ws = ref<WebSocket | null>(null);
const wsStatus = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

const connectWebSocket = () => {
  try {
    const wsUrl = import.meta.dev ? "ws://localhost:3000/pixelwars/ws" : "wss://api.fresh.zaralx.ru/pixelwars/ws";
    ws.value = new WebSocket(wsUrl);
    wsStatus.value = 'connecting';
    
    ws.value.onopen = () => {
      console.log('WebSocket connected');
      wsStatus.value = 'connected';
    };
    
    ws.value.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      wsStatus.value = 'disconnected';
    };
    
    ws.value.onerror = (event) => {
      console.error('WebSocket error:', event);
      wsStatus.value = 'error';
    };
    
    ws.value.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
    wsStatus.value = 'error';
  }
};

const disconnectWebSocket = () => {
  if (ws.value) {
    ws.value.close();
    ws.value = null;
    wsStatus.value = 'disconnected';
  }
};

// Статистика
const stats = ref({
  totalPixels: 0,
  borderPixels: 0,
  statePixels: 0,
  capturedPixels: 0,
  lastUpdated: null as Date | null
});

// Загрузка карты
const isLoading = ref(true);
const loadMap = async () => {
  try {
    isLoading.value = true;
    const response = await http.get("/pixelwars/map");
    borderPixels.value = response.data.borderPixels || [];
    statePixels.value = response.data.statePixels || [];

    // Отладочная информация о структуре данных
    if (statePixels.value.length > 0) {
      const samplePixel = statePixels.value[0];
      console.log("Пример state пикселя:", samplePixel);
      console.log("Поля пикселя:", Object.keys(samplePixel));
      console.log("Есть ли user поле:", 'user' in samplePixel);
      console.log("Значение user:", samplePixel.user);
    }


    console.log("Загруженные пиксели:", {
      border: borderPixels.value.length,
      state: statePixels.value.length
    });

    updateStats();
  } catch (error) {
    console.error("Failed to load map:", error);
  } finally {
    isLoading.value = false;
  }
};

// Загрузка данных клана
const loadClanData = async () => {
  try {
    // Здесь будет API вызов для загрузки данных клана
    // Пока используем моковые данные
    currentClan.value = {
      id: "1",
      name: "Pixel Warriors",
      tag: "PW",
      description: "Лучший клан в игре!",
      leaderId: "1",
      members: ["1", "2", "3"],
      totalPixels: 1500,
      totalCoins: 50000,
      totalExperience: 25000,
      level: 15,
      createdAt: new Date(),
      seasonRank: 3
    };

    clanMembers.value = [
      {
        id: "1",
        username: "Player1",
        clanId: "1",
        pixels: 500,
        maxPixels: 10,
        pixelsPerMinute: 1,
        coins: 15000,
        experience: 8000,
        level: 18,
        lastPixelRegeneration: new Date()
      },
      {
        id: "2",
        username: "Player2",
        clanId: "1",
        pixels: 400,
        maxPixels: 8,
        pixelsPerMinute: 1,
        coins: 12000,
        experience: 6000,
        level: 15,
        lastPixelRegeneration: new Date()
      }
    ];
  } catch (error) {
    console.error("Failed to load clan data:", error);
  }
};

// Загрузка данных сезона
const loadSeasonData = async () => {
  try {
    // Здесь будет API вызов для загрузки данных сезона
    // Пока используем моковые данные
    currentSeason.value = {
      id: "1",
      name: "Сезон 1: Начало",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-31"),
      isActive: true,
      rewards: [
        {rank: 1, coins: 100000, experience: 50000, specialRewards: ["Золотая корона"]},
        {rank: 2, coins: 75000, experience: 40000},
        {rank: 3, coins: 50000, experience: 30000}
      ]
    };
  } catch (error) {
    console.error("Failed to load season data:", error);
  }
};

// Обновление статистики с дебаунсингом
const updateStats = () => {
  const capturedPixelsCount = statePixels.value.filter(p => p.user?.id).length;

  stats.value = {
    totalPixels: borderPixels.value.length + statePixels.value.length,
    borderPixels: borderPixels.value.length,
    statePixels: statePixels.value.length,
    capturedPixels: capturedPixelsCount,
    lastUpdated: new Date()
  };
};

// Сброс к начальному виду
const resetView = () => {
  view.value = {
    scale: 1,
    panX: 0,
    panY: 0
  };
};

// Обработчики обновлений
const handleViewUpdate = (newView: ViewState) => {
  view.value = newView;
};

const handleSelectedPixelUpdate = (pixel: BasePixel | null) => {
  selectedPixel.value = pixel;
};

// Обработчик захвата пикселя
const handleCapturePixel = async (pixel: BasePixel) => {
  if (isCapturing.value) return;

  try {
    isCapturing.value = true;

    // Здесь будет вызов API для захвата пикселя
    // const response = await http.post("/pixelwars/capture", {
    //   x: pixel.x,
    //   y: pixel.y,
    //   type: pixel.type
    // });

    console.log("Захватываем пиксель:", pixel);

    // Проверяем, не захвачен ли уже этот пиксель
    const existingPixelIndex = statePixels.value.findIndex(p => p.x === pixel.x && p.y === pixel.y);

    if (existingPixelIndex >= 0) {
      // Если пиксель уже существует, обновляем его
      if (!statePixels.value[existingPixelIndex].user?.id) {
        statePixels.value[existingPixelIndex].user = {id: "current-user-id"};
        console.log("Обновили существующий пиксель:", statePixels.value[existingPixelIndex]);
      }
    } else {
      // Создаем новый state пиксель с пользователем
      const newStatePixel: BasePixel = {
        x: pixel.x,
        y: pixel.y,
        type: "state",
        user: {id: "current-user-id"} // Здесь будет ID текущего пользователя
      };

      // Добавляем в statePixels
      statePixels.value.push(newStatePixel);
      console.log("Добавили новый пиксель:", newStatePixel);
    }

    // Обновляем статистику
    updateStats();

    // Принудительно обновляем карту
    await nextTick();

  } catch (error) {
    console.error("Failed to capture pixel:", error);
  } finally {
    isCapturing.value = false;
  }
};

// Переключение панели клана
const toggleClanStats = () => {
  isClanStatsExpanded.value = !isClanStatsExpanded.value;
};

// Вычисляемые свойства
const canCapturePixel = computed(() => {
  // Здесь будет логика проверки возможности захвата пикселя
  // Например, проверка на то, что пиксель не принадлежит игроку
  return selectedPixel.value && !isCapturing.value;
});

const isSelectedPixelCaptured = computed(() => {
  if (!selectedPixel.value) return false;
  return statePixels.value.some(p => p.x === selectedPixel.value!.x && p.y === selectedPixel.value!.y && p.user?.id);
});

const getSelectedPixelUser = () => {
  if (!selectedPixel.value || selectedPixel.value.type !== 'state') {
    return null;
  }
  return selectedPixel.value.user;
};

// Подключение к WebSocket при монтировании компонента
onMounted(() => {
  loadMap();
  loadClanData();
  loadSeasonData();
  
  // Подключаемся к WebSocket
  connectWebSocket();
});

onBeforeUnmount(() => {
  // Отключаемся от WebSocket при размонтировании
  disconnectWebSocket();
});
</script>

<template>
  <div class="flex flex-col-reverse xl:flex-row xl:grid grid-cols-3 gap-2 p-2 h-[calc(100vh-200px)] ">
    <div class="w-full flex-1 lg:aspect-video col-span-2 bg-sky-200">
      <PixelWarsMap v-model:view="view" v-model:selected-pixel="selectedPixel" v-model:border-pixels="borderPixels"
                    v-model:state-pixels="statePixels"/>
    </div>

    <!-- Правая панель -->
    <div class="grid grid-cols-2 gap-2">
      <!-- Выбранный пиксель -->
      <div v-if="selectedPixel" class="bg-white rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Выбранный пиксель</h4>
        <div class="text-sm text-gray-900 space-y-2">
          <div>Координаты: ({{ selectedPixel.x }}, {{ selectedPixel.y }})</div>
          <div>Тип:
            <span :class="selectedPixel.type === 'border' ? 'text-black' : selectedPixel.type === 'state' ? 'text-green-600' : 'text-sky-600'">
                {{ selectedPixel.type === 'border' ? 'Граница' : selectedPixel.type === 'state' ? "Территория" : "Вода" }}
              </span>
          </div>

          <!-- Отладочная информация -->
          <div class="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            <div>Тип: {{ selectedPixel.type }}</div>
            <div>User: {{ selectedPixel.user ? JSON.stringify(selectedPixel.user) : 'null' }}</div>
            <div>Захвачен: {{ isSelectedPixelCaptured ? 'Да' : 'Нет' }}</div>
          </div>

          <!-- Информация о захвате -->
          <div v-if="selectedPixel.type === 'state'">
            <div>Статус:
              <span :class="isSelectedPixelCaptured ? 'text-green-600' : 'text-gray-500'">
                  {{ isSelectedPixelCaptured ? 'Захвачен' : 'Свободен' }}
                </span>
            </div>
            <div v-if="isSelectedPixelCaptured" class="text-xs text-gray-500">
              ID пользователя: {{ getSelectedPixelUser()?.id || 'Неизвестно' }}
            </div>
          </div>

          <!-- Кнопка захвата -->
          <button
              v-if="!isSelectedPixelCaptured"
              @click="handleCapturePixel(selectedPixel)"
              :disabled="!canCapturePixel"
              class="w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
          <div v-if="isSelectedPixelCaptured"
               class="mt-2 text-sm text-green-600 flex items-center space-x-1">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Пиксель захвачен!</span>
          </div>
        </div>
      </div>

      <!-- Состояние вида -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Состояние вида</h4>
        <div class="text-sm text-gray-900 space-y-1">
          <div>Масштаб: {{ view.scale.toFixed(2) }}x</div>
          <div>Смещение: ({{ Math.round(view.panX) }}, {{ Math.round(view.panY) }})</div>
        </div>
      </div>

      <!-- Статус WebSocket -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">WebSocket статус</h4>
        <div class="text-sm text-gray-900 space-y-1">
          <div class="flex items-center space-x-2">
            <span>Статус:</span>
            <span :class="{
              'text-green-600': wsStatus === 'connected',
              'text-yellow-600': wsStatus === 'connecting',
              'text-red-600': wsStatus === 'error',
              'text-gray-600': wsStatus === 'disconnected'
            }">
              {{ wsStatus === 'connected' ? 'Подключен' : 
                 wsStatus === 'connecting' ? 'Подключение...' :
                 wsStatus === 'error' ? 'Ошибка' : 'Отключен' }}
            </span>
          </div>
          <button 
            @click="connectWebSocket" 
            :disabled="wsStatus === 'connecting' || wsStatus === 'connected'"
            class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Подключиться
          </button>
          <button 
            @click="disconnectWebSocket" 
            :disabled="wsStatus !== 'connected'"
            class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
          >
            Отключиться
          </button>
        </div>
      </div>

      <!-- Прогресс сезона -->
      <SeasonProgress :season="currentSeason || undefined"/>

      <!-- Статистика клана -->
      <ClanStats
          :clan="currentClan || undefined"
          :members="clanMembers"
          :is-expanded="isClanStatsExpanded"
          @toggle-expand="toggleClanStats"
      />
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили если нужны */
</style>