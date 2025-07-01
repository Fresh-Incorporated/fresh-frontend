<script setup lang="ts">
import '/assets/css/sonner.css';

useColorMode()
const { tryLoadUser } = useUser()

onMounted( () => {
  tryLoadUser()
})
</script>

<template>
  <div class="bg-main-light dark:bg-main-dark transition-all duration-500 min-h-screen font-montserrat overflow-x-hidden">
    <NuxtLoadingIndicator :throttle="10" color="#009DFF" error-color="#ff0000" />
    <ShTooltipProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ShTooltipProvider>
    <ShToaster
        position="bottom-left"
        rich-colors
        close-button
    />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  //filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
