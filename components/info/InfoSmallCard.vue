<script setup lang="ts">
const props = defineProps({
  nickname: String,
  uuid: String,
  text: String,
  link: String,
  linkTooltip: {
    default: "Телеграм канал",
    type: String
  }
})
</script>

<template>
  <div
      class="bg-neutral-200 dark:bg-neutral-900 rounded-lg overflow-hidden p-1 flex gap-2 relative border border-neutral-300 dark:border-neutral-700">
    <div class="w-12 h-8 bg-neutral-300 blur-2xl absolute transform -translate-x-1/2 -translate-y-1/2"></div>
    <div
        class="w-12 h-8 bg-neutral-300 blur-2xl absolute transform translate-x-1/2 translate-y-1/2 bottom-0 right-0"></div>
    <img :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${uuid}/full`" class="w-16 h-16 rounded-lg"
         alt="">
    <div class="flex flex-col py-1">
      <p class="font-fira flex-1">{{nickname}}</p>
      <p class="font-onest text-xs opacity-75" v-html="text"></p>
    </div>
    <div>
      <ShTooltip>
        <ShTooltipTrigger>
          <a v-if="link" :href="link" target="_blank">
            <ShButton size="xs" variant="secondary">
              <Icon name="lucide:external-link" size="16" class="text-black/[.75] dark:text-white/[.75]" />
            </ShButton>
          </a>
          <ShButton v-else size="xs" disabled variant="secondary">
            <Icon name="lucide:external-link" size="16" class="text-black/[.75] dark:text-white/[.75]" />
          </ShButton>
        </ShTooltipTrigger>
        <ShTooltipContent>
          {{ link ? linkTooltip : 'Отсутствует' }}
        </ShTooltipContent>
      </ShTooltip>
    </div>
  </div>
</template>

<style scoped>

</style>