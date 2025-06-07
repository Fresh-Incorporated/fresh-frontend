<script setup lang="ts">
import {http} from "~/composables/useHttp";
import CabinetWebpushNotificationsSwitch from "~/components/cabinet/settings/CabinetWebpushNotificationsSwitch.vue";
const {user, userLoading} = useUser()
</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 h-64 lg:col-span-2 relative overflow-hidden">
    <Skeleton v-model="userLoading" class="w-full h-full absolute z-20" />
    <div class="p-2 space-y-2">
      <p class="text-center text-neutral-500">Настройки</p>
      <div class="flex items-center">
        <p class="text-sm">Push-уведомления</p>
        <CabinetWebpushNotificationsSwitch />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>