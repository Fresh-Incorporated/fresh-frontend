<script setup lang="ts">
import {http} from "~/composables/useHttp"
import {computed} from "vue";
import IconUpload from "~/components/global/upload/IconUpload.vue";
import PreviewMinecraftShulker from "~/components/freshmarket/PreviewMinecraftShulker.vue";

const current_limit = 25

const emit = defineEmits(['updateShop'])

const opened = ref(false);
const props = defineProps({
  shopId: Number,
  products_limit: Number,
})
const {user, shops, updateUser, updateShops} = useUser()

const increase = ref([5])
const benefit = ref(0)
const benefitPercent = ref(0)
const price = ref(0)

const update = (count: number) => {
  price.value = Math.ceil(20 * count * (1 - 0.15 * Math.log10(count + 1)));
  benefit.value = count * 20 - price.value;
  benefitPercent.value = Math.ceil((benefit.value / (count * 20)) * 100)
}

watch(increase, (count) => {
  update(count?.[0])
})

onMounted(() => {
  update(increase.value?.[0])
})

const confirm = async () => {
  const response = await http.post(`/freshmarket/shop/${props.shopId}/limit/increase`, {
    count: increase.value?.[0],
  })
  opened.value = false
  emit('updateShop')
  await updateShops()
}
</script>

<template>
  <ShDialog v-model:open="opened">
    <ShDialogTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShDialogTrigger>
    <ShDialogContent class="sm:max-w-[425px]">
      <ShDialogHeader>
        <ShDialogTitle>Увеличение лимита товаров магазина</ShDialogTitle>
        <ShDialogDescription>
          Лимит товаров этого магазина будет увеличен навсегда!
        </ShDialogDescription>
      </ShDialogHeader>
      <div class="">
        <ShLabel>Увеличить лимит на {{increase?.[0]}}</ShLabel>
        <ShSlider
            v-model="increase"
            :min="1"
            :max="current_limit - products_limit"
            :step="1"
            class="mt-2 mb-4"
        />
        <div class="grid grid-cols-2 gap-2">
          <div class="border rounded-md h-16 border-blue-500 flex flex-col justify-center items-center text-blue-500 font-medium">
            <p class="text-xs">Цена</p>
            <p class="font-bold">{{ price }} АР</p>
          </div>
          <div class="border rounded-md h-16 border-green-500 flex flex-col justify-center items-center text-green-500 font-medium">
            <p class="text-xs">Выгода</p>
            <div>
              <p class="font-bold absolute blur-xs">{{ benefit }} АР <span class="text-xs">({{benefitPercent}}%)</span></p>
              <p class="font-bold">{{ benefit }} АР <span class="text-xs">({{benefitPercent}}%)</span></p>
            </div>
          </div>
        </div>
      </div>
      <ShDialogFooter>
        <ShButton @click="confirm" type="submit">
          Увеличить на {{increase?.[0]}} слотов
        </ShButton>
      </ShDialogFooter>
    </ShDialogContent>
  </ShDialog>
</template>

<style>
textarea {
  max-height: 300px;
}
</style>