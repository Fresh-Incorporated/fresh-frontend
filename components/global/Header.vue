<script setup lang="ts">
const colorMode = useColorMode()

const isDark = ref(false)
const route = useRoute()

onMounted(() => {
  isDark.value = colorMode.preference === 'dark'
})

watch(isDark, () => {
  colorMode.preference = isDark.value ? 'dark' : 'light';
})

const links = [
  {
    title: "Главная",
    to: "/"
  },
  {
    title: "Тест",
    to: "/test"
  },
  {
    title: "FreshMarket",
    to: "/freshmarket"
  }
]
</script>

<template>
  <el-affix>
    <div class="h-14 w-full bg-black/[.05] dark:bg-black/[.2] backdrop-blur border-b-[1px] border-neutral-200 dark:border-neutral-800 shadow-sm dark:shadow-lg py-1 md:px-16 z-10">
      <div
          class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:16px_16px] -z-10"
      ></div>
      <div class="flex h-full">
        <div class="flex items-center h-full gap-1 w-60">
<!--          <img class="h-8" src="/logo.svg" alt="">-->
          <p class="absolute font-rubik text-xl blur-sm opacity-50">Fresh Inc.</p>
          <p class="font-rubik text-xl">Fresh Inc.</p>
        </div>
        <div class="w-full flex justify-center items-center gap-2">
          <NuxtLink v-for="link in links" :to="link.to">
            <ElButton text round :bg="route.path === link.to">
              {{link.title}}
            </ElButton>
          </NuxtLink>
        </div>
        <div class="flex h-full w-60 justify-center items-center gap-4">
          <el-switch
              v-model="isDark"
              style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #ffffff"
              :active-action-icon="ElIconMoon"
              :inactive-action-icon="ElIconSunny"
          >
            <template #active-action>
              <div class="bg-neutral-900 !w-5 !h-5 aspect-square rounded-full flex justify-center items-center text-xs text-neutral-300">
                <i class="pi pi-moon"></i>
              </div>
            </template>
            <template #inactive-action>
              <div class="bg-neutral-200 !w-5 !h-5 aspect-square rounded-full flex justify-center items-center text-xs text-neutral-700">
                <i class="pi pi-sun"></i>
              </div>
            </template>
          </el-switch>
          <ElButton>
            <div class="flex gap-1">
              <i class="pi pi-user"></i>
              Войти
            </div>
          </ElButton>
        </div>
      </div>
    </div>
  </el-affix>
</template>

<style scoped>

</style>