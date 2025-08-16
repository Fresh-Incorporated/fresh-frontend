<script setup lang="ts">
import PixelWarsMap from "~/components/pixelwars/PixelWarsMap.vue";
import ClanStats from "~/components/pixelwars/ClanStats.vue";
import SeasonProgress from "~/components/pixelwars/SeasonProgress.vue";
import { ref, onMounted, computed, nextTick } from "vue";
import { http } from "~/composables/useHttp";
import type { ViewState, BasePixel, Clan, Player, GameSeason } from "~/types/pixelwars";

const view = ref<ViewState>({
  scale: 1,
  panX: 0,
  panY: 0
});

const borderPixels = ref<BasePixel[]>([]);
const statePixels = ref<BasePixel[]>([]);
const selectedPixel = ref<BasePixel | null>(null);
const capturedPixels = ref<BasePixel[]>([]); // Захваченные пиксели
const isCapturing = ref(false);

// Оптимизация: ограничиваем количество отображаемых захваченных пикселей
const maxDisplayedCapturedPixels = 1000;

// Вычисляемое свойство для оптимизированного отображения
const optimizedCapturedPixels = computed(() => {
  if (capturedPixels.value.length <= maxDisplayedCapturedPixels) {
    return capturedPixels.value;
  }
  
  // Если пикселей много, берем только последние добавленные
  return capturedPixels.value.slice(-maxDisplayedCapturedPixels);
});

// Игровые данные
const currentClan = ref<Clan | null>(null);
const clanMembers = ref<Player[]>([]);
const currentSeason = ref<GameSeason | null>(null);
const isClanStatsExpanded = ref(false);

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
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-31"),
      isActive: true,
      rewards: [
        { rank: 1, coins: 100000, experience: 50000, specialRewards: ["Золотая корона"] },
        { rank: 2, coins: 75000, experience: 40000 },
        { rank: 3, coins: 50000, experience: 30000 }
      ]
    };
  } catch (error) {
    console.error("Failed to load season data:", error);
  }
};

// Обновление статистики с дебаунсингом
const updateStats = () => {
  stats.value = {
    totalPixels: borderPixels.value.length + statePixels.value.length,
    borderPixels: borderPixels.value.length,
    statePixels: statePixels.value.length,
    capturedPixels: capturedPixels.value.length,
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
    const alreadyCaptured = capturedPixels.value.some(p => p.x === pixel.x && p.y === pixel.y);
    if (!alreadyCaptured) {
      const newCapturedPixel: BasePixel = {
        x: pixel.x,
        y: pixel.y,
        type: pixel.type
      };
      
      // Простое добавление в массив
      capturedPixels.value.push(newCapturedPixel);
      
      // Обновляем статистику
      updateStats();
      
      // Принудительно обновляем карту
      await nextTick();
    }
    
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
  return capturedPixels.value.some(p => p.x === selectedPixel.value!.x && p.y === selectedPixel.value!.y);
});

onMounted(() => {
  loadMap();
  loadClanData();
  loadSeasonData();
});

onBeforeUnmount(() => {
});
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-200px)]">
    <!-- Панель инструментов -->
    <div class="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <h2 class="text-lg font-semibold text-gray-900">Pixel Wars</h2>
        <span class="text-sm text-gray-500">Выберите пиксель на карте для захвата</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <button
          @click="resetView"
          class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Сброс вида
        </button>
        <button
          @click="loadMap"
          :disabled="isLoading"
          class="px-3 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? 'Загрузка...' : 'Обновить' }}
        </button>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="flex flex-1 gap-4 p-4">
      <!-- Карта -->
      <div class="flex-1 bg-sky-100 rounded-lg overflow-hidden">
        <PixelWarsMap 
          :view="view"
          :selected-pixel="selectedPixel"
          :border-pixels="borderPixels"
          :state-pixels="statePixels"
          :captured-pixels="optimizedCapturedPixels"
          @update:view="handleViewUpdate"
          @update:selected-pixel="handleSelectedPixelUpdate"
          @capture-pixel="handleCapturePixel"
        />
      </div>

      <!-- Правая панель -->
      <div class="w-80 space-y-4">
        <!-- Информация о карте -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Информация о карте</h3>
          
          <!-- Статистика -->
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Всего пикселей:</span>
              <span class="font-medium">{{ stats.totalPixels }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Границы:</span>
              <span class="font-medium">{{ stats.borderPixels }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Территория:</span>
              <span class="font-medium">{{ stats.statePixels }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Захвачено:</span>
              <span class="font-medium text-green-600">{{ stats.capturedPixels }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Обновлено:</span>
              <span class="font-medium text-sm">
                {{ stats.lastUpdated ? stats.lastUpdated.toLocaleTimeString() : 'Не загружено' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Выбранный пиксель -->
        <div v-if="selectedPixel" class="bg-white rounded-lg border border-gray-200 p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Выбранный пиксель</h4>
          <div class="text-sm text-gray-900 space-y-2">
            <div>Координаты: ({{ selectedPixel.x }}, {{ selectedPixel.y }})</div>
            <div>Тип: 
              <span :class="selectedPixel.type === 'border' ? 'text-black' : 'text-sky-600'">
                {{ selectedPixel.type === 'border' ? 'Граница' : 'Территория' }}
              </span>
            </div>
            
            <!-- Кнопка захвата -->
            <button
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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

        <!-- Прогресс сезона -->
        <SeasonProgress :season="currentSeason || undefined" />

        <!-- Статистика клана -->
        <ClanStats 
          :clan="currentClan || undefined"
          :members="clanMembers"
          :is-expanded="isClanStatsExpanded"
          @toggle-expand="toggleClanStats"
        />

        <!-- Инструкции -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Управление</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <div>• ЛКМ + перетаскивание - перемещение карты</div>
            <div>• Колесо мыши - масштабирование</div>
            <div>• ЛКМ по пикселю - выбор для захвата</div>
            <div>• Касание + перетаскивание - мобильное управление</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили если нужны */
</style>