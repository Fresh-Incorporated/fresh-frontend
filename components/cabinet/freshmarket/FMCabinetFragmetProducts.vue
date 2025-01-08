<script setup lang="ts">
import {http} from "~/composables/useHttp"
const {shops} = useUser()

const props = defineProps({
  shop: Number,
})

const refillWindow = ref(false)
const selectedProduct = ref({})

const tableRowClassName = ({row, rowIndex}) => {
  if (row.verify_status == 0) {
    return 'warning-row'
  } else if (row.verify_status == -1) {
    return 'danger-row'
  }
  return ''
}

const refill = async (id: number) => {
  const response = await http.post(`/freshmarket/shop/${props.shop}/product/${id}/refill`)
  const shopIndex = shops.value.findIndex(_shop => _shop.id === props.shop);
  if (shopIndex !== -1) {
    const productIndex = shops.value[shopIndex].products?.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      // Обновляем объект продукта через создание нового объекта
      shops.value[shopIndex].products[productIndex] = {
        ...shops.value[shopIndex].products[productIndex],
        refill_status: 1,
        refillCell: response.cell,
      };
      selectedProduct.value = shops.value[shopIndex].products[productIndex];
    }
  }
}

const refillEnd = async (id: number) => {
  const response = await http.post(`/freshmarket/shop/${props.shop}/product/${id}/refill/end`)
  const shopIndex = shops.value.findIndex(_shop => _shop.id === props.shop);
  if (shopIndex !== -1) {
    const productIndex = shops.value[shopIndex].products?.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      // Обновляем объект продукта через создание нового объекта
      shops.value[shopIndex].products[productIndex] = {
        ...shops.value[shopIndex].products[productIndex],
        refill_status: 2,
      };
      selectedProduct.value = shops.value[shopIndex].products[productIndex];
    }
  }
  refillWindow.value = false;
}
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-2">
    <el-dialog
        v-model="refillWindow"
        :title="`Пополнение '${selectedProduct?.name}'`"
        width="500"
        :before-close="handleClose"
    >
      <p v-if="selectedProduct.refill_status === 0">После нажатия на кнопку "Запросить пополнение" вам будет выделена ячейка в зоне пополнения продавцов, постарайтесь принести туда товар в течении 6 часов после запроса пополнения и после не забудьте подтвердить пополнение, иначе, пополнение может быть не засчитано и вы потеряете свои ресурсы</p>
      <p v-if="selectedProduct.refill_status === 1">Для пополнения товара вам необходимо придти в зону пополнения продавцов [Портал: ЗВ60]
        <br>Положите товар в выделеную ячейку и завершите пополнение</p>

      <div v-if="selectedProduct.refill_status === 1">
        <p class="text-primary-dark text-lg">Ячейка: <strong>{{selectedProduct?.refillCell?.letter}}-{{selectedProduct?.refillCell?.number}}</strong></p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain type="info" @click="refillWindow = false">Отмена</el-button>
          <el-button v-if="selectedProduct.refill_status === 0" type="warning" @click="refill(selectedProduct?.id)">
            Запросить пополнение
          </el-button>
          <el-button v-else-if="selectedProduct.refill_status === 1" type="success" @click="refillEnd(selectedProduct?.id)">
            Завершить пополнение
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div v-for="product in shops.find(_shop => _shop.id === shop)?.products" class="w-full flex border-b border-neutral-800 p-2 items-center gap-2">
      <div class="flex justify-center items-center">
        <img :src="product.icon" class="w-12 h-12 aspect-square" alt="">
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">{{product.name}}</p>
        <p class="text-xs opacity-75 line-clamp-2">{{product.description}}</p>
      </div>
      <div class="text-center mr-2">
        <p class="text-xs opacity-75">На складе</p>
        <p class="text-sm font-rubik">{{ product.count }}</p>
      </div>
      <div class="flex flex-col justify-center items-end w-32">
        <div class="w-full">
          <el-button class="w-full" :loading="product.refill_status > 1" :type="product.refill_status === 1 ? 'warning' : product.refill_status > 1 ? 'primary' : ''" @click="selectedProduct = product; refillWindow = true" size="small" plain>
            {{product.refill_status === 1 ? 'Пополнение' : product.refill_status > 1 ? 'Пополнение' : 'Пополнить'}}
          </el-button>
        </div>
        <div class="w-full">
          <el-button class="w-full" size="small" plain>
            Информация
          </el-button>
        </div>
<!--        <div v-if="product.refill_status == 0" class="flex justify-center">-->
<!--          <el-button @click="refill(scope.row.id)">-->
<!--            Пополнить-->
<!--          </el-button>-->
<!--        </div>-->
<!--        <div v-else-if="product.refill_status == 1" class="flex justify-center">-->
<!--          <el-button @click="refillEnd(scope.row.id)">-->
<!--            Завершить {{scope.row.refillCell?.letter}}-{{scope.row.refillCell?.number}}-->
<!--          </el-button>-->
<!--        </div>-->
<!--        <div v-else-if="product.refill_status == 2" class="flex justify-center">-->
<!--          <el-button loading>-->
<!--            В процессе-->
<!--          </el-button>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>