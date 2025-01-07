<script setup lang="ts">
const {orders} = useUser();

</script>

<template>
<div>
  <div v-for="order in orders?.orders">
    {{order}}
  </div>
</div>
</template>

<style scoped>

</style>