<script setup lang="ts">
import { ref, onMounted } from "vue";
import {drawGrid, drawPixel} from "~/utils/pixelwars/CanvasUtils";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

interface BasePixel {
  x: Number
  y: Number
  type: "border" | "state"
}

const view = defineModel<{
  scale: Number,
  panX: Number,
  panY: Number
}>("view");

const selectedPixel = defineModel<BasePixel>("selected-pixel");

const borderPixels = defineModel<BasePixel[]>("border-pixels")

const statePixels = defineModel<BasePixel[]>("state-pixels")

let isDragging = false;
let lastX = 0;
let lastY = 0;

let pinchStartDist = 0;
let pinchStartScale = 1;

const initCanvas = () => {
  const canvas = canvasRef.value!;
  const rect = canvas.parentElement?.getBoundingClientRect();
  canvas.width = rect?.width || window.innerWidth;
  canvas.height = rect?.height || window.innerHeight;
  ctx.value = canvas.getContext("2d")!;
};

const screenToMap = (screenX: number, screenY: number) => {
  const step = 5 * view.value.scale; // cellSize = 5
  const mapX = Math.floor((screenX - view.value.panX) / step);
  const mapY = Math.floor((screenY - view.value.panY) / step);
  return { mapX, mapY };
};

const onClick = (e: MouseEvent) => {
  if (isDragging) return; // если тащили — не считать кликом
  const rect = canvasRef.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const { mapX, mapY } = screenToMap(x, y);

  selectedPixel.value = {
    x: mapX,
    y: mapY,
    type: "border" // можно менять в зависимости от режима
  };

  render();
};

const drawBorders = () => {
  for (const borderPixel of borderPixels.value) {
    drawPixel(ctx.value, view.value.scale, view.value.panX, view.value.panY, borderPixel.x, borderPixel.y)
  }
}

const drawStatePixels = () => {
  for (const statePixel of statePixels.value) {
    drawPixel(ctx.value, view.value.scale, view.value.panX, view.value.panY, statePixel.x, statePixel.y, 5, "#fff")
  }
}

const render = () => {
  if (!ctx.value) return;
  const { width, height } = ctx.value.canvas;
  ctx.value.clearRect(0, 0, width, height);
  if (view.value.scale > 1) {
    drawGrid(ctx.value, view.value.scale, view.value.panX, view.value.panY);
  }
  drawBorders()
  drawStatePixels()

  // TEMP
  if (selectedPixel.value) {
    drawPixel(
        ctx.value,
        view.value.scale,
        view.value.panX,
        view.value.panY,
        selectedPixel.value.x,
        selectedPixel.value.y,
        5,
        "rgba(255,0,0,0.5)" // полупрозрачный красный
    );
  }
};

const checkScaleLimit = (value: number) => {
  return value > 4 ? 4 : value < 0.2 ? 0.2 : value;
}

const onMouseDown = (e: MouseEvent) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
};
const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  view.value.panX += e.clientX - lastX;
  view.value.panY += e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  render();
};
const onMouseUp = () => {
  isDragging = false;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault(); // блокируем прокрутку страницы
  const zoomFactor = 1.05;
  view.value.scale *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
  view.value.scale = checkScaleLimit(view.value.scale);
  render();
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
    pinchStartScale = view.value.scale;
  }
};

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault(); // блокируем прокрутку
  if (e.touches.length === 1 && isDragging) {
    view.value.panX += e.touches[0].clientX - lastX;
    view.value.panY += e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    const dist = getTouchDist(e.touches);
    view.value.scale = pinchStartScale * (dist / pinchStartDist);
  }
  render();
};

const onTouchEnd = () => {
  isDragging = false;
};

onMounted(() => {
  // убираем прокрутку страницы
  document.body.style.overflow = "hidden";

  initCanvas();
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
