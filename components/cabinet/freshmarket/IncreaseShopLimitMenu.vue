<script setup lang="ts">
import {http} from "~/composables/useHttp"
import {computed} from "vue";

const current_limit = 25

const model = defineModel()
const props = defineProps({
  shop: Number,
})
const {user, shops, updateUser, updateShops} = useUser()

const currentShop = computed(() => shops.value.find(s => s.id === props.shop))

const increase = ref(5)
const benefit = ref(0)
const benefitPercent = ref(0)
const price = ref(0)

const update = (count) => {
  price.value = Math.ceil(20 * count * (1 - 0.15 * Math.log10(count + 1)));
  benefit.value = count * 20 - price.value;
  benefitPercent.value = Math.ceil((benefit.value / (count * 20)) * 100)
}

watch(increase, (count) => {
  update(count)
})

onMounted(() => {
  update(increase.value)
})

const confirm = async () => {
  const response = await http.post(`/freshmarket/shop/${props.shop}/limit/increase`, {
    count: increase.value,
  })
  shops.value = shops.value.map((s) => {
    if (s.id === props.shop) {
      s.products_limit = response.data.limit
    }
    return s;
  })
  model.value = false;
  await updateUser()
}
</script>

<template>
  <div>
    <el-dialog
        v-model="model"
        :title="'Лимит ' + currentShop?.products_limit + '/' + current_limit"
        width="350"
    >
      <div class="">
        <p>Увеличить лимит на:</p>
        <el-slider v-model="increase" :min="1" :max="current_limit - currentShop?.products_limit" />
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
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="confirm" type="primary">
            Увеличить на {{increase}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style>
textarea {
  max-height: 300px;
}
</style>