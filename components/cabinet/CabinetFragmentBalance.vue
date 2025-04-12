<script setup lang="ts">
import {http} from "~/composables/useHttp";

const {user, updateUser} = useUser()

const openedDepositDialog = ref(false)
const depositValue = ref(1)

const openedWithdrawDialog = ref(false)
const withdrawCard = ref("")
const withdrawValue = ref(1)

const deposit = async () => {
  const response = await http.get("users/@me/deposit", {
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
  const response = await http.post("users/@me/withdraw", {
    receiver: withdrawCard.value,
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
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-sky-900 h-64 relative overflow-hidden">
    <el-dialog
        v-model="openedDepositDialog"
        title="Пополнение баланса"
        width="300"
    >
      <el-input-number v-model="depositValue" placeholder="Value" :min="1" :max="1728" />
      <template #footer>
        <div class="flex justify-end">
          <el-button type="primary" @click="deposit">
            Пополнить
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        v-model="openedWithdrawDialog"
        title="Пополнение баланса"
        width="300"
    >
      <el-input-number v-model="withdrawValue" placeholder="Value" :min="1" :max="1728" />
      <el-input v-model="withdrawCard" placeholder="Value" :minlength="5" :maxlength="5" />
      <template #footer>
        <div class="flex justify-end">
          <el-button type="primary" @click="withdraw">
            Вывести
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="absolute w-12 h-12 bg-sky-900 blur-2xl"></div>
    <div class="absolute w-40 h-40 bottom-0 right-0 translate-x-10 translate-y-10 rotate-8">
      <img class="w-full h-full opacity-50" src="https://img.zaralx.ru/v1/minecraft/deepslate_diamond_ore" alt="">
    </div>
    <div class="absolute w-12 h-12 bg-sky-900 blur-2xl bottom-0 right-0"></div>
    <div class="flex flex-col justify-center items-center w-full h-full font-medium absolute z-10">
      <div>
        <p class="text-lg">Ваш баланс</p>
      </div>
      <div>
        <p class="absolute text-sky-500 font-rubik text-2xl blur-sm opacity-50">{{user?.balance}} АР</p>
        <p class="text-sky-500 font-rubik text-2xl">{{user?.balance}} АР</p>
      </div>
      <div class="relative w-full mt-2">
        <div class="absolute w-full flex justify-center gap-2">
          <button @click="openedDepositDialog = true" class="border w-6 h-6 flex justify-center items-center text-xs rounded-md shadow-lg border-green-600 text-green-600 hover:text-white hover:bg-green-600 duration-200"><i class="pi pi-arrow-up"></i></button>
          <button @click="openedWithdrawDialog = true" class="border w-6 h-6 flex justify-center items-center text-xs rounded-md shadow-lg border-red-600 text-red-600 hover:text-white hover:bg-red-600 duration-200"><i class="pi pi-arrow-down"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>