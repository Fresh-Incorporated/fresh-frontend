<script setup lang="ts">
import {http} from "~/composables/useHttp"

const {user, balanceHistory, updateUser, userLoading} = useUser()

const openedDepositDialog = ref(false)
const depositValue = ref(10)

const openedWithdrawDialog = ref(false)
const withdrawCard = ref("")
const withdrawValue = ref(1)

const deposit = async () => {
  const response = await http.get("/users/@me/deposit", {
    params: {
      value: depositValue.value,
    }
  })
  await navigateTo(response.data.url, {
    open: {
      target: '_blank',
      windowFeatures: {
        width: 500,
        height: 700
      }
    }
  })
  openedDepositDialog.value = false;
}

const withdraw = async () => {
  const response = await http.post("/users/@me/withdraw", {
    receiver: withdrawCard.value.join(""),
    amount: withdrawValue.value,
  })
  openedWithdrawDialog.value = false;
  await updateUser();
}

async function handleMessage(event: MessageEvent) {
  if (event.data === 'payment_closed') {
    await updateUser()
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})

</script>

<template>
  <ShCard v-model:loading="userLoading" class="col-span-1">
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
    <ShCardFooter class="items-start gap-1.5 text-sm">
      <ShDialog v-model:open="openedDepositDialog">
        <ShDialogTrigger as-child>
          <ShButton size="sm" variant="outline"><Icon name="lucide:banknote-arrow-up" size="16" />
            Пополнить
          </ShButton>
        </ShDialogTrigger>
        <ShDialogContent class="sm:max-w-[425px]">
          <ShDialogHeader>
            <ShDialogTitle>Пополнение баланса</ShDialogTitle>
            <ShDialogDescription>
              Введите сумму для пополнения нажмите "Пополнить"
            </ShDialogDescription>
          </ShDialogHeader>
          <div class="grid gap-4 py-4">
            <ShNumberField id="value" :default-value="10" :min="1" :max="Math.min(1728, parseInt(user?.balance ?? 0))" v-model="depositValue">
              <ShLabel for="value">Кол-во АР для пополнения</ShLabel>
              <ShNumberFieldContent>
                <ShNumberFieldDecrement />
                <ShNumberFieldInput />
                <ShNumberFieldIncrement />
              </ShNumberFieldContent>
            </ShNumberField>
          </div>
          <ShDialogFooter>
            <ShButton @click="deposit" type="submit">
              Пополнить
            </ShButton>
          </ShDialogFooter>
        </ShDialogContent>
      </ShDialog>
      <ShDialog v-model:open="openedWithdrawDialog">
        <ShDialogTrigger as-child>
          <ShButton size="sm" variant="outline">
            <Icon name="lucide:banknote-arrow-down" size="16" /> Вывести
          </ShButton>
        </ShDialogTrigger>
        <ShDialogContent class="sm:max-w-[425px]">
          <ShDialogHeader>
            <ShDialogTitle>Вывод средств</ShDialogTitle>
            <ShDialogDescription>
              Введите сумму и карту для вывода, затем нажмите "Вывести"
            </ShDialogDescription>
          </ShDialogHeader>
          <div class="grid gap-4 py-4">
            <ShNumberField id="value" :default-value="10" :min="1" :max="1728" v-model="withdrawValue">
              <ShLabel for="value">Кол-во АР для вывода</ShLabel>
              <ShNumberFieldContent>
                <ShNumberFieldDecrement />
                <ShNumberFieldInput />
                <ShNumberFieldIncrement />
              </ShNumberFieldContent>
            </ShNumberField>
            <div class="flex flex-col gap-2 items-center">
              <ShLabel for="card">Карта SPWorlds для вывода</ShLabel>
              <ShPinInput
                  id="card"
                  v-model="withdrawCard"
                  placeholder="○"
                  otp
                  type="number"
              >
                <ShPinInputGroup>
                  <ShPinInputSlot
                      v-for="(id, index) in 5"
                      :key="id"
                      :index="index"
                  />
                </ShPinInputGroup>
              </ShPinInput>
            </div>
          </div>
          <ShDialogFooter>
            <ShButton @click="withdraw" type="submit">
              Вывести
            </ShButton>
          </ShDialogFooter>
        </ShDialogContent>
      </ShDialog>
    </ShCardFooter>
  </ShCard>
</template>

<style scoped>

</style>