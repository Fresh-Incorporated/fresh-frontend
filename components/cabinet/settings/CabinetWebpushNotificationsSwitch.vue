<script setup lang="ts">
import {http} from "~/composables/useHttp";

const notificationsEnabled = ref(false);
const hasSubscription = ref(false);
const loading = ref(false);

onMounted(async () => {
  const sw = await navigator.serviceWorker.ready;
  const subscription = await sw.pushManager.getSubscription();
  hasSubscription.value = !!subscription;
  notificationsEnabled.value = !!subscription;
});

watch(notificationsEnabled, async (value) => {
  loading.value = true;
  const sw = await navigator.serviceWorker.ready;

  if (value) {
    // включение уведомлений
    const sub = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(useRuntimeConfig().public.webPushPublic)
    });
    await http.post('/users/@me/notifications/subscribe', { subscription: sub });
  } else {
    // отключение уведомлений
    const subscription = await sw.pushManager.getSubscription();
    if (subscription) {
      await http.post('/users/@me/notifications/unsubscribe', { endpoint: subscription.endpoint });
      // await subscription.unsubscribe(); antispam db
    }
  }
  loading.value = false;
});

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

const test = async () => {
  await http.post('/users/@me/notifications/test');
};
</script>

<template>
  <div class="flex gap-2">
    <el-switch
        v-model="notificationsEnabled"
        class="ml-2"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        size="small"
        :loading="loading"
    />
    <el-button :disabled="!notificationsEnabled || loading" class="ml-2" @click="test" type="info" plain size="small">Проверить</el-button>
  </div>
</template>

<style scoped>

</style>