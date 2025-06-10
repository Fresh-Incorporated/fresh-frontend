<script setup lang="ts">
const {user, balanceHistory} = useUser()
</script>

<template>
  <ShCard>
    <ShCardHeader>
      <ShCardDescription>Баланс</ShCardDescription>
      <ShCardTitle class="text-2xl text-primary font-rubik">{{user?.balance?.toFixed(2)}} АР</ShCardTitle>
      <ShCardAction v-if="balanceHistory.length > 0">
        <ShBadge variant="outline" :class="{
          'text-green-500': balanceHistory[0].value > 0,
          'text-red-500': balanceHistory[0].value <= 0,
        }">
          <Icon v-if="balanceHistory[0].value > 0" name="lucide:trending-up" />
          <Icon v-else name="lucide:trending-down" />
          {{balanceHistory[0].value}} АР
        </ShBadge>
      </ShCardAction>
    </ShCardHeader>
<!--    <ShCardFooter class="flex-col items-start gap-1.5 text-sm">-->
<!--&lt;!&ndash;      <div class="line-clamp-1 flex gap-2 font-medium">&ndash;&gt;-->
<!--&lt;!&ndash;        На этой неделе ваш баланс вырос <Icon name="lucide:trending-up" />&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--      <div class="text-muted-foreground">-->
<!--        Спасибо что используете проект!-->
<!--      </div>-->
<!--    </ShCardFooter>-->
  </ShCard>
</template>

<style scoped>

</style>