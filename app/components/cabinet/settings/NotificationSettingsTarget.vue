<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <div class="space-y-2">
    <ShCard class="flex flex-row items-center justify-between p-4 rounded-sm col-span-2">
      <ShLabel class="text-base block">
        <p>Важные уведомления</p>
        <p class="text-muted-foreground text-sm">Получайте уведомления о приглашении в магазин, изменении прав в магазине, удалении из магазина</p>
      </ShLabel>
      <div>
        <ShSwitch
            v-model="model.priority"
        />
      </div>
    </ShCard>
    <ShCard class="flex flex-row items-center justify-between p-4 rounded-sm col-span-2">
      <ShLabel class="text-base block">
        <p>Уведомления о доставках</p>
        <p class="text-muted-foreground text-sm">Получайте уведомления о доставленном заказе</p>
      </ShLabel>
      <div>
        <ShSwitch
            v-model="model.market_delivered"
        />
      </div>
    </ShCard>
    <ShCard class="flex flex-row items-center justify-between p-4 rounded-sm col-span-2">
      <ShLabel class="text-base block">
        <p>Уведомления магазина</p>
        <p class="text-muted-foreground text-sm">Получайте уведомления о завершенении пополнения, результатах проверки товара или магазина в ваших магазинах</p>
      </ShLabel>
      <div>
        <ShSwitch
            v-model="model.market_shop"
        />
      </div>
    </ShCard>
    <ShCard class="flex flex-row items-center justify-between p-4 rounded-sm col-span-2">
      <ShLabel class="text-base block">
        <p>Уведомления о работе</p>
        <p class="text-muted-foreground text-sm">Получайте уведомления о новых задачах [Для работников FreshMarket]</p>
      </ShLabel>
      <div>
        <ShSwitch
            v-model="model.market_work"
        />
      </div>
    </ShCard>
  </div>
</template>

<style scoped>

</style>