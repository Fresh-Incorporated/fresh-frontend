<script setup lang="ts">
const props = withDefaults(defineProps<{
  value?: number
  change?: number
}>(), {
  value: 0,
  change: 0,
})
</script>

<template>
  <ShCard>
    <ShCardHeader>
      <ShCardDescription>Общая выручка</ShCardDescription>
      <ShCardTitle class="text-2xl font-rubik">{{props.value}} АР</ShCardTitle>
      <ShCardAction>
        <ShBadge variant="outline" :class="{
          'text-green-500 border-green-500/[.5]': props.change > 0,
          'text-red-500 border-red-500/[.5]': props.change < 0,
        }">
          <Icon v-if="props.change > 0" name="lucide:trending-up" />
          <Icon v-else name="lucide:trending-down" />
          {{props.change}} АР
        </ShBadge>
      </ShCardAction>
    </ShCardHeader>
    <ShCardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="line-clamp-1 flex gap-2 font-medium">
        На этой неделе выручка выросла <Icon name="lucide:trending-up" />
      </div>
      <div class="text-muted-foreground">
        Продолжайте в том же духе!
      </div>
    </ShCardFooter>
  </ShCard>
</template>

<style scoped>

</style>