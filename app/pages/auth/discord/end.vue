<script setup lang="ts">
import { http, loginDiscord } from '~/composables/useHttp';

definePageMeta({
  layout: 'empty'
})

const route = useRoute();
const code = route.query.code;

const timer = ref(5)
const loginStatus = ref("Загрузка..")

onMounted(async () => {
  if (!code) {
    const interval = setInterval(async () => {
      timer.value = timer.value - 1;
      if (timer.value <= 0) {
        window.location = "/"
        clearInterval(interval);
      }
    }, 1000)
  } else {
    loginStatus.value = "Отправка запроса";
    const result = await loginDiscord(code)
    if (result.ok) {
      console.log(result)
      useCookie("access_token", {maxAge: 60 * 60 * 24 * 7}).value = result.tokens.access_token
      useCookie("refresh_token", {maxAge: 60 * 60 * 24 * 7}).value = result.tokens.refresh_token
      loginStatus.value = "Успех";
      // window.location = "/";
    } else {
      loginStatus.value = result.error;
    }
  }
})
</script>

<template>
<div class="w-full h-screen flex justify-center items-center">
  <div class="text-center" v-if="!code">
    <h1 class="text-4xl">Не обнаружен код авторизации</h1>
    <h3 class="text-xl opacity-50">ВОЗВРАЩЕНИЕ НА ГЛАВНУЮ {{timer}}</h3>
  </div>
  <div class="text-center" v-else>
    <h1 class="text-4xl">Выполняется вход</h1>
    <h3 class="text-xl opacity-50">{{loginStatus}}</h3>
  </div>
</div>
</template>

<style scoped>

</style>