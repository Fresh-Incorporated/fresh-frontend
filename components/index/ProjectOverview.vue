<script setup lang="ts">
import Card from "~/components/index/IndexCard.vue";

const selected = ref(0);

const cards = ref([
  { show: true },
  { show: false },
  { show: false },
]);

const select = (id: number) => {
  cards.value[selected.value].show = false;
  selected.value = id;
  cards.value[id].show = true;
}

const selectNext = () => {
  select(selected.value + 1 > cards.value.length - 1 ? 0 : selected.value + 1);
}

const selectPrev = () => {
  select(selected.value - 1 < 0 ? cards.value.length - 1 : selected.value - 1);
}

let interval;

onMounted(() => {
  interval = setInterval(() => {
    selectNext()
  }, 10000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
<div class="w-full h-full flex items-center justify-center">
  <div class="relative flex items-center justify-center">
    <button @click="selectPrev()" class="absolute -left-2 z-20 bg-neutral-700 w-6 h-6 aspect-square flex justify-center items-center rounded-full opacity-75 hover:opacity-90">
      <i class="pi pi-arrow-left text-xs opacity-75"></i>
    </button>
    <button @click="selectNext()" class="absolute -right-2 z-20 bg-neutral-700 w-6 h-6 aspect-square flex justify-center items-center rounded-full opacity-75 hover:opacity-90">
      <i class="pi pi-arrow-right text-xs opacity-75"></i>
    </button>
    <Card v-model="cards[0].show" :x-offset="0 - selected * 10" title="Начните продавать с нами" to="/" link-text="Стать продавцом" />
    <Card v-model="cards[1].show" :x-offset="(1 - selected) * 10" />
    <Card v-model="cards[2].show" :x-offset="(2 - selected) * 10" />
  </div>
</div>
</template>

<style scoped>
.lay {
  @apply transform rotate-z-45 rotate-x-45 -rotate-y-12
}

@property --border-angle {
  inherits: false;
  initial-value: 0deg;
  syntax: '<angle>';
}
</style>