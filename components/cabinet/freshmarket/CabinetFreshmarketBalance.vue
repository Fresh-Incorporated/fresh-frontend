<script setup lang="ts">
import {http} from "~/composables/useHttp"

const emit = defineEmits(['updateShop'])
const {updateUser} = useUser()

const props = withDefaults(defineProps<{
  value?: number
  change?: number
  shopId?: number
}>(), {
  value: 0,
})

const withdraw = async () => {
  await http.post("/freshmarket/shop/"+props.shopId+"/withdraw")
  await updateUser()
  emit("updateShop")
}
</script>

<template>
  <ShCard>
    <ShCardHeader>
      <ShCardDescription>Баланс</ShCardDescription>
      <ShCardTitle class="text-2xl font-rubik">{{props.value}} АР</ShCardTitle>
      <ShCardAction v-if="change">
        <ShBadge variant="outline" :class="{
          'text-green-500 border-green-500/[.5]': props.change > 0,
          'text-red-500 border-red-500/[.5]': props.change <= 0,
        }">
          <Icon v-if="props.change > 0" name="lucide:trending-up" />
          <Icon v-else name="lucide:trending-down" />
          {{props.change}} АР
        </ShBadge>
      </ShCardAction>
      <ShCardAction>
        <ShButton @click="withdraw" size="xs" variant="outline">
          Вывести средства
        </ShButton>
      </ShCardAction>
    </ShCardHeader>
    <ShCardFooter class="flex-col items-start gap-1.5 text-sm">
      <div class="text-muted-foreground">
        Эти средства нельзя использовать до вывода
      </div>
    </ShCardFooter>
  </ShCard>
</template>

<style scoped>

</style>