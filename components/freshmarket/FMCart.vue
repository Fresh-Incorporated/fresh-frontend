<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FreshmarketBranchSelectMap from "~/components/freshmarket/FreshmarketBranchSelectMap.vue";
import {toast} from "vue-sonner";
import {ScrollArea} from "~/components/ui/scroll-area";

const {cart, putInCart, updateOrders, updateUser} = useUser()

const openedBranchSelection = ref(false)
const selectedBranch = ref(null)
const branchs = ref([])

const opened = ref(false)

const deliveryType = ref("branch")

const deliveryWorlds = [
  {
    label: "Верхний мир",
    value: "overworld"
  },
  {
    label: "Адский мир",
    value: "nether"
  },
  {
    label: "Эндер мир",
    value: "the_end"
  }
]

const deliveryCordsData = ref({
  world: "overworld",
  x: 0,
  y: 64,
  z: 0
})
const openedDepositDialog = ref(false)
const buy = async () => {
  if (selectedBranch.value == null) {
    return toast.error("Произошла ошибка", {
      description: "Вы не выбрали филиал!",
      duration: 7500,
    });
  }
  await http.post("/freshmarket/order/new/instant", {
    type: deliveryType.value,
    branch: selectedBranch.value.id,
    products: cart.value.map(({ id, picked }) => ({ id, count: picked }))
  }).catch(async (error) => {
    const data = error.response.data;
    if (data.url) {
      await navigateTo(data.url, {
        open: {
          target: '_blank',
          windowFeatures: {
            width: 500,
            height: 700
          }
        }
      })
      openedDepositDialog.value = false;
    }
    throw new Error("need money?")
  })
  cart.value = [];
  opened.value = false;
  await updateOrders();
  await updateUser()
}

async function handleMessage(event: MessageEvent) {
  if (event.data === 'payment_closed') {
    await buy()
  }
}

watch(openedBranchSelection, (newValue) => {
  if (!newValue) opened.value = true;
})

onMounted(async () => {
  window.addEventListener('message', handleMessage)
  branchs.value = (await http.get("/freshmarket/branchs")).data
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div>
    <FreshmarketBranchSelectMap v-model:branch="selectedBranch" v-model:opened="openedBranchSelection" :branchs="branchs" />
    <ShSheet
        v-model:open="opened"
    >
      <ShSheetContent>
        <ShSheetHeader>
          <ShSheetTitle>Корзина</ShSheetTitle>
        </ShSheetHeader>
        <ScrollArea class="flex-1 flex-col w-full px-4 h-[calc(100vh-421px)]">
          <div v-for="product in [...cart]" class="bg-neutral-100 dark:bg-neutral-900 flex rounded-lg p-2 gap-2 mb-2 relative">
            <div class="min-w-24 max-w-24 min-h-24 max-h-24">
              <img :src="product.icon" class="w-full h-full rounded-lg" alt="">
            </div>
            <div class="w-[calc(100%-192px)] h-full flex flex-col">
              <p class="text-lg font-onest overflow-hidden text-ellipsis">{{ product.name }}</p>
              <p class="text-xs line-clamp-6 break-all text-neutral-400">
                {{ product.description }}</p>
            </div>
            <div class="h-full w-20">
              <div class="flex w-full">
                <button @click="putInCart(product, -1)"
                        class="w-6 h-6 aspect-square rounded-lg flex justify-center items-center text-xs bg-neutral-200 dark:bg-neutral-800">
                  <Icon :name="product.picked > 1 ? 'lucide:minus' : 'lucide:trash-2'" size="16"/></button>
                <div class="h-full w-12 flex justify-center items-center text-center">
                  {{ product?.picked }}
                </div>
                <button @click="putInCart(product, 1)"
                        class="w-6 h-6 aspect-square rounded-lg flex justify-center items-center text-xs bg-neutral-200 dark:bg-neutral-800">
                  <Icon name="lucide:plus" size="16" /></button>
              </div>
              <div class="font-montserrat absolute bottom-8 right-4 text-right">
                <!--                  <p class="text-sm font-medium">Цена</p>-->
                <p class="text-neutral-500 font-rubik text-xs">{{product.stack_count * product.slots_count * product.picked}} предметов</p>
                <p class="text-neutral-400 font-rubik text-sm">{{product.slots_count * product.picked}} слотов</p>
              </div>
              <div class="font-montserrat absolute bottom-2 right-4 text-right">
                <!--                  <p class="text-sm font-medium">Цена</p>-->
                <p class="text-primary-dark font-onest text-lg font-semibold">{{product.price * product.picked}} АР</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <ShSheetFooter>
          <div class="w-full">
            <div class="relative">
              <ShTabs v-model="deliveryType" default-value="branch">
                <ShTabsList class="grid w-full grid-cols-2">
                  <ShTabsTrigger value="branch">
                    Филиал
                  </ShTabsTrigger>
                  <ShTabsTrigger value="cords" disabled>
                    Координаты
                  </ShTabsTrigger>
                </ShTabsList>
              </ShTabs>
              <transition>
                <div v-if="deliveryType === 'branch'" class="mt-2 w-full">
                  <ShButton @click="openedBranchSelection = true; opened = false;" class="w-full" size="sm" :variant="branchs.find(b => b.id == selectedBranch?.id) ? 'success' : 'default'">{{ selectedBranch ? `Выбран филиал: ${selectedBranch?.name}` : 'Выбрать филиал' }}</ShButton>
                </div>
                <div v-else-if="deliveryType === 'cords'" class="mt-2 w-full flex">
                  <ShSelect v-model="deliveryCordsData.world">
                    <ShSelectTrigger>
                      <ShButton variant="outline"><ShSelectValue placeholder="Выберите мир" /></ShButton>
                    </ShSelectTrigger>
                    <ShSelectContent>
                      <ShSelectGroup>
                        <ShSelectItem v-for="item in deliveryWorlds"
                                      :key="item.value"
                                      :value="item.value">
                          {{item.label}}
                        </ShSelectItem>
                      </ShSelectGroup>
                    </ShSelectContent>
                  </ShSelect>
                  <ShInput style="width: 25%" v-model="deliveryCordsData.x" type="number" :max="9_999_999" size="small" />
                  <ShInput style="width: 25%" v-model="deliveryCordsData.y" type="number" :max="9_999_999" size="small" />
                  <ShInput style="width: 25%" v-model="deliveryCordsData.z" type="number" :max="9_999_999" size="small" />
                </div>
              </transition>
            </div>
            <div class="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 my-4">
              <div class="font-rubik flex text-base font-extralight opacity-75">
                <p class="flex-1">Товары, {{cart.reduce((sum, product) => sum + product.picked, 0)}} шт.</p>
                <p>{{ cart.reduce((sum, product) => sum + product.price * product.picked, 0) }} АР</p>
              </div>
              <div class="font-rubik flex text-base font-extralight opacity-75">
                <p class="flex-1">Доставка</p>
                <p>Бесплатно</p>
              </div>
              <div class="font-rubik flex text-base font-extralight opacity-75">
                <p class="flex-1">Упаковка [На {{cart.reduce((sum, product) => sum + product.slots_count * product.picked, 0)}} слотов]</p>
                <p>Бесплатно</p>
              </div>
              <ShSeparator class="my-6" />
              <div class="font-rubik flex text-2xl">
                <p class="flex-1">Итого</p>
                <p>{{ cart.reduce((sum, product) => sum + product.price * product.picked, 0) }} АР</p>
              </div>
            </div>
            <ShButton @click="buy" class="w-full">Заказать</ShButton>
          </div>
        </ShSheetFooter>
      </ShSheetContent>
    </ShSheet>
    <div class="fixed bottom-6 right-6 z-20 transform duration-500"
         :class="opened || cart.length === 0 ? 'translate-x-full opacity-0' : ''">
      <ShBadge variant="destructive" class="absolute -top-2 -right-1">
        {{cart.length}}
      </ShBadge>
      <button @click="opened = true"
              class="bg-secondary-dark hover:bg-primary-dark w-14 h-14 rounded-full flex justify-center items-center cursor-pointer">
        <Icon name="lucide:shopping-cart" size="28" class="text-white dark:text-black" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-leave-active {
  position: absolute;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>