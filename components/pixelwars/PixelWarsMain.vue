<script setup lang="ts">
import PixelWarsMap from "~/components/pixelwars/PixelWarsMap.vue";
import PixelWarsClan from "~/components/pixelwars/PixelWarsClan.vue";
import SeasonProgress from "~/components/pixelwars/SeasonProgress.vue";
import PixelWarsCreateClan from "~/components/pixelwars/PixelWarsCreateClan.vue";
import PixelWarsClans from "~/components/pixelwars/PixelWarsClans.vue";
import {computed, nextTick, onMounted, onBeforeUnmount, ref} from "vue";
import {http} from "~/composables/useHttp";
import type {BasePixel, Clan, GameSeason, Player, ViewState} from "~/types/pixelwars";
import {toast} from "vue-sonner";
import PixelWarsUI from "~/components/pixelwars/PixelWarsUI.vue";
import PixelWarsWelcome from "~/components/pixelwars/PixelWarsWelcome.vue";

const { updatePixelWarsClans } = useUser()

const view = ref<ViewState>({
  scale: 0.25,
  panX: -4,
  panY: 58
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

// Очередь сообщений для предотвращения блокировки UI
const messageQueue = ref<Array<{type: string, x: number, y: number, ownerId?: string}>>([]);
const isProcessingQueue = ref(false);

// Обработка очереди сообщений
const processMessageQueue = async () => {
  if (isProcessingQueue.value || messageQueue.value.length === 0) return;
  
  isProcessingQueue.value = true;
  
  // Обрабатываем сообщения пакетами для предотвращения блокировки
  const batchSize = 10;
  const batch = messageQueue.value.splice(0, batchSize);
  
  for (const message of batch) {
    if (message.type === "pixel_placed") {
      const pixelIndex = statePixels.value.findIndex(p => p.x === message.x && p.y === message.y);
      if (pixelIndex !== -1) {
        const pixel = statePixels.value[pixelIndex];
        if (pixel) {
          pixel.ownerId = message.ownerId ? parseInt(message.ownerId) : undefined;
          
          // Быстро обновляем пиксель на карте
          if (mapRef.value) {
            mapRef.value.updatePixelQuickly(message.x, message.y, pixel.ownerId ?? null);
          }
        }
      }
    }
    
    // Небольшая задержка между обработкой сообщений для предотвращения блокировки
    if (batch.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  isProcessingQueue.value = false;
  
  // Если в очереди еще есть сообщения, продолжаем обработку
  if (messageQueue.value.length > 0) {
    setTimeout(processMessageQueue, 16); // ~60fps
  }
};

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mapRef = ref<InstanceType<typeof PixelWarsMap> | null>(null);

const emit = defineEmits<{
  'pixel-updated': [data: { x: number; y: number; user: { id: string } | null }];
}>();

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
      const response = JSON.parse(event.data)
      console.log('WebSocket message received:', response);

      if (response.type == "error") {
        toast.error('Произошла ошибка', {
          description: response?.message,
          duration: 5000,
        })
      } else if (response.type == "pixel_placed") {
        // Добавляем сообщение в очередь для асинхронной обработки
        messageQueue.value.push({
          type: response.type,
          x: response.x,
          y: response.y,
          ownerId: response.ownerId
        });
        
        // Запускаем обработку очереди если она еще не запущена
        if (!isProcessingQueue.value) {
          processMessageQueue();
        }
      }
    };
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
    wsStatus.value = 'error';
  }
};

const sendWebsocket = (data: Object) => {
  if (!ws.value) return;
  ws.value.send(JSON.stringify(data))
}

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
    
    // Обрабатываем данные асинхронно для предотвращения блокировки UI
    await nextTick();
    
    borderPixels.value = response.data.borderPixels || [];
    statePixels.value = response.data.statePixels || [];

    // Отладочная информация о структуре данных
    if (statePixels.value.length > 0) {
      const samplePixel = statePixels.value[0];
      console.log("Пример state пикселя:", samplePixel);
      console.log("Поля пикселя:", Object.keys(samplePixel));
      console.log("Есть ли user поле:", 'user' in samplePixel);
      console.log("Значение user:", samplePixel.ownerId);
    }

    console.log("Загруженные пиксели:", {
      border: borderPixels.value.length,
      state: statePixels.value.length
    });

    // Обновляем статистику асинхронно
    await nextTick();
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

    sendWebsocket({type: "pixel_place", x: pixel.x, y: pixel.y})

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

const isSelectedPixelCaptured = computed((): boolean => {
  if (!selectedPixel.value) return false;
  const found = statePixels.value.some(p => p.x === selectedPixel.value!.x && p.y === selectedPixel.value!.y && p.ownerId);
  return Boolean(found);
});

const getSelectedPixelUser = () => {
  if (!selectedPixel.value || selectedPixel.value.type !== 'state') {
    return null;
  }
  return selectedPixel.value.ownerId;
};

// Подключение к WebSocket при монтировании компонента
onMounted(() => {
  loadMap();
  loadClanData();
  loadSeasonData();
  updatePixelWarsClans();
  
  // Подключаемся к WebSocket
  connectWebSocket();
});

onBeforeUnmount(() => {
  // Отключаемся от WebSocket при размонтировании
  disconnectWebSocket();
  
  // Очищаем очередь сообщений
  messageQueue.value = [];
});
</script>

<template>
  <div class="h-[calc(100vh-56px)] relative">
    <div class="w-full bg-sky-200 relative">
      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div class="text-gray-600">Загружаем карту...</div>
        </div>
      </div>
      
      <PixelWarsMap 
        ref="mapRef"
        v-model:view="view" 
        v-model:selected-pixel="selectedPixel" 
        v-model:border-pixels="borderPixels"
        v-model:state-pixels="statePixels"
      />
    </div>

    <PixelWarsUI
      v-if="!isLoading"
      :selected-pixel="selectedPixel"
      :view="view"
      :ws-status="wsStatus"
      :message-queue="messageQueue"
      :is-processing-queue="isProcessingQueue"
      :is-capturing="isCapturing"
      :can-capture-pixel="Boolean(canCapturePixel)"
      :is-selected-pixel-captured="Boolean(isSelectedPixelCaptured)"
      :current-season="currentSeason"
      :current-clan="currentClan"
      :clan-members="clanMembers"
      :is-clan-stats-expanded="isClanStatsExpanded"
      @capture-pixel="handleCapturePixel"
      @connect-websocket="connectWebSocket"
      @disconnect-websocket="disconnectWebSocket"
      @toggle-clan-stats="toggleClanStats"
    />

    <!-- Модальные окна кланов -->
<!--    <PixelWarsCreateClan>-->
<!--      <ShButton -->
<!--        variant="outline" -->
<!--        class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"-->
<!--      >-->
<!--        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />-->
<!--        </svg>-->
<!--        Создать клан-->
<!--      </ShButton>-->
<!--    </PixelWarsCreateClan>-->

    <PixelWarsClans>
      <ShButton 
        variant="outline" 
        class="absolute left-1 bottom-82 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Список кланов
      </ShButton>
    </PixelWarsClans>
  </div>
</template>

<style scoped>
</style>