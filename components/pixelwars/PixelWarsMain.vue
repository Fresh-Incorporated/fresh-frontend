<script setup lang="ts">
import PixelWarsMap from "~/components/pixelwars/PixelWarsMap.vue";
import {ref} from "vue";
import {http} from "~/composables/useHttp";

const view = ref({
  scale: 1,
  panX: 0,
  panY: 0
});

const borderPixels = ref([])
const statePixels = ref([])

const selectedPixel = ref()

onMounted(async () => {
  const response = (await http.get("/pixelwars/map")).data
  borderPixels.value = response.borderPixels
  statePixels.value = response.statePixels
})
</script>

<template>
<div class="flex flex-col-reverse xl:flex-row xl:grid grid-cols-3 gap-2 p-2 h-[calc(100vh-200px)] ">
  <div class="w-full flex-1 lg:aspect-video col-span-2 bg-sky-200">
    <PixelWarsMap v-model:view="view" v-model:selected-pixel="selectedPixel" v-model:border-pixels="borderPixels" v-model:state-pixels="statePixels"  />
  </div>
  <div class="bg-blue-500">
    <p>view: {{view}}</p>
    <p>selected: {{selectedPixel}}</p>
  </div>
</div>
</template>

<style scoped>

</style>