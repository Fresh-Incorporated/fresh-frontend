<script setup lang="ts">
import {http} from "~/composables/useHttp"

const {user, updateUser, updateShops} = useUser();

definePageMeta({
  layout: 'cabinet'
})

const accept = async (id: number) => {
  const response = await http.post(`/freshmarket/shop/${id}/coop/invites/accept`)

  await updateUser()
  await updateShops()
}

const decline = async (id: number) => {
  const response = await http.post(`/freshmarket/shop/${id}/coop/invites/decline`)

  await updateUser()
  await updateShops()
}
</script>

<template>
<div class="px-2 lg:px-4 w-full gap-4">
  <ShCard outlined class="!p-4">
    <ShCardHeader class="flex-1 p-0">
      <ShCardTitle>Приглашения в магазины</ShCardTitle>
      <ShCardDescription>Попросите владельца другого магазина пригласить вас для совместного управления.</ShCardDescription>
    </ShCardHeader>
    <ShCard v-for="invite in user?.co_owns" class="rounded-sm flex-row items-center">
      <ShCardHeader class="flex-1 flex items-center gap-2">
        <img :src="invite.shop.icon" alt="" class="w-8 h-8">
        <div>
          <ShCardTitle>Приглашение в магазин {{invite.shop.name}}</ShCardTitle>
          <ShCardDescription>Описание: {{invite.shop.description}}</ShCardDescription>
        </div>
      </ShCardHeader>
      <ShCardContent class="flex justify-between gap-2">
        <ShButton
            size="sm"
            variant="success"
            confirmation
            confirmation-title="Принять приглашение"
            @click="accept(invite.shop.id)">Принять</ShButton>
        <ShButton
            size="sm"
            variant="destructive"
            confirmation
            confirmation-title="Отклонить приглашение"
            @click="decline(invite.shop.id)">Отклонить</ShButton>
      </ShCardContent>
    </ShCard>
  </ShCard>
</div>
</template>

<style scoped>

</style>