<script setup lang="ts">
import {http} from "~/composables/useHttp";

const notificationsEnabled = ref(false);
const hasSubscription = ref(false);
const loading = ref(false);
const loadedComponent = ref(false);

onMounted(async () => {
  const sw = await navigator.serviceWorker.ready;
  const subscription = await sw.pushManager.getSubscription();
  hasSubscription.value = !!subscription;
  notificationsEnabled.value = !!subscription;
  await nextTick()
  loadedComponent.value = true;
});

watch(notificationsEnabled, async (value) => {
  if (!loadedComponent.value) {
    return
  }
  loading.value = true;
  const sw = await navigator.serviceWorker.ready;

  if (value) {
    // включение уведомлений
    const sub = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(useRuntimeConfig().public.webPushPublic)
    });
    await http.post('/users/@me/notifications/subscribe', {subscription: sub});
  } else {
    // отключение уведомлений
    const subscription = await sw.pushManager.getSubscription();
    if (subscription) {
      await http.post('/users/@me/notifications/unsubscribe', {endpoint: subscription.endpoint});
      // await subscription.unsubscribe(); antispam db
    }
  }
  loading.value = false;
});

function urlBase64ToUint8Array(base64String: string) {
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
  <ShCard outlined class="rounded-sm col-span-2">
    <ShCardHeader>
      <ShCardTitle>Уведомления</ShCardTitle>
      <ShCardDescription>Настройте PUSH-Уведомления в этом разделе</ShCardDescription>
      <ShCardAction>
        <ShButton variant="ghost" :disabled="!notificationsEnabled || loading" @click="test" size="xs">Проверить</ShButton>
      </ShCardAction>
    </ShCardHeader>
    <ShCardContent>
      <ShCard class="flex flex-row items-center justify-between p-4 rounded-sm col-span-2">
        <ShLabel for="webpush-global" class="text-base block">
          <p>Включить уведомления</p>
          <p class="text-muted-foreground text-sm">Получайте уведомления о: проверке магазина, проверке товара, доставке заказа, пополнении товара...</p>
        </ShLabel>
        <ShSwitch
            id="webpush-global"
            v-model="notificationsEnabled"
            class="ml-2"
            :disabled="loading"
        />
      </ShCard>
    </ShCardContent>
  </ShCard>
</template>

<style scoped>

</style>