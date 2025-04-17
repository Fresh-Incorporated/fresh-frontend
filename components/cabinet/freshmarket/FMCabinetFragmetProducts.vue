<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { http } from '~/composables/useHttp'
import { useUser } from '~/composables/useUser'
import type { Product, ProductHistoryEntry } from '~/types/freshmarket'
import FMProductHistory from '~/components/freshmarket/FMProductHistory.vue'

const { shops, updateShops } = useUser()

const props = defineProps<{
  shop: number
}>()

type NotificationType = 'info' | 'warning' | 'danger'

interface Notification {
  id: number
  type: NotificationType
  tooltip: string
  action?: () => void
  disabled: boolean
}

const notifications = ref<Notification[]>([])
const refillWindow = ref(false)
const productDeleteWindow = ref(false)
const productHistoryWindow = ref(false)
const productHistoryLoading = ref(false)

const selectedProduct = ref<Product | null>(null)
const productHistory = ref<ProductHistoryEntry[]>([])

const currentShop = computed(() => shops.value.find(s => s.id === props.shop))
const products = computed(() => currentShop.value?.products ?? [])

const refreshNotifications = () => {
  if (!props.shop) return
  notifications.value = []

  for (const product of products.value) {
    if (product.verify_status === -1) {
      notifications.value.push({
        id: product.id,
        type: 'danger',
        tooltip: 'Товар не прошёл проверку',
        action: () => console.log('Открыть меню изменения товара'),
        disabled: false,
      })
    }

    if (product.refill_status === 1) {
      notifications.value.push({
        id: product.id,
        type: 'warning',
        tooltip: 'Вы не завершили пополнение',
        action: () => {
          selectedProduct.value = product
          refillWindow.value = true
        },
        disabled: false,
      })
    }

    if (product.refill_status >= 2) {
      notifications.value.push({
        id: product.id,
        type: 'info',
        tooltip: 'Товар пополняется',
        disabled: true,
      })
    }

    if (product.verify_status === 0) {
      notifications.value.push({
        id: product.id,
        type: 'info',
        tooltip: 'Товар на проверке',
        disabled: true,
      })
    }
  }
}

const refill = async (id: number | null) => {
  const response = await http.post(`/freshmarket/shop/${props.shop}/product/${id}/refill`)
  const shop = currentShop.value
  if (!shop) return

  const product = shop.products?.find(p => p.id === id)
  if (!product) return

  product.refill_status = 1
  product.refillCell = response.data.cell
  selectedProduct.value = { ...product }

  refreshNotifications()
}

const refillEnd = async (id: number) => {
  await http.post(`/freshmarket/shop/${props.shop}/product/${id}/refill/end`)
  const shop = currentShop.value
  if (!shop) return

  const product = shop.products?.find(p => p.id === id)
  if (!product) return

  product.refill_status = 2
  selectedProduct.value = { ...product }

  refillWindow.value = false
  refreshNotifications()
}

const showHistory = async () => {
  if (!selectedProduct.value?.id) return
  productHistoryWindow.value = true
  productHistoryLoading.value = true

  const { data } = await http.get(`/freshmarket/shop/${props.shop}/product/${selectedProduct.value.id}/history`)
  productHistory.value = data.reverse()

  productHistoryLoading.value = false
}

const deleteProduct = async () => {
  if (!selectedProduct.value?.id) return
  await http.post(`/freshmarket/shop/${props.shop}/product/${selectedProduct.value.id}/delete`)
  await updateShops()
  refreshNotifications()
}

onMounted(() => {
  refreshNotifications()
})

const notificationByProductId = computed(() => {
  const map = new Map<number, Notification>()
  for (const n of notifications.value) {
    map.set(n.id, n)
  }
  return map
})

const handleProductAction = (product: Product, action: 'refill' | 'history' | 'delete') => {
  selectedProduct.value = product
  switch (action) {
    case 'refill':
      refillWindow.value = true
      break
    case 'history':
      showHistory()
      break
    case 'delete':
      productDeleteWindow.value = true
      break
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
    >
      <p v-if="selectedProduct?.refill_status === 0">После нажатия на кнопку "Запросить пополнение" вам будет выделена
        ячейка в зоне пополнения продавцов, постарайтесь принести туда товар в течении 6 часов после запроса пополнения
        и после не забудьте подтвердить пополнение, иначе, пополнение может быть не засчитано и вы потеряете свои
        ресурсы</p>
      <p v-if="selectedProduct?.refill_status === 1">Для пополнения товара вам необходимо придти в зону пополнения
        продавцов [Портал: СВ133]
        <br>Положите товар в выделеную ячейку и завершите пополнение</p>

      <div v-if="selectedProduct?.refill_status === 1">
        <p class="text-primary-dark text-lg">Ячейка:
          <strong>{{ selectedProduct?.refillCell?.letter }}-{{ selectedProduct?.refillCell?.number }}</strong></p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain type="info" @click="refillWindow = false">Отмена</el-button>
          <el-button v-if="selectedProduct?.refill_status === 0" type="warning" @click="refill(selectedProduct?.id)">
            Запросить пополнение
          </el-button>
          <el-button v-else-if="selectedProduct?.refill_status === 1" type="success"
                     @click="refillEnd(selectedProduct?.id)">
            Завершить пополнение
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div v-if="currentShop?.products?.length === 0" class="flex justify-center items-center">
      <p>В этом магазине нет ни одного товара!</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
      <div v-for="product in currentShop?.products"
           :key="product.id"
           :class="[
         'w-full h-full aspect-square border p-2 rounded-lg shadow bg-neutral-950/[0.25] relative flex flex-col gap-2',
         notificationByProductId.get(product.id)?.type === 'info' ? 'border-blue-500' :
         notificationByProductId.get(product.id)?.type === 'warning' ? 'border-yellow-500' :
         notificationByProductId.get(product.id)?.type === 'danger' ? 'border-red-500' :
         'border-neutral-800'
       ]">
        <div class="flex">
          <div class="">
            <p class="text-base font-medium">{{ product.name }}</p>
            <p class="text-xs opacity-75 line-clamp-2 break-all">{{ product.description }}</p>
          </div>
          <div class="ml-auto mr-0 flex">
            <el-tooltip
                v-for="notify in notifications.filter(n => n.id === product.id)"
                effect="light"
                :content="notify.tooltip"
                placement="top-start"
            >
              <button :disabled="notify.disabled" @click="notify.action" :class="[
                'w-6 h-6 flex justify-center items-center relative',
                {
                  'text-yellow-500': notify.type === 'warning',
                  'text-blue-500': notify.type === 'info',
                  'text-red-500': notify.type === 'danger'
                }
              ]">
                <div class="blur-sm absolute h-5">
                  <Icon :name="notify.type === 'warning' ? 'uil:exclamation-triangle' :
                         notify.type === 'info' ? 'uil:exclamation-circle' :
                         'uil:exclamation-octagon'" size="20"/>
                </div>
                <Icon :name="notify.type === 'warning' ? 'uil:exclamation-triangle' :
                       notify.type === 'info' ? 'uil:exclamation-circle' :
                       'uil:exclamation-octagon'" size="20"/>
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
            <button :disabled="product.refill_status >= 2" @click="() => handleProductAction(product, 'refill')"
                    class="w-6 h-6 flex justify-center items-center text-green-400 disabled:opacity-50">
              <Icon name="material-symbols:deployed-code-update-outline" size="24"/>
            </button>
          </el-tooltip>
          <el-tooltip
              effect="light"
              content="История"
              placement="top-start"
          >
            <button @click="() => handleProductAction(product, 'history')"
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
                @confirm="() => handleProductAction(product, 'delete')"
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
        <div class="flex justify-center items-center relative">
          <div v-if="product.refill_status == 1" class="absolute w-1/2 aspect-square bg-black/[0.75] rounded-lg flex flex-col justify-center items-center">
            <p class="text-yellow-400 font-semibold">Пополнение</p>
            <p>Ячейка: <strong class="absolute blur-sm">{{ product?.refillCell?.letter }}-{{ product?.refillCell?.number }}</strong><strong>{{ product?.refillCell?.letter }}-{{ product?.refillCell?.number }}</strong></p>
          </div>
          <img :src="product.icon" class="w-1/2 aspect-square" alt="">
        </div>
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