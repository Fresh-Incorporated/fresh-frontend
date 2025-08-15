<script setup lang="ts">
const {user, userLoading} = useUser()

const route = useRoute()

const groups = [
  {
    name: "Директор",
    icon: "lucide:settings",
    starts: "/cabinet/freshmarket/work/director",
    to: "/cabinet/freshmarket/work/director/stats",
    fm_worker_min: 4,
    links: [
      {
        name: "Статистика",
        to: "/cabinet/freshmarket/work/director/stats",
      },
      {
        name: "Зарплата",
        to: "/cabinet/freshmarket/work/director/salary",
      },
      {
        name: "Локации",
        to: "/cabinet/freshmarket/work/director/locations",
      }
    ]
  },
  {
    name: "Секретарь",
    icon: "lucide:settings",
    starts: "/cabinet/freshmarket/work/secretary",
    to: "/cabinet/freshmarket/work/secretary/verify/shops",
    fm_worker_min: 3,
    links: [
      {
        name: "Проверка магазинов",
        to: "/cabinet/freshmarket/work/secretary/verify/shops",
      },
      {
        name: "Проверка товаров",
        to: "/cabinet/freshmarket/work/secretary/verify/products",
      },
      {
        name: "Товары и магазины",
        to: "/cabinet/freshmarket/work/secretary/editor",
      },
      {
        name: "Заказы",
        to: "/cabinet/freshmarket/work/secretary/orders",
      },
    ]
  },
  {
    name: "Логист",
    icon: "lucide:settings",
    starts: "/cabinet/freshmarket/work/logic",
    to: "/cabinet/freshmarket/work/logic/refill",
    fm_worker_min: 2,
    links: [
      {
        name: "Пополнение товара",
        to: "/cabinet/freshmarket/work/logic/refill",
      },
      {
        name: "Сбор заказов",
        to: "/cabinet/freshmarket/work/logic/collect",
      },
      {
        name: "Ячейки",
        to: "/cabinet/freshmarket/work/logic/cells",
      }
    ]
  },
  {
    name: "Курьер",
    icon: "lucide:settings",
    starts: "/cabinet/freshmarket/work/delivery",
    to: "/cabinet/freshmarket/work/delivery",
    fm_worker_min: 1,
  },
]
</script>

<template>
  <ShCollapsible v-if="!userLoading && user?.fm_worker > 0" defaultOpen class="group/collapsible-group">
    <ShSidebarGroup>
      <ShSidebarGroupLabel>
        <ShCollapsibleTrigger>
          FreshMarket Работа
        </ShCollapsibleTrigger>
      </ShSidebarGroupLabel>
      <ShCollapsibleContent>
        <ShSidebarMenu>
          <ShCollapsible
              v-for="group in groups"
              as-child
              :default-open="route.path.startsWith(group.starts)"
              class="group/collapsible"
          >
            <ShSidebarMenuItem v-if="!userLoading && user?.fm_worker >= group?.fm_worker_min">
              <ShCollapsibleTrigger as-child>
                <NuxtLink :to="group.to">
                  <ShSidebarMenuButton :class="{'!bg-primary/10': route.path.startsWith(group.starts)}" tooltip="tutle">
                    <Icon :name="group.icon" size="16"/>
                    <span class="group-data-[collapsible=icon]:hidden">{{ group.name }}</span>
                    <div v-if="group.links" class="group-data-[collapsible=icon]:hidden ml-auto flex justify-center items-center">
                      <Icon  name="lucide:chevron-right"
                             class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                    </div>
                  </ShSidebarMenuButton>
                </NuxtLink>
              </ShCollapsibleTrigger>
              <ShCollapsibleContent v-if="group.links">
                <ShSidebarMenuSub v-for="link in group.links" :key="link.name">
                  <ShSidebarMenuSubItem>
                    <ShSidebarMenuSubButton as-child>
                      <NuxtLink :to="link.to" :class="{'!bg-sidebar-accent': route.path.startsWith(link.to)}">
                        {{ link.name }}
                      </NuxtLink>
                    </ShSidebarMenuSubButton>
                  </ShSidebarMenuSubItem>
                </ShSidebarMenuSub>
              </ShCollapsibleContent>
            </ShSidebarMenuItem>
          </ShCollapsible>
        </ShSidebarMenu>
      </ShCollapsibleContent>
    </ShSidebarGroup>
  </ShCollapsible>
</template>

<style scoped>

</style>