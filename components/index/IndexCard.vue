<script setup lang="ts">

const show = defineModel()

const props = defineProps({
  xOffset: {type: Number, default: 0},
  yOffset: {type: Number, default: 0},
  title: {type: String, default: "Title"},
  to: {type: String, default: "/"},
  linkText: {type: String, default: "TO?"},
})
</script>

<template>
  <div :class="show ? '' : 'absolute'" class="w-full h-full flex items-center justify-center">
    <div :class="show ? 'absolute' : 'opacity-0 absolute'" class="w-96 h-52 border bg-neutral-800 border-neutral-700 rounded-xl opacity-50 transition-all duration-200" :style="`transform: translate(${props.xOffset}px, ${props.yOffset}px)`">

    </div>
    <div v-if="show" class="overflow-hidden relative shadow-lg z-10 w-96 h-52 rounded-xl [background:conic-gradient(from_var(--border-angle),theme(colors.neutral.600/.48)_80%,_theme(colors.primary.dark)_86%,_theme(colors.green.500)_90%,_theme(colors.primary.dark)_94%,_theme(colors.slate.600/.48))_border-box] border border-transparent animate-border">
      <slot>
        <div class="absolute w-6 h-6 bg-white blur-2xl"></div>
        <div class="p-4 w-full h-full rounded-xl bg-neutral-800 flex flex-col">
          <h2 class="text-xl font-rubik font-bold">{{props.title}}</h2>
          <div class="flex-grow">
            <slot name="body">
              <div class="grid grid-rows-4 h-full text-sm py-2 text-green-500">
                <p><i class="pi pi-check-circle"></i>  Выгодная торговля</p>
                <p><i class="pi pi-check-circle"></i>  Регистрация в 2 клика</p>
                <p><i class="pi pi-check-circle"></i>  Что-то ещё</p>
                <p><i class="pi pi-check-circle"></i>  Что-то ещё</p>
              </div>
            </slot>
          </div>
          <NuxtLink :to="props.to">
            <div class="flex items-center gap-4 group cursor-pointer"><i class="pi pi-arrow-right text-sm group-hover:translate-x-1 transition-all duration-500"></i> {{props.linkText}}</div>
          </NuxtLink>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>

</style>