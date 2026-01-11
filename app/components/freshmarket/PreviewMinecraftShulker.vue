<script setup lang="ts">
const image = defineModel<File | undefined>('image')
const minecraftIcon = defineModel<String | undefined>('minecraft-icon')
const props = defineProps({
  slots: Number,
  perSlot: Number,
  price: Number,
  defaultImage: String,
})

const fileUrl = ref()

watch(image, (newValue) => {
  if (!newValue) {
    fileUrl.value = null
    return
  }
  fileUrl.value = URL.createObjectURL(newValue)
})

watch(minecraftIcon, (newValue) => {
  if (newValue) {
    fileUrl.value = `https://assets.zaralx.ru/api/v1/minecraft/vanilla/item/${newValue}/icon`
  }
})
</script>

<template>
  <ShAlertDialog>
    <ShAlertDialogTrigger as-child>
      <slot />
    </ShAlertDialogTrigger>
    <ShAlertDialogContent>
      <ShAlertDialogHeader>
        <ShAlertDialogTitle>Предпросмотр 1 ед. товара</ShAlertDialogTitle>
        <ShAlertDialogDescription>
          Это будет стоить {{price}} АР
          <div class="grid grid-cols-9 grid-rows-3 gap-2 select-none mt-2">
            <div class="w-full aspect-square border-border border relative overflow-hidden" v-for="i in 27">
              <img v-if="i <= slots" class="w-full h-full" :src="fileUrl ?? props.defaultImage" alt="">
              <p v-if="i <= slots" class="absolute right-0 -bottom-0.5 bg-black/[.75] aspect-square text-white z-10 rounded-tl-lg pl-1 pt-0.5 text-xs">x{{perSlot}}</p>
            </div>
          </div>
        </ShAlertDialogDescription>
      </ShAlertDialogHeader>
      <ShAlertDialogFooter>
        <ShAlertDialogCancel>Закрыть</ShAlertDialogCancel>
      </ShAlertDialogFooter>
    </ShAlertDialogContent>
  </ShAlertDialog>
</template>

<style scoped>

</style>