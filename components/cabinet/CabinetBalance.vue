<script setup lang="ts">
const {user} = useUser()
</script>

<template>
  <ShCard blur>
    <ShCardHeader>
      <ShCardDescription>Баланс</ShCardDescription>
      <ShCardTitle class="text-2xl text-primary font-rubik">{{user?.balance?.toFixed(2)}} АР</ShCardTitle>
      <ShCardAction>
        <ShBadge variant="outline">
          <Icon name="lucide:trending-up" />
          +12.5%
        </ShBadge>
      </ShCardAction>
    </ShCardHeader>
    <ShCardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="line-clamp-1 flex gap-2 font-medium">
        На этой неделе ваш баланс вырос <Icon name="lucide:trending-up" />
      </div>
      <div class="text-muted-foreground">
        Спасибо что используете проект!
      </div>
    </ShCardFooter>
  </ShCard>
</template>

<style scoped>

</style>