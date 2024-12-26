<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <div class="bg-main-light dark:bg-main-dark transition-all duration-500 min-h-screen font-montserrat">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
