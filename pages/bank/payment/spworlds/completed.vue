<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

onMounted(() => {
  if (window.opener) {
    window.opener.postMessage('payment_closed', '*')
  }
  setTimeout(() => {
    window.close()
  }, 5000)
})
</script>

<template>
<div class="w-screen h-screen flex flex-col justify-center items-center">
  <p>Успешный платёж</p>
  <p class="text-xs">Окно будет автоматически закрыто через 5 секунд</p>
</div>
</template>

<style scoped>

</style>