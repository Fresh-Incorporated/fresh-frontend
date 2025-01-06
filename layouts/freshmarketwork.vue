<script setup lang="ts">

const route = useRoute()
const {user} = useUser()

const path = route.path.split("/")
path.splice(0, path.indexOf("work")+1)
const fullPath = ref(["", ...path])
const selected = ref(path.join("-"))

const handleSelect = async (key: string, keyPath: string[]) => {
  selected.value = key;

  fullPath.value = ["", ...keyPath];
  const link = "/freshmarket/work/" + key.replaceAll("-", "/")

  await navigateTo(link)
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex-1 flex">
      <el-menu
          v-model="selected"
          :default-active="selected"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          :collapse="false"
      >
        <el-menu-item index="">
          <div class="h-8 flex items-center gap-2 text-base"><i class="pi pi-crown"></i>Главная</div>
        </el-menu-item>
        <el-sub-menu index="director" :disabled="user?.fm_worker < 4">
          <template #title>
            <div class="h-8 flex items-center gap-2 text-base" :class="fullPath.includes('director') ? 'text-[var(--el-color-primary)]' : ''"><i class="pi pi-crown"></i>Директор</div>
          </template>
          <el-menu-item index="1-0">Общее</el-menu-item>
          <el-menu-item-group title="Информация">
            <el-menu-item index="1-1">Ячейка</el-menu-item>
            <el-menu-item index="1-2">Пользователь</el-menu-item>
            <el-menu-item index="1-2">Локация</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Локации">
            <el-menu-item index="director-location-create">Создать новую</el-menu-item>
            <el-menu-item index="director-location-list">Список</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="secretary" :disabled="user?.fm_worker < 3">
          <template #title>
            <div class="h-8 flex items-center gap-2 text-base" :class="fullPath.includes('secretary') ? 'text-[var(--el-color-primary)]' : ''"><i class="pi pi-crown"></i>Секретарь</div>
          </template>
          <el-menu-item index="secretary-verify_shops">Проверка магазинов</el-menu-item>
          <el-menu-item index="secretary-verify_products">Проверка товаров</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="logic" :disabled="user?.fm_worker < 2">
          <template #title>
            <div class="h-8 flex items-center gap-2 text-base" :class="fullPath.includes('logic') ? 'text-[var(--el-color-primary)]' : ''"><i class="pi pi-crown"></i>Логист</div>
          </template>
          <el-menu-item index="logic-refill">Пополнение товара</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="delivery" :disabled="user?.fm_worker < 1">
          <div class="h-8 flex items-center gap-2 text-base"><i class="pi pi-crown"></i>Курьер</div>
        </el-menu-item>
      </el-menu>
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style scoped>

</style>