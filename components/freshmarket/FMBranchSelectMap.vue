<script setup lang="ts">
import { ref, onMounted } from "vue";

const opened = defineModel("opened")
const branch = defineModel("branch")

const selectedWorld = ref('nether')


const colors = {
  green: '#43AF68',
  blue: '#4277FF',
  red: '#FF5353',
  yellow: '#FFBD3E'
}

const props = defineProps({
  branchs: Array<Object>,
})

// Настройки для канваса
const canvasRef = ref<HTMLCanvasElement | null>(null);
const scale = ref(2); // Масштаб камеры
const offsetX = ref(0); // Сдвиг камеры по X
const offsetY = ref(0); // Сдвиг камеры по Y
const isSelected = ref(false)
const pointSize = 5
const lineWidth = 3

let isPanning = false; // Состояние перемещения камеры
let lastMouseX = 0;
let lastMouseY = 0;

const cursorPoint = ref({x: 0, y: 0});

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



  if (selectedWorld.value == 'nether') {
    // Рисуем оси
    ctx.strokeStyle = colors.green; // Линия X положительная
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    ctx.strokeStyle = colors.blue; // Линия X отрицательная
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(-canvas.width, centerY);
    ctx.stroke();

    ctx.strokeStyle = colors.yellow; // Линия Y положительная
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = colors.red; // Линия Y отрицательная
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, -canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#7A494A";
    ctx.arc(centerX, centerY, pointSize * 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (selectedWorld.value == 'overworld') {
    ctx.beginPath();
    ctx.fillStyle = "#59BA53";
    ctx.arc(centerX, centerY, pointSize * 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.fillStyle = "#E6EEAC";
    ctx.arc(centerX, centerY, pointSize * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }


  // Филиалы
  for (const branch of props.branchs) {
    const original = branch.coordinates.find(cord => cord.world == selectedWorld.value)
    let coords = original ? JSON.parse(JSON.stringify(original)) : null; // КОПИРУЮ ОБЪЕКТ ЧТОБЫ НЕ ПЕРЕЗАПИСЫВАЛ props
    if (!coords) continue;


    let lineColor = colors[getNearestBranch(coords.x,coords.z).color];

    if (selectedWorld.value == 'the_end' || selectedWorld.value == 'overworld') {
      coords.x = coords.x / 8;
      coords.z = coords.z / 8;
    }

    const branchX = centerX + coords.x;
    const branchY = centerY + coords.z;

    if (selectedWorld.value == 'nether') {
      const distToX = Math.abs(coords.z);
      const distToY = Math.abs(coords.x);


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
    } else if (selectedWorld.value == 'overworld') lineColor = "#59BA53"
    else lineColor = "#E6EEAC"


    ctx.beginPath();
    ctx.fillStyle = lineColor;
    ctx.arc(branchX, branchY, pointSize, 0, Math.PI * 2);
    if (selectedWorld.value != 'nether') {
      ctx.arc(branchX, branchY, pointSize / 2, 0, Math.PI * 2, true);
    }
    ctx.fill('evenodd');

    ctx.fillStyle = "#fff";
    ctx.font = (pointSize * 2) + "px montserrat";
    ctx.fillText(branch.name, branchX - (branch.name.length * (pointSize - 2)), branchY - pointSize - 2);
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

  if (scale.value > 5) scale.value = 5;
  else if (scale.value < 1) scale.value = 1;
  else {
    offsetX.value -= mouseX * (scaleDelta - 1);
    offsetY.value -= mouseY * (scaleDelta - 1);
  }



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
    const original = _branch.coordinates.find(cord => cord.world == selectedWorld.value)
    let coords = original ? JSON.parse(JSON.stringify(original)) : null; // КОПИРУЮ ОБЪЕКТ ЧТОБЫ НЕ ПЕРЕЗАПИСЫВАЛ props
    if (!coords) continue;

    if (selectedWorld.value == 'the_end' || selectedWorld.value == 'overworld') {
      coords.x = coords.x / 8;
      coords.z = coords.z / 8;
    }

    const branchX = coords.x;
    const branchY = coords.z;

    if (Math.abs(mouseX - branchX) < pointSize && Math.abs(mouseY - branchY) < pointSize) {
      branch.value = _branch
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
    const original = branch.coordinates.find(cord => cord.world == selectedWorld.value)
    let coords = original ? JSON.parse(JSON.stringify(original)) : null; // КОПИРУЮ ОБЪЕКТ ЧТОБЫ НЕ ПЕРЕЗАПИСЫВАЛ props
    if (!coords) continue;

    if (selectedWorld.value == 'the_end' || selectedWorld.value == 'overworld') {
      coords.x = coords.x / 8;
      coords.z = coords.z / 8;
    }

    const branchX = coords.x;
    const branchY = coords.z;



    if (Math.abs(mouseX - branchX) < pointSize && Math.abs(mouseY - branchY) < pointSize) {
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

const onTouchMove = (event: TouchEvent) => {
  if (!isPanning) return;
  event.preventDefault();

  const touch = event.touches[0];
  const dx = touch.clientX - lastMouseX;
  const dy = touch.clientY - lastMouseY;
  lastMouseX = touch.clientX;
  lastMouseY = touch.clientY;

  offsetX.value += dx;
  offsetY.value += dy;

  draw();


};

const onTouchStart = (event: TouchEvent) => {
  event.preventDefault();
  isPanning = true;
  const touch = event.touches[0];
  lastMouseX = touch.clientX;
  lastMouseY = touch.clientY;

  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = (touch.clientX - rect.left - canvas.width/2 - offsetX.value) / scale.value;
  const mouseY = (touch.clientY - rect.top - canvas.height/2 - offsetY.value) / scale.value;

  isSelected.value = false;
  for (const _branch of props.branchs) {
    const original = _branch.coordinates.find(cord => cord.world == selectedWorld.value)
    let coords = original ? JSON.parse(JSON.stringify(original)) : null; // КОПИРУЮ ОБЪЕКТ ЧТОБЫ НЕ ПЕРЕЗАПИСЫВАЛ props
    if (!coords) continue;

    if (selectedWorld.value == 'the_end' || selectedWorld.value == 'overworld') {
      coords.x = coords.x / 8;
      coords.z = coords.z / 8;
    }

    const branchX = coords.x;
    const branchY = coords.z;

    if (Math.abs(mouseX - branchX) < pointSize && Math.abs(mouseY - branchY) < pointSize) {
      branch.value = _branch;
      isSelected.value = true;
    }
  }
};

const logCoordinates = (event) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  let mouseX = (event.clientX - rect.left - canvas.width / 2 - offsetX.value) / scale.value;
  let mouseY = (event.clientY - rect.top - canvas.height / 2 - offsetY.value) / scale.value;
  if (!event.clientX && event.touches.length > 0 && event.touches[0].clientX) {
    mouseX = (event.touches[0].clientX - rect.left - canvas.width / 2 - offsetX.value) / scale.value;
    mouseY = (event.touches[0].clientY - rect.top - canvas.height / 2 - offsetY.value) / scale.value;
  }

  cursorPoint.value = {x: mouseX, y: mouseY};
};

const onMouseUp = () => {
  isPanning = false;
};

const onTouchEnd = () => {
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

  canvas.addEventListener("touchmove", onTouchMove);
  canvas.addEventListener("touchstart", onTouchStart);
  canvas.addEventListener("touchend", onTouchEnd);
  updateCanvasSize();
  draw();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCanvasSize);

  if (!canvasRef.value) return;
  const canvas = canvasRef.value;

  canvas.removeEventListener("wheel", onWheel);
  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mouseup", onMouseUp);
  canvas.removeEventListener("mouseout", onMouseUp);

  canvas.removeEventListener("touchmove", onTouchMove);
  canvas.removeEventListener("touchstart", onTouchStart);
  canvas.removeEventListener("touchend", onTouchEnd);
})


watch(opened, () => {
  if (opened.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = null;
  }
  setTimeout(() => {
    updateCanvasSize();
    draw();
  }, 1000)
})

function getNearestBranch(x, z) {
  const distanceToXAxis = Math.abs(z);
  const distanceToZAxis = Math.abs(x);

  if (distanceToXAxis < distanceToZAxis) {
    return x >= 0 ? { color: 'green', translate: 'Зелёная', amount: x } : { color: 'blue', translate: 'Синяя', amount: -x };
  } else {
    return z >= 0 ? { color: 'yellow', translate: 'Жёлтая', amount: z } : { color: 'red', translate: 'Красная', amount: -z };
  }
}

</script>

<template>
  <div>
    <el-dialog
        v-model="isSelected"
        :title="branch?.name"
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
        <div class="flex flex-col gap-1">
          <div class="flex flex-col">
            <h1 class="text-xl  text-white">{{ branch?.name }}</h1>
            <p v-if="branch?.description != null">{{ branch?.description }}</p>
          </div>
          <div v-if="branch?.city != null">
            <span>Город: </span>
            <span>{{ branch?.city }}</span>
          </div>
          <div class="w-full">
            <h1 class="text-center text-white text-lg">Как добраться?</h1>
            <div class="w-full">
              <div v-if="branch?.coordinates.some((someBranch) => someBranch.world == 'nether')" class="w-full flex justify-between">
                <span>Координаты в метро:</span>
                <span>{{ getNearestBranch(branch.coordinates.find((someBranch) => someBranch.world == 'nether').x, branch.coordinates.find((someBranch) => someBranch.world == 'nether').z).translate }} {{ getNearestBranch(branch.coordinates.find((someBranch) => someBranch.world == 'nether').x, branch.coordinates.find((someBranch) => someBranch.world == 'nether').z).amount }}</span>
              </div>
              <div v-if="branch?.coordinates.some((someBranch) => someBranch.world == 'the_end')" class="w-full flex justify-between">
                <span>Координаты в энде:</span>
                <span>{{ branch.coordinates.find((someBranch) => someBranch.world == 'the_end').x }} {{branch.coordinates.find((someBranch) => someBranch.world == 'overworld').y }} {{branch.coordinates.find((someBranch) => someBranch.world == 'overworld').z }}</span>
              </div>
              <div v-if="branch?.coordinates.some((someBranch) => someBranch.world == 'overworld')" class="w-full flex justify-between">
                <span>Координаты в верхнем мире:</span>
                <span>{{ branch.coordinates.find((someBranch) => someBranch.world == 'overworld').x }}  {{branch.coordinates.find((someBranch) => someBranch.world == 'overworld').y }} {{branch.coordinates.find((someBranch) => someBranch.world == 'overworld').z }}</span>
              </div>
            </div>
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
      <div class="fixed top-2 right-2">
        <el-select v-model="selectedWorld" placeholder="Выберите мир" style="width: 140px" @change="draw();">
          <el-option label="Метро" value="nether"/>
          <el-option label="Верхний мир" value="overworld"/>
          <el-option label="Энд" value="the_end"/>
        </el-select>
      </div>
      <div class="fixed bottom-2 right-2">
        <p>X: {{Math.floor(cursorPoint.x)}}</p>
        <p>Z: {{Math.floor(cursorPoint.y)}}</p>
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