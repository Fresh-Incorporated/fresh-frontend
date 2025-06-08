<script setup lang="ts">
const colorMode = useColorMode()

const isDark = ref(false)
const route = useRoute()
const {user, userLoading, logout, orders} = useUser();

onMounted(() => {
  isDark.value = colorMode.preference === 'dark' || colorMode.preference === 'system'
})

watch(isDark, () => {
  colorMode.preference = isDark.value ? 'dark' : 'light';
})

const links = computed(() => {
  let defaultLinks = [
    {
      title: "Главная",
      to: "/"
    },
    {
      title: "FreshMarket",
      to: "/freshmarket"
    }
  ]

  if (user.value?.fm_worker > 0) {
    defaultLinks.push({
      title: "Я работник",
      to: "/freshmarket/work"
    })
  }

  return defaultLinks
})

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

const isDev = import.meta.dev;
</script>

<template>
  <div :class="mobileNav ? '' : 'translate-x-full'"
       class="fixed w-full h-screen mt-14 bg-neutral-100 dark:bg-neutral-900 z-30 duration-500 flex flex-col gap-1">
    <NuxtLink @click="mobileNav = false" v-for="link in links" :to="link.to">
      <ShButton :variant="route.path === link.to ? 'secondary' : 'ghost'" class="w-full rounded-none" size="sm">
        {{ link.title }}
      </ShButton>
    </NuxtLink>
  </div>
  <div class="h-14"></div>
  <div class="fixed w-full z-30">
    <div
        class="h-14 w-full bg-neutral-50/[.9] dark:bg-neutral-900/[.9] backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 shadow-xs dark:shadow-lg py-1 px-2 md:px-16 z-10">
      <div
          class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-size-[16px_16px] -z-10"
      ></div>
      <div class="flex items-center h-full">
        <div class="md:hidden">
          <ShButton variant="ghost" :class="mobileNav ? 'rotate-180' : ''" @click="mobileNav = !mobileNav"
                  class="duration-500">
            <Icon name="lucide:menu" size="16" />
          </ShButton>
        </div>
        <NuxtLink to="/" class="hidden md:flex items-center h-full gap-1 md:w-60 ml-2 md:ml-0">
          <!--          <img class="h-8" src="/logo.svg" alt="">-->
          <p class="absolute font-rubik text-xl blur-xs opacity-0 dark:opacity-50 select-none">Fresh Inc.</p>
          <p class="font-rubik text-xl text-nowrap">Fresh Inc.</p>
        </NuxtLink>
        <div class="w-full hidden md:flex justify-center items-center gap-2">
          <NuxtLink v-for="link in links" :to="link.to">
            <ShButton :variant="route.path === link.to ? 'secondary' : 'ghost'" size="sm">
              {{ link.title }}
            </ShButton>
          </NuxtLink>
        </div>
        <div class="flex h-full w-full md:w-60 justify-end items-center gap-4">
          <NuxtLink to="/freshmarket/orders">
            <ShButton :variant="route.path === '/freshmarket/orders' ? 'secondary' : 'ghost'" size="icon">
              <Icon name="lucide:truck" class="inverted" size="16" />
            </ShButton>
          </NuxtLink>
          <ShButton
              @click="isDark = !isDark"
              variant="ghost"
              size="icon"
          >
            <Icon :name="isDark ? 'lucide:sun-medium' : 'lucide:moon'" class="inverted" size="16" />
          </ShButton>
          <div v-if="user && !userLoading"
               class="h-full flex flex-col items-center justify-center border rounded-lg border-neutral-200 dark:border-neutral-800 bg-neutral-100/[0.5] dark:bg-neutral-900/[0.5] hover:bg-neutral-300/[0.25] dark:hover:bg-neutral-950/[0.25] duration-500 select-none">
            <div ref="userMenuButton" @click="userMenu = !userMenu"
                 class="flex items-center gap-2 py-1 px-1 cursor-pointer">
              <div class="h-full max-w-24 sm:max-w-52 md:max-w-24 lg:max-w-48 lg:min-w-24">
                <p class="text-sm truncate font-medium text-right">{{ user.nickname }}</p>
                <div class="grid grid-cols-2">
                  <div class="flex items-center justify-end gap-0.5">
                    <p class="font-rubik text-xs text-cyan-500 text-nowrap">{{ user.balance.toFixed(2) }}</p>
                    <img class="w-3 h-3"
                         src="https://assets.zaralx.ru/api/v1/minecraft/vanilla/item/deepslate_diamond_ore/icon" alt="">
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
                  <div v-if="userMenu"
                       class="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
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
                    <ShAlertDialog>
                      <ShAlertDialogTrigger class="w-full">
                        <div ref="exitMenuButton" class="w-full font-medium cursor-pointer">
                          <p :class="'text-red-500'"
                             class="text-center py-2 hover:bg-white/[0.05] duration-500 rounded-b-lg flex justify-end items-center gap-1 px-2">
                            <i class="pi pi-sign-out"></i> <span class="flex-1">Выйти</span></p>
                        </div>
                      </ShAlertDialogTrigger>
                      <ShAlertDialogContent>
                        <ShAlertDialogHeader>
                          <ShAlertDialogTitle>Вы уверены что хотите выйти?</ShAlertDialogTitle>
                          <ShAlertDialogDescription>
                            Для подтверждения нажмите на кнопку ниже
                          </ShAlertDialogDescription>
                        </ShAlertDialogHeader>
                        <ShAlertDialogFooter>
                          <ShAlertDialogCancel>Отмена</ShAlertDialogCancel>
                          <ShButton @click="logout" variant="destructive">
                            Выйти
                          </ShButton>
                        </ShAlertDialogFooter>
                      </ShAlertDialogContent>
                    </ShAlertDialog>
                    <div class="relative">
                      <div class="absolute w-4 h-4 bg-white rounded-full blur-xl right-0"></div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <ShButton variant="outline" as="a"
                    v-if="userLoading || !user"
                    :loading="userLoading"
                    size="sm"
                    :href="isDev ?
          'https://discord.com/oauth2/authorize?client_id=1053625870272704613&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord%2Fend&scope=identify' :
          'https://discord.com/oauth2/authorize?client_id=1053625870272704613&response_type=code&redirect_uri=https%3A%2F%2Ffresh.zaralx.ru%2Fauth%2Fdiscord%2Fend&scope=identify'">
            <div class="flex gap-1">
              Войти
            </div>
          </ShButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.usermenu-enter-active,
.usermenu-leave-active {
  transition: all 0.5s ease;
  @apply transform translate-y-0;
}

.usermenu-enter-from,
.usermenu-leave-to {
  opacity: 0;
  @apply transform -translate-y-full;
}
</style>