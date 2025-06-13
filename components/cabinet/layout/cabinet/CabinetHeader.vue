<script setup lang="ts">
const {user} = useUser()

const route = useRoute()

const pathIdTitles = {
  cabinet: "Кабинет",
}

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

const breadcrumbPath = ref<{ title: string, to: string, latest?: boolean }[]>([])

watch(
    () => route.path,
    () => {
      const pathList = route.path.split('/').slice(1)
      breadcrumbPath.value = pathList.map((pathItem, index) => ({
        title: pathIdTitles[pathItem] ?? decodeURIComponent(pathItem),
        to: '/' + pathList.slice(0, index + 1).join('/'),
        item: pathItem,
        latest: index + 1 === pathList.length
      }))
    },
    {immediate: true}
)
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
                <ShBreadcrumbPage v-if="breadcrumbItem.latest">
                  {{ breadcrumbItem.title }}
                </ShBreadcrumbPage>
                <ShBreadcrumbLink v-else :to="breadcrumbItem.to">
                  {{ breadcrumbItem.title }}
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