<script setup lang="ts">
import { ref, onMounted } from "vue";

const branchs = [
  {
    name: "Филиал №1",
    cords: [
      {
        world: "nether",
        x: 100,
        y: 64,
        z: 50
      }
    ]
  },
  {
    name: "Филиал №2",
    cords: [
      {
        world: "nether",
        x: 10,
        y: 64,
        z: -50
      }
    ]
  },
  {
    name: "Филиал №3",
    cords: [
      {
        world: "nether",
        x: -10,
        y: 64,
        z: -40
      }
    ]
  }
]

// Настройки для канваса
const canvasRef = ref<HTMLCanvasElement | null>(null);
const scale = ref(5); // Масштаб камеры
const offsetX = ref(0); // Сдвиг камеры по X
const offsetY = ref(0); // Сдвиг камеры по Y

let isPanning = false; // Состояние перемещения камеры
let lastMouseX = 0;
let lastMouseY = 0;

const draw = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Очистка канваса
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Центр канваса
  const centerX = canvas.width / 2 + offsetX.value;
  const centerY = canvas.height / 2 + offsetY.value;

  // Масштабирование
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale.value, scale.value);
  ctx.translate(-centerX, -centerY);

  // Рисуем оси
  ctx.strokeStyle = "#43AF68"; // Линия X положительная
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  ctx.strokeStyle = "#4277FF"; // Линия X отрицательная
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(0, centerY);
  ctx.stroke();

  ctx.strokeStyle = "#FFBD3E"; // Линия Y положительная
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();

  ctx.strokeStyle = "#FF5353"; // Линия Y отрицательная
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, 0);
  ctx.stroke();

  // Круг
  ctx.beginPath();
  ctx.fillStyle = "#7A494A";
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Филиалы
  // Филиалы
  for (const branch of branchs) {
    const netherCords = branch.cords.find(cord => cord.world === "nether");
    if (!netherCords) continue;

    // Координаты точки филиала относительно центра
    const branchX = centerX + netherCords.x;
    const branchY = centerY + netherCords.z;

    // Определение расстояний до осей
    const distToX = Math.abs(netherCords.z); // Расстояние до оси X (горизонтальной)
    const distToY = Math.abs(netherCords.x); // Расстояние до оси Y (вертикальной)

    // Определение ближайшей оси и её цвета
    let closestAxis = "x"; // По умолчанию X
    let lineColor = distToX < distToY ? (netherCords.z > 0 ? "#43AF68" : "#FFBD3E") : (netherCords.x > 0 ? "#FF5353" : "#4277FF");

    // Отрисовка линии к ближайшей оси
    ctx.beginPath();
    ctx.strokeStyle = lineColor;

    if (distToX < distToY) {
      // Ближайшая ось — X (горизонтальная)
      ctx.moveTo(branchX, branchY);
      ctx.lineTo(branchX, centerY); // Вертикальная линия к оси X
    } else {
      // Ближайшая ось — Y (вертикальная)
      ctx.moveTo(branchX, branchY);
      ctx.lineTo(centerX, branchY); // Горизонтальная линия к оси Y
    }
    ctx.stroke();

    // Отрисовка точки филиала
    ctx.beginPath();
    ctx.fillStyle = lineColor;
    ctx.arc(branchX, branchY, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "3px montserrat";
    ctx.fillText(branch.name, branchX - (branch.name.length * 0.8), branchY - 3);
  }


  ctx.restore();
};

// Обновление размеров канваса
const updateCanvasSize = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;

  // Устанавливаем реальный размер канваса в соответствии с его CSS-выражением
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  draw();
};

// Настройка масштабирования камеры
const onWheel = (event: WheelEvent) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  const mouseX = event.offsetX - canvasRef.value!.width / 2 - offsetX.value;
  const mouseY = event.offsetY - canvasRef.value!.height / 2 - offsetY.value;

  const scaleDelta = Math.exp(delta);
  scale.value *= scaleDelta;

  if (scale.value > 10) scale.value = 10;
  if (scale.value < 5) scale.value = 5;

  offsetX.value -= mouseX * (scaleDelta - 1);
  offsetY.value -= mouseY * (scaleDelta - 1);

  draw();
};

// Перемещение камеры
const onMouseDown = (event: MouseEvent) => {
  isPanning = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
};

const onMouseMove = (event: MouseEvent) => {
  logCoordinates(event);
  if (!isPanning) return;
  const dx = event.clientX - lastMouseX;
  const dy = event.clientY - lastMouseY;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  offsetX.value += dx;
  offsetY.value += dy;

  draw();
};

const logCoordinates = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left - canvas.width / 2 - offsetX.value) / scale.value;
  const mouseY = (event.clientY - rect.top - canvas.height / 2 - offsetY.value) / scale.value;

  console.log(`Координаты относительно круга: X: ${mouseX.toFixed(2)}, Y: ${mouseY.toFixed(2)}`);
};

const onMouseUp = () => {
  isPanning = false;
};

onMounted(() => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;

  updateCanvasSize();

  const context = canvas.getContext("2d");
  if (context) draw();

  window.addEventListener("resize", updateCanvasSize);
  canvas.addEventListener("wheel", onWheel);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseout", onMouseUp);
});
</script>

<template>
  <div class="fixed top-0 left-0 z-30 w-screen h-screen bg-neutral-950">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
