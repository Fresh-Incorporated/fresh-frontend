<script setup lang="ts">
import FMCabinetFragmentSells from "~/components/cabinet/freshmarket/FMCabinetFragmentSells.vue";
import CreateShopMenu from "~/components/cabinet/freshmarket/CreateShopMenu.vue";
import FMCabinetFragmetProducts from "~/components/cabinet/freshmarket/FMCabinetFragmetProducts.vue";
import FMCabinetFragmentCreateProduct from "~/components/cabinet/freshmarket/FMCabinetFragmentCreateProduct.vue";
import FMCabinetFragmetSettings from "~/components/cabinet/freshmarket/FMCabinetFragmetSettings.vue";

definePageMeta({
  layout: 'cabinet'
})

const selectedShop = ref(null)

const { shops, updateShops } = useUser()
const updatingShops = ref(true)

onMounted(async () => {
  await updateShops()
  updatingShops.value = false;
  if (shops.value.length > 0) selectedShop.value = shops.value[0].id
})

const openedCreateMenu = ref(false);
</script>

<template>
  <div>
    <CreateShopMenu v-model="openedCreateMenu" />
    <div v-if="shops.length > 0">
      <div class="flex items-center gap-2 mb-4">
        <p>Выбран магазин:</p>
        <el-select
            v-model="selectedShop"
            placeholder="Выберите магазин"
            style="width: 200px"
        >
          <el-option
              v-for="item in shops"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          >
            <template #default>
              <div class="flex items-center gap-2">
                <img class="w-4 h-4" :src="item.icon" alt="">
                <p>{{item.name}}</p>
              </div>
            </template>
          </el-option>

          <template #label="scope">
            <div class="flex items-center gap-2">
              <img class="w-4 h-4" :src="shops.find(shop => shop.id === scope.value)?.icon" alt="">
              <p>{{scope.label}}</p>
            </div>
          </template>

          <template #footer>
            <el-button class="w-full" size="small" @click="openedCreateMenu = true">
              Создать новый
            </el-button>
          </template>
        </el-select>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        <FMCabinetFragmetProducts />
        <FMCabinetFragmentCreateProduct />
        <FMCabinetFragmetSettings />
        <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64">

        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center">
      <p class="text-xl">У вас нет ни единого магазина</p>
      <el-button @click="openedCreateMenu = true" type="success" plain>
        <p><i class="pi pi-plus text-xs"></i>  Создать</p>
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>