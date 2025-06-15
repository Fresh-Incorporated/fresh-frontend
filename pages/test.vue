<script setup lang="ts">

</script>

<template>
  <Button>Basic Button</Button>
  <ShButton>Shadcn Button</ShButton>
  <ShCarousel class="relative w-full max-w-xs mx-24">
    <ShCarouselContent>
      <ShCarouselItem v-for="(_, index) in 5" :key="index">
        <div class="p-1">
          <ShCard>
            <ShCardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{{ index + 1 }}</span>
            </ShCardContent>
          </ShCard>
        </div>
      </ShCarouselItem>
    </ShCarouselContent>
    <ShCarouselPrevious infinity />
    <ShCarouselNext infinity />
  </ShCarousel>
</template>

<style scoped>

</style>