<script setup lang="ts">
const model = defineModel()

const animatedValue = ref(0)

const props = defineProps({
  duration: {
    default: 2000,
    type: Number
  }
})

function animateValue(end: number) {
  const start = 0
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    animatedValue.value = Math.floor(start + (end - start) * progress)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

watch(model, value => {
  animateValue(value)
})
</script>

<template>
{{animatedValue}}
</template>

<style scoped>

</style>