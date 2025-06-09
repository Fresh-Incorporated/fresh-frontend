<script setup lang="ts">
import CabinetSidebar from "~/components/cabinet/layout/CabinetSidebar.vue";
import CabinetHeader from "~/components/cabinet/layout/CabinetHeader.vue";

const {updateShops} = useUser()

onMounted(async () => {
  await updateShops()
})
</script>

<template>
  <div>
    <ShSidebarProvider>
      <CabinetSidebar />
      <ShSidebarInset>
        <CabinetHeader />
        <div class="flex-1">
          <slot />
        </div>
      </ShSidebarInset>
    </ShSidebarProvider>
  </div>
</template>