<script setup lang="ts">
const colorMode = useColorMode()

const isDark = ref(false)

onMounted(() => {
  isDark.value = colorMode.preference === 'dark' || colorMode.preference === 'system'
})

watch(isDark, () => {
  colorMode.preference = isDark.value ? 'dark' : 'light';
})
</script>

<template>
  <ShButton
      @click="isDark = !isDark"
      variant="ghost"
      size="icon"
  >
    <Icon :name="isDark ? 'lucide:sun-medium' : 'lucide:moon'" class="inverted" size="16" />
  </ShButton>
</template>

<style scoped>

</style>