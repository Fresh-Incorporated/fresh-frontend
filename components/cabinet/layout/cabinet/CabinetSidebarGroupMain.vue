<script setup lang="ts">
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
  },
  {
    icon: "lucide:package",
    name: "Доставки",
    to: "/cabinet/freshmarket/orders",
  }
]
</script>

<template>
  <ShSidebarGroup>
    <ShSidebarGroupLabel>Основное</ShSidebarGroupLabel>
    <ShSidebarGroupContent>
      <ShSidebarMenu>
        <ShSidebarMenuItem v-for="link in links" :key="link.name">
          <NuxtLink :to="link.to" >
            <ShSidebarMenuButton :class="{
                '!bg-primary/[.1]': route.matched[0].path === link.to,
              }" class="transition-all" :tooltip="link.name">
              <div class="w-4 h-4">
                <Icon :name="link.icon" size="16"/>
              </div>
              <span class="group-data-[collapsible=icon]:hidden">{{ link.name }}</span>
            </ShSidebarMenuButton>
          </NuxtLink>
        </ShSidebarMenuItem>
      </ShSidebarMenu>
    </ShSidebarGroupContent>
  </ShSidebarGroup>
</template>

<style scoped>

</style>