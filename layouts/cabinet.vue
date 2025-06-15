<script setup lang="ts">
import CabinetSidebar from "~/components/cabinet/layout/cabinet/CabinetSidebar.vue";
import CabinetHeader from "~/components/cabinet/layout/cabinet/CabinetHeader.vue";

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