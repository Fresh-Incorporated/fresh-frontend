<script setup lang="ts">
const { user, shops } = useUser()

const route = useRoute()

const pathIdTitles = {
  cabinet: "Кабинет",
}

const currentShopName = computed(() => {
  return shops?.value?.find((shop) => shop?.id == route?.params?.shop)?.name
})
watch(route, () => console.log(route))

const links = computed(() => {
  return [
    {
      title: "Главная",
      to: "/"
    },
    {
      title: "FreshMarket",
      to: "/freshmarket"
    }
  ]
})

const breadcrumbPath = computed(() => {
  const pathList = route.path.split('/').slice(1)

  return pathList.reduce((acc, pathItem, index) => {
    const title = decodeURIComponent(pathItem);
    const to = '/' + pathList.slice(0, index + 1).join('/');

    let finalTitle = translationDictionary?.[title];
    if (currentShopName.value != null && to.startsWith('/cabinet/freshmarket/shop/') && (/^\d+$/.test(pathItem))) {
      acc.push({
        title: "Магазин \"" + currentShopName.value + "\"",
        to: to,
        item: pathItem,
      });
    } else if (finalTitle) {
      acc.push({
        title: finalTitle,
        to: to,
        item: pathItem,
      });
    }
    return acc;
  }, [])
})

const translationDictionary = {
  'cabinet': 'Кабинет',
  'settings': "Настройки",
  'logic': 'Логистика',
  'delivery': 'Доставка',
  'secretary': 'Секретарь',
  'director': 'Директор',
  'stats': 'Статистика',
  'orders': 'Заказы',
  'products': 'Товары',
  'shops': 'Магазины',
  'editor': 'Редактор',
}


</script>

<template>
  <header>
    <div class="h-12 bg-sidebar border-b border-sidebar-border w-full flex items-center">
      <div class="flex-1 flex justify-center items-center">
        <NuxtLink v-for="link in links" :to="link.to">
          <ShButton :variant="route.path === link.to ? 'secondary' : 'ghost'" size="sm">
            {{ link.title }}
          </ShButton>
        </NuxtLink>
      </div>
      <div class="flex items-center">
        <ThemeButton />
        <NuxtLink to="/public" class="hidden md:flex items-center h-full gap-1 mx-8">
          <!--          <img class="h-8" src="/logo.svg" alt="">-->
          <p class="absolute font-rubik text-xl blur-xs opacity-0 dark:opacity-50 select-none">Fresh Incorporated</p>
          <p class="font-rubik text-xl text-nowrap">Fresh Incorporated</p>
        </NuxtLink>
      </div>
    </div>
    <div class="transition-all sticky top-0 bg-background flex shrink-0 items-center gap-2 ease-linear h-12">
      <div class="flex items-center gap-2 px-4">
        <ShSidebarTrigger class="-ml-1"/>
        <ShSeparator orientation="vertical" class="mr-2 !h-4"/>
        <ShBreadcrumb>
          <ShBreadcrumbList>
            <template v-for="(breadcrumbItem, index) in breadcrumbPath" :key="breadcrumbItem.title">
              <ShBreadcrumbItem>
                <ShBreadcrumbPage v-if="index + 1 == breadcrumbPath.length">
                  {{ breadcrumbItem.title }}
                </ShBreadcrumbPage>
                <ShBreadcrumbLink v-else as-child>
                  <NuxtLink :to="breadcrumbItem.to">{{ breadcrumbItem.title }}</NuxtLink>
                </ShBreadcrumbLink>
              </ShBreadcrumbItem>
              <ShBreadcrumbSeparator v-if="index < breadcrumbPath.length - 1"/>
            </template>
          </ShBreadcrumbList>
        </ShBreadcrumb>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>