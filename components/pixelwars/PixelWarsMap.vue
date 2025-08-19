<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { drawGrid, drawPixel } from "~/utils/pixelwars/CanvasUtils";
import type { BasePixel } from "~/types/pixelwars";

const CELL_SIZE = 5;          // размер "пикселя" карты в экранных px при scale=1
const CHUNK_SIZE = 100;       // размер чанка в клетках
const GRID_MIN_STEP = 8;      // минимальный размер клетки на экране, при котором рисуем сетку
const LOD_RECT_THRESHOLD = 2; // если ширина чанка на экране < 2px — рисуем один прямоугольник

interface ViewState {
  scale: number;
  panX: number;
  panY: number;
}

const props = defineProps<{
  view: ViewState;
  selectedPixel: BasePixel | null;
  borderPixels: BasePixel[];
  statePixels: BasePixel[];
}>();

const emit = defineEmits<{
  'update:view': [value: ViewState];
  'update:selected-pixel': [value: BasePixel | null];
  'capture-pixel': [pixel: BasePixel];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

// Сервисные флаги ввода
let isDragging = false;
let lastX = 0;
let lastY = 0;
let pinchStartDist = 0;
let pinchStartScale = 1;
let needsRender = false;

// === Индексы и чанки ===
type ChunkMap = Map<string, BasePixel[]>;
const borderChunks: ChunkMap = new Map();
const stateChunks: ChunkMap = new Map();

// Кэш канвасов по чанкам (раздельно для слоёв)
const borderChunkCache: Map<string, HTMLCanvasElement> = new Map();
const stateChunkCache: Map<string, HTMLCanvasElement> = new Map();

// Быстрые индексы по координате
const borderIndex: Map<string, BasePixel> = new Map();
const stateIndex: Map<string, BasePixel> = new Map();

const keyXY = (x: number, y: number) => `${x},${y}`;
const chunkKey = (x: number, y: number) => {
  const cx = Math.floor(x / CHUNK_SIZE);
  const cy = Math.floor(y / CHUNK_SIZE);
  return `${cx},${cy}`;
};

// Инициализация холста
const initCanvas = () => {
  const canvas = canvasRef.value!;
  const rect = canvas.parentElement?.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const cssW = rect?.width || window.innerWidth;
  const cssH = rect?.height || window.innerHeight;

  // физический размер = css * dpr
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  const c = canvas.getContext("2d")!;
  c.setTransform(dpr, 0, 0, dpr, 0, 0); // масштабируем контекст под DPR
  ctx.value = c;
};

// Преобразование координат экрана в клетку карты
const screenToMap = (screenX: number, screenY: number) => {
  const step = CELL_SIZE * props.view.scale;
  const mapX = Math.floor((screenX - props.view.panX) / step);
  const mapY = Math.floor((screenY - props.view.panY) / step);
  return { mapX, mapY };
};

// Построение индексов и чанков
function rebuildIndicesAndChunks() {
  borderChunks.clear();
  stateChunks.clear();
  borderIndex.clear();
  stateIndex.clear();
  borderChunkCache.clear();
  stateChunkCache.clear();

  console.log("Перестраиваем индексы:", {
    borderPixels: props.borderPixels.length,
    statePixels: props.statePixels.length
  });

  for (const p of props.borderPixels) {
    borderIndex.set(keyXY(p.x, p.y), p);
    const ck = chunkKey(p.x, p.y);
    if (!borderChunks.has(ck)) borderChunks.set(ck, []);
    borderChunks.get(ck)!.push(p);
  }
  for (const p of props.statePixels) {
    stateIndex.set(keyXY(p.x, p.y), p);
    const ck = chunkKey(p.x, p.y);
    if (!stateChunks.has(ck)) stateChunks.set(ck, []);
    stateChunks.get(ck)!.push(p);
  }
  
  console.log("Индексы построены:", {
    borderChunks: borderChunks.size,
    stateChunks: stateChunks.size,
    borderIndex: borderIndex.size,
    stateIndex: stateIndex.size
  });
}

// Инвалидация кэша чанка
function invalidateChunkCacheForXY(x: number, y: number) {
  const ck = chunkKey(x, y);
  borderChunkCache.delete(ck);
  stateChunkCache.delete(ck);
}

// Получить/создать отрисованный кэш-канвас чанка
function getChunkCanvas(
    layer: "border" | "state",
    ck: string,
    list: BasePixel[]
): HTMLCanvasElement {
  const cache = layer === "border" ? borderChunkCache : stateChunkCache;
  if (cache.has(ck)) return cache.get(ck)!;

  // Размер чанка в базовых пикселях (CELL_SIZE)
  const w = CHUNK_SIZE * CELL_SIZE;
  const h = CHUNK_SIZE * CELL_SIZE;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const offctx = off.getContext("2d")!;
  offctx.imageSmoothingEnabled = false;

  if (layer === "border") {
    // Границы всегда черные
    offctx.fillStyle = "#000";
    for (const p of list) {
      const lx = ((p.x % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE) * CELL_SIZE;
      const ly = ((p.y % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE) * CELL_SIZE;
      offctx.fillRect(lx, ly, CELL_SIZE, CELL_SIZE);
    }
  } else {
    // State пиксели: белые если не захвачены, зеленые если захвачены
    console.log(`Создаем канвас для state чанка ${ck}:`, {
      totalPixels: list.length,
      capturedPixels: list.filter(p => p.user?.id).length,
      freePixels: list.filter(p => !p.user?.id).length,
      samplePixel: list[0] ? Object.keys(list[0]) : 'нет пикселей'
    });
    
    for (const p of list) {
      const lx = ((p.x % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE) * CELL_SIZE;
      const ly = ((p.y % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE) * CELL_SIZE;
      
      // Проверяем различные возможные поля для определения захвата
      const isCaptured = p.user?.id || (p as any).playerId || (p as any).ownerId || (p as any).captured;
      
      if (isCaptured) {
        // Захваченный пиксель - зеленый
        offctx.fillStyle = "#22C55E";
        console.log(`Пиксель (${p.x}, ${p.y}) - зеленый (захвачен)`, { user: p.user, playerId: (p as any).playerId, ownerId: (p as any).ownerId, captured: (p as any).captured });
      } else {
        // Свободный пиксель - белый
        offctx.fillStyle = "#FFFFFF";
        console.log(`Пиксель (${p.x}, ${p.y}) - белый (свободен)`, { user: p.user, playerId: (p as any).playerId, ownerId: (p as any).ownerId, captured: (p as any).captured });
      }
      
      offctx.fillRect(lx, ly, CELL_SIZE, CELL_SIZE);
    }
  }

  cache.set(ck, off);
  return off;
}

// Адаптивный рендер слоя (LOD + кэш)
function renderLayer(chunks: ChunkMap, layer: "border" | "state") {
  const c = ctx.value!;
  const { width, height } = c.canvas;
  const cssW = width / (window.devicePixelRatio || 1);
  const cssH = height / (window.devicePixelRatio || 1);

  const step = CELL_SIZE * props.view.scale;
  const chunkPxW = CHUNK_SIZE * step; // ширина чанка на экране (в CSS px)

  // Вычисляем диапазон видимых чанков
  const startX = Math.floor((-props.view.panX) / step / CHUNK_SIZE) - 1;
  const startY = Math.floor((-props.view.panY) / step / CHUNK_SIZE) - 1;
  const endX = Math.ceil((cssW - props.view.panX) / step / CHUNK_SIZE) + 1;
  const endY = Math.ceil((cssH - props.view.panY) / step / CHUNK_SIZE) + 1;

  // Режим сверх-LOD: один прямоугольник на чанк (очень быстро)
  if (chunkPxW < LOD_RECT_THRESHOLD) {
    c.save();
    c.globalAlpha = 1;
    c.imageSmoothingEnabled = false;

    for (let cx = startX; cx <= endX; cx++) {
      for (let cy = startY; cy <= endY; cy++) {
        const ck = `${cx},${cy}`;
        const list = chunks.get(ck);
        if (!list || list.length === 0) continue;

        // Плотность пикселей внутри чанка (для альфы)
        const density = list.length / (CHUNK_SIZE * CHUNK_SIZE);
        const alpha = Math.min(0.9, Math.max(0.12, density * 0.9)); // 0.12..0.9
        c.globalAlpha = alpha;

        const dx = cx * CHUNK_SIZE * step + props.view.panX;
        const dy = cy * CHUNK_SIZE * step + props.view.panY;

        if (layer === "border") {
          // Границы всегда черные
          c.fillStyle = "#000";
        } else {
          // State пиксели: смешанный цвет в зависимости от захвата
          const capturedCount = list.filter(p => p.user?.id || (p as any).playerId || (p as any).ownerId || (p as any).captured).length;
          const totalCount = list.length;
          
          if (capturedCount === 0) {
            // Все свободные - белый
            c.fillStyle = "#FFFFFF";
          } else if (capturedCount === totalCount) {
            // Все захвачены - зеленый
            c.fillStyle = "#22C55E";
          } else {
            // Смешанные - светло-зеленый
            c.fillStyle = "#86EFAC";
          }
        }

        // рисуем один прямоугольник размера чанка
        c.fillRect(dx, dy, chunkPxW, chunkPxW);
      }
    }
    c.restore();
    return;
  }

  // Стандартный режим: тянем кэш-канвасы чанков
  c.save();
  c.imageSmoothingEnabled = false;
  for (let cx = startX; cx <= endX; cx++) {
    for (let cy = startY; cy <= endY; cy++) {
      const ck = `${cx},${cy}`;
      const list = chunks.get(ck);
      if (!list || list.length === 0) continue;

      const dx = cx * CHUNK_SIZE * step + props.view.panX;
      const dy = cy * CHUNK_SIZE * step + props.view.panY;

      const off = getChunkCanvas(layer, ck, list);
      c.drawImage(off, dx, dy, CHUNK_SIZE * step, CHUNK_SIZE * step);
    }
  }
  c.restore();
}

// Главный рендер
const render = () => {
  if (!ctx.value) return;
  const c = ctx.value;
  const { width, height } = c.canvas;
  const cssW = width / (window.devicePixelRatio || 1);
  const cssH = height / (window.devicePixelRatio || 1);

  c.clearRect(0, 0, cssW, cssH);

  // Сетка — только когда клетки достаточно крупные
  const step = CELL_SIZE * props.view.scale;
  if (step >= GRID_MIN_STEP) {
    drawGrid(c, props.view.scale, props.view.panX, props.view.panY, CELL_SIZE);
  }

  console.log("Рендерим слои:", {
    borderChunks: borderChunks.size,
    stateChunks: stateChunks.size
  });

  // Слои
  renderLayer(borderChunks, "border");
  renderLayer(stateChunks, "state");

  // Выделение
  if (props.selectedPixel) {
    drawPixel(
        c,
        props.view.scale,
        props.view.panX,
        props.view.panY,
        props.selectedPixel.x,
        props.selectedPixel.y,
        CELL_SIZE,
        "rgba(255,0,0,0.5)"
    );
  }
};

const scheduleRender = () => {
  if (!needsRender) {
    needsRender = true;
    requestAnimationFrame(() => {
      render();
      needsRender = false;
    });
  }
};

const checkScaleLimit = (value: number) => {
  // Разрешаем очень маленькие масштабы, LOD справится
  return value > 6 ? 6 : value < 0.1 ? 0.1 : value;
};

// === Инструменты / редактирование ===
function getPixelAt(x: number, y: number): BasePixel | null {
  return borderIndex.get(keyXY(x, y)) || stateIndex.get(keyXY(x, y)) || null;
}

// Метод для захвата пикселя (будет подключен к endpoint)
function capturePixel(x: number, y: number) {
  const pixel = getPixelAt(x, y);
  if (pixel) {
    // Здесь будет вызов API для захвата пикселя
    emit('capture-pixel', pixel);
  }
}

function handlePixelClick(mapX: number, mapY: number) {
  const found = getPixelAt(mapX, mapY);
  if (found) {
    emit('update:selected-pixel', { ...found });
  } else {
    emit('update:selected-pixel', { x: mapX, y: mapY, type: "sea" });
  }
  scheduleRender();
}

// === События ===
const onClick = (e: MouseEvent) => {
  if (isDragging) return;
  const rect = canvasRef.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const { mapX, mapY } = screenToMap(x, y);
  handlePixelClick(mapX, mapY);
};

const onMouseDown = (e: MouseEvent) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  const newView = { ...props.view };
  newView.panX += e.clientX - lastX;
  newView.panY += e.clientY - lastY;
  emit('update:view', newView);
  
  lastX = e.clientX;
  lastY = e.clientY;
  scheduleRender();
};

const onMouseUp = () => {
  isDragging = false;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  const rect = canvasRef.value!.getBoundingClientRect();
  // Зум относительно курсора
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const before = screenToMap(mx, my);

  const zoom = e.deltaY < 0 ? 1.05 : 1 / 1.05;
  const newView = { ...props.view };
  newView.scale = checkScaleLimit(newView.scale * zoom);

  // сохраняем точку под курсором
  const step = CELL_SIZE * newView.scale;
  newView.panX = mx - before.mapX * step;
  newView.panY = my - before.mapY * step;
  
  emit('update:view', newView);
  scheduleRender();
};

const getTouchDist = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    isDragging = false;
    pinchStartDist = getTouchDist(e.touches);
    pinchStartScale = props.view.scale;
  }
};

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  const newView = { ...props.view };
  
  if (e.touches.length === 1 && isDragging) {
    newView.panX += e.touches[0].clientX - lastX;
    newView.panY += e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    emit('update:view', newView);
  } else if (e.touches.length === 2) {
    const rect = canvasRef.value!.getBoundingClientRect();
    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
    const before = screenToMap(centerX, centerY);

    const dist = getTouchDist(e.touches);
    newView.scale = checkScaleLimit(pinchStartScale * (dist / pinchStartDist));

    const step = CELL_SIZE * newView.scale;
    newView.panX = centerX - before.mapX * step;
    newView.panY = centerY - before.mapY * step;
    
    emit('update:view', newView);
  }
  scheduleRender();
};

const onTouchEnd = () => {
  isDragging = false;
};

// Монтирование
onMounted(() => {
  document.body.style.overflow = "hidden";
  initCanvas();
  rebuildIndicesAndChunks();
  render();

  const canvas = canvasRef.value!;
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("click", onClick);

  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd);
});

onBeforeUnmount(() => {
  const canvas = canvasRef.value!;
  canvas?.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  canvas?.removeEventListener("wheel", onWheel);
  canvas?.removeEventListener("click", onClick);

  canvas?.removeEventListener("touchstart", onTouchStart);
  canvas?.removeEventListener("touchmove", onTouchMove);
  canvas?.removeEventListener("touchend", onTouchEnd);
});

// Если снаружи полностью заменили массивы, перестроим индексы/чанки/кэш
watch([() => props.borderPixels, () => props.statePixels], () => {
  rebuildIndicesAndChunks();
  scheduleRender();
}, { deep: true });
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>

<style scoped>
canvas {
  touch-action: none;
  display: block;
}
</style>
