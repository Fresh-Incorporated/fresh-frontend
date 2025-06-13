<script setup lang="ts">
import CabinetSidebarHeader from "~/components/cabinet/layout/cabinet/CabinetSidebarHeader.vue";
import CabinetSidebarGroupMain from "~/components/cabinet/layout/cabinet/CabinetSidebarGroupMain.vue";
import CabinetSidebarGroupShops from "~/components/cabinet/layout/cabinet/CabinetSidebarGroupShops.vue";
import CabinetSidebarGroupFreshmarketWork
  from "~/components/cabinet/layout/cabinet/CabinetSidebarGroupFreshmarketWork.vue";

const route = useRoute()


</script>

<template>
  <ShSidebar collapsible="icon">
    <CabinetSidebarHeader/>
    <ShSidebarContent>
      <CabinetSidebarGroupMain />
      <CabinetSidebarGroupFreshmarketWork />
      <CabinetSidebarGroupShops />
    </ShSidebarContent>
    <ShSidebarRail/>
  </ShSidebar>
</template>

<style scoped>

</style>