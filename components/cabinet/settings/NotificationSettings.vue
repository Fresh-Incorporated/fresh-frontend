<script setup lang="ts">
import {http} from "~/composables/useHttp";
import NotificationSettingsTarget from "~/components/cabinet/settings/NotificationSettingsTarget.vue";

const notificationSettings = ref({
  webpush: {
    priority: false,
    market_shop: false,
    market_delivered: false,
    market_work: false,
  },
  discord: {
    priority: false,
    market_shop: false,
    market_delivered: false,
    market_work: false,
  }
});
const hasSubscription = ref(false);
const loading = ref(false);
const loadedComponent = ref(false);

onMounted(async () => {
  notificationSettings.value = (await http.get('/users/@me/notifications/settings')).data.settings;
  const sw = await navigator.serviceWorker.ready;
  const subscription = await sw.pushManager.getSubscription();
  hasSubscription.value = !!subscription;
  await nextTick()
  loadedComponent.value = true;
});

watch(notificationSettings, async (value) => {
  if (!loadedComponent.value) {
    return
  }
  loading.value = true;

  await http.post('/users/@me/notifications/settings', {settings: value});

  const webpushEnabled = Object.values(value.webpush).includes(true) ?? false

  const sw = await navigator.serviceWorker.ready;

  if (webpushEnabled) {
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
}, {deep: true});

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
  <ShCard outlined class="rounded-sm">
    <ShCardHeader>
      <ShCardTitle>Уведомления</ShCardTitle>
      <ShCardDescription>Настройте уведомления сайта в разные места</ShCardDescription>
      <ShCardAction>
        <ShButton variant="ghost" :disabled="loading" @click="test" size="xs">Проверить</ShButton>
      </ShCardAction>
    </ShCardHeader>
    <ShCardContent class="gap-4 grid xl:grid-cols-2">
      <ShCard class="p-4 rounded-sm">
        <ShLabel for="webpush-global" class="text-base block">
          <p>PUSH-Уведомления</p>
          <p class="text-muted-foreground text-sm">Уведомления из браузера прямо на ваш девайс</p>
        </ShLabel>
        <NotificationSettingsTarget v-model="notificationSettings.webpush" />
      </ShCard>
      <ShCard class="p-4 rounded-sm">
        <ShLabel for="webpush-global" class="text-base block">
          <p>Уведомления в Discord</p>
          <p class="text-muted-foreground text-sm">Уведомления в личные сообщения от нашего Discord бота</p>
        </ShLabel>
        <NotificationSettingsTarget v-model="notificationSettings.discord" />
      </ShCard>
    </ShCardContent>
  </ShCard>
</template>

<style scoped>

</style>