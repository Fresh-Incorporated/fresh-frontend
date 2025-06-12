<script setup lang="ts">
import CreateShopMenu from "~/components/cabinet/freshmarket/CreateShopMenu.vue";
import CabinetSidebarHeader from "~/components/cabinet/layout/CabinetSidebarHeader.vue";

const {user, shops} = useUser()
const {isMobile} = useDevice()

const route = useRoute()

const links = [
  {
    icon: "lucide:home",
    name: "Главная",
    to: "/cabinet",
  },
  {
    icon: "lucide:settings",
    name: "Настройки",
    to: "/cabinet/settings",
  }
]

</script>

<template>
  <ShSidebar collapsible="icon">
    <CabinetSidebarHeader />
    <ShSidebarContent>
      <ShSidebarGroup>
        <ShSidebarGroupLabel>Основное</ShSidebarGroupLabel>
        <NuxtLink :to="link.to" v-for="link in links" :key="link.name">
          <ShSidebarMenuButton :class="{
            '!bg-primary/[.1]': route.matched[0].path === link.to,
          }" class="transition-all" :tooltip="link.name">
            <div class="w-4 h-4">
              <Icon :name="link.icon" size="16"/>
            </div>
            <span class="group-data-[collapsible=icon]:hidden">{{ link.name }}</span>
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
          <ShCollapsible
              v-for="shop in shops" :key="shop.id"
              as-child
              :open="route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}`)"
              class="group/collapsible"
          >
            <ShSidebarMenuItem>
              <ShCollapsibleTrigger as-child>
                <NuxtLink :to="`/cabinet/freshmarket/shop/${shop.id}`">
                  <ShSidebarMenuButton
                      :tooltip="shop.name" :class="{
                  '!text-red-500': shop.verify_status == -1,
                  '!text-yellow-500': shop.verify_status == 0,
                  '': shop.verify_status == 1,

                  'bg-gradient-to-l from-red-500/[.2]': shop.verify_status == -1,

                  '!bg-primary/[.1]': route.params.shop == shop.id,
                }">
                    <div class="w-4 h-4">
                      <img :src="shop.icon" class="w-full h-full" alt="">
                    </div>
                    <span
                        class="group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:absolute font-medium text-nowrap">{{
                        shop.name
                      }}</span>
                  </ShSidebarMenuButton>
                </NuxtLink>
              </ShCollapsibleTrigger>
              <ShCollapsibleContent>
                <ShSidebarMenuSub>
                  <ShSidebarMenuSubItem>
                    <ShSidebarMenuSubButton as-child>
                      <NuxtLink :class="{
                        '!bg-sidebar-accent': route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}`) && !route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}/settings`),
                      }" :to="`/cabinet/freshmarket/shop/${shop.id}`">
                        Главная
                      </NuxtLink>
                    </ShSidebarMenuSubButton>
                  </ShSidebarMenuSubItem>
                </ShSidebarMenuSub>
                <ShSidebarMenuSub>
                  <ShSidebarMenuSubItem>
                    <ShSidebarMenuSubButton as-child>
                      <NuxtLink :class="{
                        '!bg-sidebar-accent': route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}/settings`),
                      }" :to="`/cabinet/freshmarket/shop/${shop.id}/settings`">
                        Настройки
                      </NuxtLink>
                    </ShSidebarMenuSubButton>
                  </ShSidebarMenuSubItem>
                </ShSidebarMenuSub>
              </ShCollapsibleContent>
            </ShSidebarMenuItem>
          </ShCollapsible>
          <ShSidebarMenuItem>
            <CreateShopMenu>
              <ShSidebarMenuButton tooltip="Создать магазин" class="border border-dashed flex justify-center items-center hover:text-green-500/[.9] active:text-green-600/[.9] hover:border-green-500/[.9]">
                <div class="w-4 h-4">
                  <Icon name="lucide:plus" size="16" />
                </div>
                <span class="group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:absolute font-medium text-nowrap">
                Создать магазин
              </span>
              </ShSidebarMenuButton>
            </CreateShopMenu>
          </ShSidebarMenuItem>
        </ShSidebarMenu>
      </ShSidebarGroup>
    </ShSidebarContent>
    <ShSidebarRail/>
  </ShSidebar>
</template>

<style scoped>

</style>