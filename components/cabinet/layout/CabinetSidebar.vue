<script setup lang="ts">
const {user, shops} = useUser()
const {isMobile} = useDevice()

</script>

<template>
  <ShSidebar collapsible="icon">
    <ShSidebarHeader>
      <ShSidebarMenu>
        <ShSidebarMenuItem>
          <ShDropdownMenu>
            <ShDropdownMenuTrigger as-child>
              <ShSidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div
                    class="flex aspect-square size-8 min-w-8 items-center justify-center rounded-lg text-sidebar-primary-foreground overflow-hidden">
                  <img :src="useXIS().getFullFace(user?.uuid)" alt="">
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span class="truncate font-semibold">
                        {{ user?.nickname }}
                      </span>
                  <span class="truncate text-xs">Баланс: {{ user?.balance?.toFixed(2) }} АР</span>
                </div>
                <div class="group-data-[collapsible=icon]:hidden">
                  <Icon name="lucide:chevrons-up-down"/>
                </div>
              </ShSidebarMenuButton>
            </ShDropdownMenuTrigger>
            <ShDropdownMenuContent
                class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                :side="isMobile ? 'bottom' : 'right'"
                :side-offset="4"
            >
              <ShDropdownMenuItem
                  class="gap-2 p-2"
              >
                <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                  <img :src="useXIS().getFullFace(user?.uuid)" alt="">
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">
                        {{ user?.nickname }}
                      </span>
                  <span class="truncate text-xs text-neutral-400">Это вы</span>
                </div>
              </ShDropdownMenuItem>
              <ShDropdownMenuSeparator/>
              <ShDropdownMenuItem
                  class="gap-2 p-2"
              >
                <Icon name="lucide:log-out"/>
                Выйти
              </ShDropdownMenuItem>
            </ShDropdownMenuContent>
          </ShDropdownMenu>
        </ShSidebarMenuItem>
      </ShSidebarMenu>
    </ShSidebarHeader>
    <ShSidebarContent>
      <ShSidebarGroup>
        <ShSidebarGroupLabel>Основное</ShSidebarGroupLabel>
        <NuxtLink to="/cabinet">
          <ShSidebarMenuButton tooltip="Главная">
            <Icon name="lucide:home" size="16"/>
            <span class="group-data-[collapsible=icon]:hidden">Главная</span>
          </ShSidebarMenuButton>
        </NuxtLink>
        <NuxtLink to="/cabinet">
          <ShSidebarMenuButton tooltip="Настройки">
            <Icon name="lucide:settings" size="16"/>
            <span class="group-data-[collapsible=icon]:hidden">Настройки</span>
          </ShSidebarMenuButton>
        </NuxtLink>
<!--        <ShSidebarMenu>-->
<!--          <ShCollapsible-->
<!--              as-child-->
<!--              :default-open="true"-->
<!--              class="group/collapsible"-->
<!--          >-->
<!--            <ShSidebarMenuItem>-->
<!--              <ShCollapsibleTrigger as-child>-->
<!--                <ShSidebarMenuButton tooltip="tutle">-->
<!--                  <Icon name="lucide:app-window" size="16"/>-->
<!--                  <span class="group-data-[collapsible=icon]:hidden">Управление</span>-->
<!--                  <div class="group-data-[collapsible=icon]:hidden ml-auto flex justify-center items-center">-->
<!--                    <Icon name="lucide:chevron-right"-->
<!--                          class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>-->
<!--                  </div>-->
<!--                </ShSidebarMenuButton>-->
<!--              </ShCollapsibleTrigger>-->
<!--              <ShCollapsibleContent>-->
<!--                <ShSidebarMenuSub>-->
<!--                  <ShSidebarMenuSubItem>-->
<!--                    <ShSidebarMenuSubButton as-child>-->
<!--                      <a>-->
<!--                        <span>sss</span>-->
<!--                      </a>-->
<!--                    </ShSidebarMenuSubButton>-->
<!--                  </ShSidebarMenuSubItem>-->
<!--                </ShSidebarMenuSub>-->
<!--              </ShCollapsibleContent>-->
<!--            </ShSidebarMenuItem>-->
<!--          </ShCollapsible>-->
<!--        </ShSidebarMenu>-->
      </ShSidebarGroup>
      <ShSidebarGroup>
        <ShSidebarGroupLabel>Магазины</ShSidebarGroupLabel>
        <ShSidebarMenu>
          <ShSidebarMenuItem v-for="shop in shops" :key="shop.id">
            <NuxtLink to="/cabinet/freshmarket_business">
              <ShSidebarMenuButton
                  :tooltip="shop.name" :class="{
                  '!text-red-500': shop.verify_status == -1,
                  '!text-yellow-500': shop.verify_status == 0,
                  '!text-neutral-200': shop.verify_status == 1,

                  'bg-gradient-to-l from-red-500/[.2]': shop.verify_status == -1,
                }">
                <div class="w-4 h-4">
                  <img :src="shop.icon" class="w-full h-full" alt="">
                </div>
                <span
                    class="group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:absolute font-medium text-nowrap">{{
                    shop.name
                  }}</span>
                <div
                    :class="{
                        '!text-red-500': shop.verify_status == -1,
                        '!text-yellow-500': shop.verify_status == 0,
                        '!text-neutral-200': shop.verify_status == 1,
                      }"
                    class="group-data-[collapsible=icon]:hidden ml-auto flex justify-center items-center w-2 h-2 rounded-full">
                  <div
                      :class="{
                        '!text-red-500': shop.verify_status == -1,
                        '!text-yellow-500': shop.verify_status == 0,
                        '!text-neutral-200': shop.verify_status == 1,
                      }"
                      class="w-2 h-2 rounded-full absolute animate-ping"/>
                </div>
              </ShSidebarMenuButton>
            </NuxtLink>
          </ShSidebarMenuItem>
        </ShSidebarMenu>
      </ShSidebarGroup>
    </ShSidebarContent>
    <ShSidebarRail/>
  </ShSidebar>
</template>

<style scoped>

</style>