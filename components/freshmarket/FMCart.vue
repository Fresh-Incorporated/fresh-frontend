<script setup lang="ts">
const {cart, putInCart} = useUser()

const opened = ref(false)

const deliveryTypes = [{
  label: "Филиал",
  value: "branch"
},{
  label: "Координаты",
  value: "cords",
  disabled: true
}]
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
</script>

<template>
  <div>
    <el-drawer
        v-model="opened"
        title="Корзина"
        direction="rtl"
    >
      <div class="flex flex-col w-full h-full">
        <div class="flex-1">
          <el-scrollbar height="100%">
            <div v-for="product in cart" class="bg-neutral-900 flex rounded-lg p-2 gap-2 mb-2 relative">
              <div class="w-24 h-24">
                <img :src="product.icon" class="w-full h-full rounded-lg" alt="">
              </div>
              <div class="flex-1">
                <p class="text-lg font-onest">{{ product.name }}</p>
                <p class="text-xs line-clamp-4">
                  {{ product.description }}{{ product.description }}{{ product.description }}</p>
              </div>
              <div class="h-full w-24">
                <div class="flex w-full">
                  <button @click="putInCart(product, -1)"
                          class="w-6 h-6 rounded-lg flex justify-center items-center text-xs bg-neutral-800">
                    <i class="pi" :class="product.picked > 1 ? 'pi-minus' : 'pi-trash'"></i></button>
                  <div class="h-full w-12 flex justify-center items-center text-center">
                    {{ product?.picked }}
                  </div>
                  <button @click="putInCart(product, 1)"
                          class="w-6 h-6 rounded-lg flex justify-center items-center text-xs bg-neutral-800">
                    <i class="pi pi-plus"></i></button>
                </div>
                <div class="font-montserrat absolute bottom-2 right-4 text-right">
<!--                  <p class="text-sm font-medium">Цена</p>-->
                  <p class="text-primary-dark font-onest text-lg font-semibold">{{product.price * product.picked}} АР</p>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="w-full">
          <div class="relative">
            <el-segmented v-model="deliveryType" :options="deliveryTypes" block />
            <transition>
              <div v-if="deliveryType === 'branch'" class="mt-2 w-full">
                <el-button class="w-full" type="primary" size="small">Выбрать филиал</el-button>
              </div>
              <div v-else-if="deliveryType === 'cords'" class="mt-2 w-full flex">
                <el-select
                    v-model="deliveryCordsData.world"
                    placeholder="Мир"
                    size="small"
                    style="width: 25%"
                >
                  <el-option
                      v-for="item in deliveryWorlds"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
                <el-input style="width: 25%" v-model="deliveryCordsData.x" type="number" :max="9_999_999" size="small" />
                <el-input style="width: 25%" v-model="deliveryCordsData.y" type="number" :max="9_999_999" size="small" />
                <el-input style="width: 25%" v-model="deliveryCordsData.z" type="number" :max="9_999_999" size="small" />
              </div>
            </transition>
          </div>
          <div class="bg-neutral-900 rounded-lg p-4 my-4">
            <div class="font-rubik flex text-base font-extralight opacity-75">
              <p class="flex-1">Доставка</p>
              <p>Бесплатно</p>
            </div>
            <div class="font-rubik flex text-base font-extralight opacity-75">
              <p class="flex-1">Товары, {{cart.reduce((sum, product) => sum + product.picked, 0)}} шт.</p>
              <p>{{ cart.reduce((sum, product) => sum + product.price * product.picked, 0) }} АР</p>
            </div>
            <el-divider border-style="dashed" />
            <div class="font-rubik flex text-2xl">
              <p class="flex-1">Итого</p>
              <p>{{ cart.reduce((sum, product) => sum + product.price * product.picked, 0) }} АР</p>
            </div>
          </div>
          <el-button class="w-full" type="primary" size="large">Заказать</el-button>
        </div>
      </div>
    </el-drawer>
    <div class="fixed bottom-6 right-6 z-20 transform duration-500"
         :class="opened || cart.length === 0 ? 'translate-x-full opacity-0' : ''">
      <el-badge :value="cart.length" :max="9" class="item">
        <button @click="opened = true"
                class="bg-secondary-dark hover:bg-primary-dark w-14 h-14 rounded-full flex justify-center items-center cursor-pointer">
          <i class="pi pi-shopping-cart text-2xl shadow-lg text-black"></i>
        </button>
      </el-badge>
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