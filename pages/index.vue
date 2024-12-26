<script setup lang="ts">

</script>

<template>
<div>
  Hello in index page1
  <h1>Color mode: {{ $colorMode.value }}</h1>
  <select v-model="$colorMode.preference">
    <option value="system">System</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
  <el-button @click="ElMessage('hello')">button</el-button>
  <ElButton type="success"><i class="pi pi-bolt"></i> button</ElButton>
  <LazyElButton type="warning">lazy button</LazyElButton>
  <NuxtLink to="/test">test</NuxtLink>

</div>
</template>

<style scoped>

</style>