<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

onMounted(() => {
  if (window.opener) {
    window.opener.postMessage('payment_closed', '*')
  }
  window.close()
})
</script>

<template>
<div class="w-screen h-screen flex justify-center items-center">
  <p>Успешный платёж</p>
</div>
</template>

<style scoped>

</style>