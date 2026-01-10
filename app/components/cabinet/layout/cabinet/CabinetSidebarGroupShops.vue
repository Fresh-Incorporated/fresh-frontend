<script setup lang="ts">
import CreateShopMenu from "~/components/cabinet/freshmarket/CreateShopMenu.vue";

const {shops, userLoading, user} = useUser()

const route = useRoute()
</script>

<template>
  <ShSidebarGroup>
    <ShSidebarGroupLabel>Магазины</ShSidebarGroupLabel>
    <ShSidebarMenu>
      <ShSkeleton v-if="userLoading" v-for="i in 5" class="w-full h-8" />
      <ShCollapsible
          v-else
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
                        '!bg-sidebar-accent': route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}`) &&
                        !route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}/settings`) &&
                        !route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}/products`),
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
                        '!bg-sidebar-accent': route.path.startsWith(`/cabinet/freshmarket/shop/${shop.id}/products`),
                      }" :to="`/cabinet/freshmarket/shop/${shop.id}/products`">
                    Товары
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
      <ShSidebarMenuItem v-if="user?.co_owns?.length > 0">
        <NuxtLink to="/cabinet/freshmarket/invites">
          <ShSidebarMenuButton tooltip="Приглашения"
                               class="border border-dashed flex justify-center items-center !text-blue-500/[.9] active:text-blue-600/[.9] !border-blue-500/[.9]">
            <div class="w-4 h-4">
              <Icon name="lucide:folder-kanban" size="16"/>
            </div>
            <span
                class="group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:absolute font-medium text-nowrap">
                Приглашения
              </span>
          </ShSidebarMenuButton>
        </NuxtLink>
      </ShSidebarMenuItem>
      <ShSidebarMenuItem v-if="!userLoading">
        <CreateShopMenu>
          <ShSidebarMenuButton tooltip="Создать магазин"
                               class="border border-dashed flex justify-center items-center hover:text-green-500/[.9] active:text-green-600/[.9] hover:border-green-500/[.9]">
            <div class="w-4 h-4">
              <Icon name="lucide:plus" size="16"/>
            </div>
            <span
                class="group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:absolute font-medium text-nowrap">
                Создать магазин
              </span>
          </ShSidebarMenuButton>
        </CreateShopMenu>
      </ShSidebarMenuItem>
    </ShSidebarMenu>
  </ShSidebarGroup>
</template>

<style scoped>

</style>