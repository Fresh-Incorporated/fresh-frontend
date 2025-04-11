<script setup lang="ts">

import InBeta from "~/components/global/InBeta.vue";
</script>

<template>
<div class="flex flex-col min-h-screen">
  <Header />
  <div class="flex-1">
    <slot />
  </div>
  <Footer />
  <InBeta />
</div>
</template>

<style scoped>

</style>