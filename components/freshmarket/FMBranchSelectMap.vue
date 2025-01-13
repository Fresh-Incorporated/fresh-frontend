<script setup lang="ts">
import { ref, onMounted } from "vue";

const opened = defineModel("opened")
const branch = defineModel("branch")

const props = defineProps({
  branchs: Array<Object>,
})

// Настройки для канваса
const canvasRef = ref<HTMLCanvasElement | null>(null);
const scale = ref(5); // Масштаб камеры
const offsetX = ref(0); // Сдвиг камеры по X
const offsetY = ref(0); // Сдвиг камеры по Y
const isSelected = ref(false)

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
  for (const branch of props.branchs) {
    const netherCords = branch.coordinates.find(cord => cord.world === "nether");
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

  const canvas = canvasRef.value;
  if (!canvas) return;

  logCoordinates(event);

  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left - canvas.width / 2 - offsetX.value) / scale.value;
  const mouseY = (event.clientY - rect.top - canvas.height / 2 - offsetY.value) / scale.value;

  isSelected.value = false;
  for (const _branch of props.branchs) {
    const netherCords = _branch.coordinates.find(cord => cord.world === "nether");
    if (!netherCords) continue;

    const branchX = netherCords.x;
    const branchY = netherCords.z;

    if (Math.abs(mouseX - branchX) < 2.5 && Math.abs(mouseY - branchY) < 2.5) {
      branch.value = _branch.id
      isSelected.value = true;
    }
  }
};

const onMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  logCoordinates(event);

  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left - canvas.width / 2 - offsetX.value) / scale.value;
  const mouseY = (event.clientY - rect.top - canvas.height / 2 - offsetY.value) / scale.value;

  for (const branch of props.branchs) {
    const netherCords = branch.coordinates.find(cord => cord.world === "nether");
    if (!netherCords) continue;

    const branchX = netherCords.x;
    const branchY = netherCords.z;

    if (Math.abs(mouseX - branchX) < 2.5 && Math.abs(mouseY - branchY) < 2.5) {
      canvas.style.cursor = "pointer"
      break;
    } else {
      canvas.style.cursor = "default"
    }
  }

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
  updateCanvasSize();
  draw();
});

watch(opened, () => {
  setTimeout(() => {
    updateCanvasSize();
    draw();
  }, 1000)
})
</script>

<template>
  <div>
    <el-dialog
        v-model="isSelected"
        :title="props.branchs.find(b => b.id == branch)?.name"
        width="500"
        align-center
    >
      <div>
        <div class="w-full aspect-video">
          <el-carousel height="889" indicator-position="none">
            <el-carousel-item v-for="image in props.branchs.find(b => b.id == branch)?.images" :key="item">
              <img class="w-full h-full" :src="image?.image" alt="">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div>
          <p>Описание: {{props.branchs.find(b => b.id == branch)?.description}}</p>
          <p>Город: <strong>{{props.branchs.find(b => b.id == branch)?.city}}</strong></p>
          <div v-for="cord in props.branchs.find(b => b.id == branch)?.coordinates">
            {{cord.world}} {{cord.x}} {{cord.y}} {{cord.z}}
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="isSelected = false; opened = false">
            Выбрать этот филиал
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div :class="opened ? '' : 'scale-0 opacity-0'" class="fixed top-0 left-0 z-30 w-screen h-screen bg-neutral-950 transform duration-500">
      <div @click="opened = false" class="absolute bg-neutral-800/[0.25] w-8 h-8 flex justify-center items-center top-2 left-2 cursor-pointer rounded-lg">
        <i class="pi pi-times text-neutral-700"></i>
      </div>
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
