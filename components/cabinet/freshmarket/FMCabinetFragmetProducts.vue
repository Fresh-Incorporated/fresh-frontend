<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMProductHistory from "~/components/freshmarket/FMProductHistory.vue";

const {shops, updateShops} = useUser()

const props = defineProps({
  shop: Number,
})

const notifications = ref([])

const refillWindow = ref(false)
const selectedProduct = ref({})

const productHistoryWindow = ref(false)
const productHistoryLoading = ref(false)
const productHistory = ref([])

const productDeleteWindow = ref(false)

onMounted(() => {
  refreshNotifications();
})

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
        refillCell: response.data.cell,
      };
      selectedProduct.value = shops.value[shopIndex].products[productIndex];
    }
  }
  refreshNotifications();
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
  refreshNotifications();
}

const showHistory = async () => {
  productHistoryWindow.value = true;
  productHistoryLoading.value = true;
  productHistory.value = [];
  const response = await http.get(`/freshmarket/shop/${props.shop}/product/${selectedProduct.value.id}/history`)

  productHistory.value = response.data.reverse()
  productHistoryLoading.value = false;
}

const deleteProduct = async () => {
  await http.post(`/freshmarket/shop/${props.shop}/product/${selectedProduct.value.id}/delete`)
  await updateShops();
  refreshNotifications();
}

const refreshNotifications = () => {
  if (props.shop == null) return;
  notifications.value = [];
  for (const product of shops.value.find(_shop => _shop.id === props.shop)?.products) {
    if (product.verify_status === -1) {
      notifications.value.push({
        id: product.id,
        type: "danger",
        tooltip: "Товар не прошёл проверку"
      })
    }
    if (product.refill_status == 1) {
      notifications.value.push({
        id: product.id,
        type: "warning",
        tooltip: "Вы не завершили пополнение",
        // action: () => {}
      });
    }
    if (product.refill_status >= 2) {
      notifications.value.push({
        id: product.id,
        type: "info",
        tooltip: "Товар пополняется"
      })
    }
    if (product.verify_status === 0) {
      notifications.value.push({
        id: product.id,
        type: "info",
        tooltip: "Товар на проверке"
      })
    }
  }
}
</script>

<template>
  <div
      class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5">
    <FMProductHistory v-model="productHistoryWindow" v-model:loading="productHistoryLoading" :history="productHistory"/>
    <el-dialog
        v-model="productDeleteWindow"
        :title="`Удаление '${selectedProduct?.name}'`"
        width="500"
    >
      <div class="space-y-2">
        <strong>ВЫ ХОТИТЕ УДАЛИТЬ ТОВАР <span class="underline">{{ selectedProduct?.name }}</span>
          <br> ЭТО ДЕЙСТВИЕ НЕЛЬЗЯ ОТМЕНИТЬ.</strong>
        <p>Если на складе есть товар - это действие нельзя выполнить. (Если вам очень нужно удалить товар - выкупите
          его)</p>
        <p>Бывает такое, что товар недавно купили и его ещё не доставили - по этой причине вы не сможете удалить его.
          (Попробуйте позже)</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain type="info" @click="productDeleteWindow = false">Отмена</el-button>
          <el-button type="danger" @click="deleteProduct(); productDeleteWindow = false">
            Удалить
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        v-model="refillWindow"
        :title="`Пополнение '${selectedProduct?.name}'`"
        width="500"
        :before-close="handleClose"
    >
      <p v-if="selectedProduct.refill_status === 0">После нажатия на кнопку "Запросить пополнение" вам будет выделена
        ячейка в зоне пополнения продавцов, постарайтесь принести туда товар в течении 6 часов после запроса пополнения
        и после не забудьте подтвердить пополнение, иначе, пополнение может быть не засчитано и вы потеряете свои
        ресурсы</p>
      <p v-if="selectedProduct.refill_status === 1">Для пополнения товара вам необходимо придти в зону пополнения
        продавцов [Портал: СВ133]
        <br>Положите товар в выделеную ячейку и завершите пополнение</p>

      <div v-if="selectedProduct.refill_status === 1">
        <p class="text-primary-dark text-lg">Ячейка:
          <strong>{{ selectedProduct?.refillCell?.letter }}-{{ selectedProduct?.refillCell?.number }}</strong></p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain type="info" @click="refillWindow = false">Отмена</el-button>
          <el-button v-if="selectedProduct.refill_status === 0" type="warning" @click="refill(selectedProduct?.id)">
            Запросить пополнение
          </el-button>
          <el-button v-else-if="selectedProduct.refill_status === 1" type="success"
                     @click="refillEnd(selectedProduct?.id)">
            Завершить пополнение
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
      <div v-for="product in shops.find(_shop => _shop.id === shop)?.products"
           :class="notifications.filter(notify => notify.id == product.id).length == 0 ? 'border-neutral-800' :
                    notifications.filter(notify => notify.id == product.id)[0]?.type == 'info' ? 'border-blue-500' :
                    notifications.filter(notify => notify.id == product.id)[0]?.type == 'warning' ? 'border-yellow-500' :
                    notifications.filter(notify => notify.id == product.id)[0]?.type == 'danger' ? 'border-red-500' : ''"
           class="w-full aspect-square border p-2 rounded-lg shadow bg-neutral-950/[0.25] relative flex flex-col gap-2">
        <div class="flex">
          <div class="">
            <p class="text-base font-medium">{{ product.name }}</p>
            <p class="text-xs opacity-75 line-clamp-2">{{ product.description }}</p>
          </div>
          <div class="ml-auto mr-0 flex">
            <el-tooltip
                v-for="notify in notifications"
                effect="light"
                :content="notify?.tooltip"
                placement="top-start"
            >
              <button v-if="notify?.id == product?.id" :class="notify.type == 'warning' ? 'text-yellow-500' :
                                                                notify.type == 'info' ? 'text-blue-500' :
                                                                notify.type == 'danger' ? 'text-red-500' : ''" class="w-6 h-6 flex justify-center items-center relative">
                <div class="blur-sm absolute h-5">
                  <Icon v-if="notify.type == 'warning'" name="uil:exclamation-triangle" size="20"/>
                  <Icon v-else-if="notify.type == 'info'" name="uil:exclamation-circle" size="20"/>
                  <Icon v-else-if="notify.type == 'danger'" name="uil:exclamation-octagon" size="20"/>
                </div>
                <Icon v-if="notify.type == 'warning'" name="uil:exclamation-triangle" size="20"/>
                <Icon v-else-if="notify.type == 'info'" name="uil:exclamation-circle" size="20"/>
                <Icon v-else-if="notify.type == 'danger'" name="uil:exclamation-octagon" size="20"/>

              </button>
            </el-tooltip>
            <el-tooltip
                effect="light"
                content="Изменить"
                placement="top-start"
            >
              <button class="w-6 h-6 flex justify-center items-center">
                <Icon name="uil:pen" size="20"/>
              </button>
            </el-tooltip>
          </div>
        </div>
        <div class="flex gap-1">
          <el-tooltip
              effect="light"
              :content="product.refill_status < 2 ? 'Пополнить' : 'Товар пополняется'"
              placement="top-start"
          >
            <button :disabled="product.refill_status >= 2" @click="() =>  {
              if (product.refill_status < 2) {
                selectedProduct = product; refillWindow = true
              }
            }"
                    class="w-6 h-6 flex justify-center items-center text-green-400 disabled:opacity-50">
              <Icon name="material-symbols:deployed-code-update-outline" size="24"/>
            </button>
          </el-tooltip>
          <el-tooltip
              effect="light"
              content="История"
              placement="top-start"
          >
            <button @click="selectedProduct = product; showHistory()"
                    class="w-6 h-6 flex justify-center items-center text-neutral-400">
              <Icon name="uil:history" size="24"/>
            </button>
          </el-tooltip>
          <el-tooltip
              effect="light"
              content="Удалить"
              placement="top-start"
          >
            <el-popconfirm
                confirm-button-text="Да, удалить"
                cancel-button-text="Отмена"
                hide-icon
                title="Вы уверены что хотите удалить товар? Это действие нельзя будет отменить!"
                @confirm="selectedProduct = product; productDeleteWindow = true"
                :width="250"
            >
              <template #reference>
                <button class="w-6 h-6 flex justify-center items-center text-red-500">
                  <Icon name="uil:trash-alt" size="24"/>
                </button>
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">Отмена</el-button>
                <el-button
                    type="danger"
                    size="small"
                    @click="confirm"
                >
                  Подтвердить
                </el-button>
              </template>
            </el-popconfirm>
          </el-tooltip>
        </div>
        <div class="flex justify-center items-center">
          <img :src="product.icon" class="w-1/2 aspect-square" alt="">
        </div>
        <!--        <div class="flex flex-col justify-center items-end w-32">-->
        <!--          <div class="w-full">-->
        <!--            <el-button :disabled="product.verify_status != 1" class="w-full" :loading="product.refill_status > 1" :type="product.refill_status === 1 ? 'warning' : product.refill_status > 1 ? 'primary' : ''" @click="selectedProduct = product; refillWindow = true" size="small" plain>-->
        <!--              {{product.refill_status === 1 ? 'Пополнение' : product.refill_status > 1 ? 'Пополнение' : 'Пополнить'}}-->
        <!--            </el-button>-->
        <!--          </div>-->
        <!--          <div class="w-full">-->
        <!--            <el-button :disabled="product.verify_status != 1" class="w-full" size="small" plain>-->
        <!--              Информация-->
        <!--            </el-button>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="mb-0 mt-auto flex">
          <div class="w-full">
            <p class="text-xs opacity-75">Цена</p>
            <p>{{ product.price }} АР</p>
          </div>
          <p class="text-center mt-auto mb-0">/</p>
          <div class="text-right w-full">
            <p class="text-xs opacity-75">На складе</p>
            <p>{{ product.count }} ед.</p>
          </div>
        </div>
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