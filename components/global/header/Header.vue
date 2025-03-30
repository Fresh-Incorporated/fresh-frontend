<script setup lang="ts">
const colorMode = useColorMode()

const isDark = ref(false)
const route = useRoute()
const {user, userLoading, logout, orders} = useUser();

onMounted(() => {
  isDark.value = colorMode.preference === 'dark' || colorMode.preference === 'system'

  if (user.value?.fm_worker > 0) {
    links.value.push({
      title: "Я работник",
      to: "/freshmarket/work"
    })
  }
})

watch(isDark, () => {
  colorMode.preference = isDark.value ? 'dark' : 'light';
})

watch(user, (newValue) => {
  if (newValue?.fm_worker > 0) {
    links.value.push({
      title: "Я работник",
      to: "/freshmarket/work"
    })
  }
})

const links = ref([
  {
    title: "Главная",
    to: "/"
  },
  {
    title: "FreshMarket",
    to: "/freshmarket"
  }
])

const mobileNav = ref(false)
const userMenu = ref(false)
const userMenuButton = ref(null);
const exitMenuButton = ref(null);

const handleClickOutside = (event) => {
  if (userMenuButton.value && !userMenuButton.value.contains(event.target) && exitMenuButton.value && !exitMenuButton.value.contains(event.target)) {
    userMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div :class="mobileNav ? '' : 'translate-x-full'"
       class="fixed w-full h-screen mt-14 bg-neutral-100 dark:bg-neutral-900 z-30 transform duration-500 flex flex-col gap-1">
    <NuxtLink @click="mobileNav = false" v-for="link in links" :to="link.to">
      <ElButton text :bg="route.path === link.to" class="w-full">
        <div class="w-full">
          {{ link.title }}
        </div>
      </ElButton>
    </NuxtLink>
  </div>
  <el-affix class="z-30">
    <div
        class="h-14 w-full bg-black/[.05] dark:bg-black/[.2] backdrop-blur border-b-[1px] border-neutral-200 dark:border-neutral-800 shadow-sm dark:shadow-lg py-1 px-2 md:px-16 z-10">
      <div
          class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:16px_16px] -z-10"
      ></div>
      <div class="flex items-center h-full">
        <div class="md:hidden">
          <button :class="mobileNav ? 'rotate-180' : ''" @click="mobileNav = !mobileNav"
                  class="text-neutral-400 hover:text-neutral-300 aspect-square w-8 flex justify-center items-center transform duration-500">
            <i class="pi pi-bars"></i>
          </button>
        </div>
        <NuxtLink to="/" class="flex items-center h-full gap-1 md:w-60 ml-2 md:ml-0">
          <!--          <img class="h-8" src="/logo.svg" alt="">-->
          <p class="absolute font-rubik text-xl blur-sm opacity-50 select-none">Fresh Inc.</p>
          <p class="font-rubik text-xl text-nowrap">Fresh Inc.</p>
        </NuxtLink>
        <div class="w-full hidden md:flex justify-center items-center gap-2">
          <NuxtLink v-for="link in links" :to="link.to">
            <ElButton text round :bg="route.path === link.to">
              {{ link.title }}
            </ElButton>
          </NuxtLink>
        </div>
        <div class="flex h-full w-full md:w-60 justify-end items-center gap-4">
          <el-tooltip trigger="hover" content="Доставки" placement="bottom" effect="light">
            <el-badge :value="orders.orders.reduce((sum, order) => sum + (order.status < 5 ? 1 : 0), 0)" :hidden="orders.orders.reduce((sum, order) => sum + (order.status < 5 ? 1 : 0), 0) < 1" :max="9">
              <NuxtLink to="/freshmarket/orders">
                <el-button>
                  <i class="pi pi-truck"></i>
                </el-button>
              </NuxtLink>
            </el-badge>
          </el-tooltip>
          <el-switch
              v-model="isDark"
              style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #ffffff"
              :active-action-icon="ElIconMoon"
              :inactive-action-icon="ElIconSunny"
          >
            <template #active-action>
              <div
                  class="bg-neutral-900 !w-5 !h-5 aspect-square rounded-full flex justify-center items-center text-xs text-neutral-300">
                <i class="pi pi-moon"></i>
              </div>
            </template>
            <template #inactive-action>
              <div
                  class="bg-neutral-200 !w-5 !h-5 aspect-square rounded-full flex justify-center items-center text-xs text-neutral-700">
                <i class="pi pi-sun"></i>
              </div>
            </template>
          </el-switch>
          <div v-if="user && !userLoading"
               class="h-full flex flex-col items-center justify-center border rounded-lg border-neutral-200 dark:border-neutral-800 bg-neutral-900/[0.5] hover:bg-neutral-950/[0.25] duration-500 select-none">
            <div ref="userMenuButton" @click="userMenu = !userMenu" class="flex items-center gap-2 py-1 px-1 cursor-pointer">
              <div class="h-full max-w-24 sm:max-w-52 md:max-w-24 lg:max-w-48 lg:min-w-24">
                <p class="text-sm truncate font-medium text-right">{{ user.nickname }}</p>
                <div class="grid grid-cols-2">
                  <div class="flex items-center justify-end gap-0.5">
                    <p class="font-rubik text-xs text-cyan-500 text-nowrap">{{ user.balance }}</p>
                    <img class="w-3 h-3" src="https://img.zaralx.ru/v1/minecraft/deepslate_diamond_ore" alt="">
                  </div>
                  <div>
                    <p class="font-rubik text-xs text-green-500 text-nowrap text-right">{{ user.bonuses }} <i
                        class="pi pi-asterisk text-[0.6rem]"></i></p>
                  </div>
                </div>
              </div>
              <div class="w-10">
                <img class="w-10 rounded-md pointer-events-none"
                     :src="useXIS().getFullFace(user.uuid)" alt="">
              </div>
            </div>
            <div class="relative w-full">
              <div class="absolute w-full transform translate-y-2 z-50 overflow-hidden">
                <transition name="usermenu">
                  <div v-if="userMenu" class="w-full bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg overflow-hidden">
                    <div class="relative">
                      <div class="absolute w-4 h-4 bg-white rounded-full blur-xl"></div>
                    </div>
                    <NuxtLink to="/cabinet">
                      <div class="w-full font-medium">
                        <p :class="route.path.startsWith('/cabinet') ? 'text-primary-dark' : ''"
                           class="text-center py-2 hover:bg-white/[0.05] duration-500 rounded-t-lg flex justify-end items-center gap-1 px-2">
                          <i class="pi pi-home"></i> <span class="flex-1">Кабинет</span></p>
                      </div>
                    </NuxtLink>
<!--                    <NuxtLink to="/cabinet">-->
<!--                      <div class="w-full font-medium">-->
<!--                        <p :class="'text-neutral-300'"-->
<!--                           class="text-center py-2 hover:bg-white/[0.05] duration-500 flex justify-end items-center gap-1 px-2">-->
<!--                          <i class="pi pi-cog"></i> <span class="flex-1">Настройки</span></p>-->
<!--                      </div>-->
<!--                    </NuxtLink>-->
                    <el-popconfirm @confirm="logout" hide-icon title="Вы уверены что хотите выйти?">
                      <template #reference>
                        <div ref="exitMenuButton" class="w-full font-medium cursor-pointer">
                          <p :class="'text-red-500'"
                             class="text-center py-2 hover:bg-white/[0.05] duration-500 rounded-b-lg flex justify-end items-center gap-1 px-2">
                            <i class="pi pi-sign-out"></i> <span class="flex-1">Выйти</span></p>
                        </div>
                      </template>
                      <template #actions="{ confirm, cancel }">
                        <div>
                          <el-button size="small" @click="cancel">Нет</el-button>
                          <el-button
                              type="danger"
                              plain
                              size="small"
                              @click="confirm"
                          >
                            Да
                          </el-button>
                        </div>
                      </template>
                    </el-popconfirm>
                    <div class="relative">
                      <div class="absolute w-4 h-4 bg-white rounded-full blur-xl right-0"></div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <ElButton tag="a" :href="$freshConfig.discordAuth" v-if="userLoading || !user" :disabled="userLoading">
            <div>
              <transition>
                <div v-if="userLoading">
                  <i class="pi pi-spinner animate-spin text-xs"></i>
                  Входим
                </div>
                <div v-else class="flex gap-1">
                  <i class="pi pi-user"></i>
                  Войти
                </div>
              </transition>
            </div>
          </ElButton>
        </div>
      </div>
    </div>
  </el-affix>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  @apply scale-100;
}

.v-leave-active,
.v-leave-to {
  position: absolute;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  @apply scale-0;
}

.usermenu-enter-active,
.usermenu-leave-active {
  transition: all 0.5s ease;
  @apply translate-y-0;
}

.usermenu-enter-from,
.usermenu-leave-to {
  opacity: 0;
  @apply -translate-y-full;
}
</style>