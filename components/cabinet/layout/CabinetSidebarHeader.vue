<script setup lang="ts">
const {user, shops} = useUser()
</script>

<template>
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
</template>

<style scoped>

</style>