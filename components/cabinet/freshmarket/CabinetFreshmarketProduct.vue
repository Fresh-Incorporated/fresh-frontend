<script setup lang="ts">
import {ref} from "vue";
import {http} from "~/composables/useHttp"

const emit = defineEmits(['updateProducts'])

const props = defineProps({
  shopId: Number,
  id: Number,
  name: String,
  description: String,
  icon: String,
  price: Number,
  count: Number,
  refill_status: Number,
  verify_status: Number,
})

type NotificationType = 'info' | 'warning' | 'danger'

interface Notification {
  type: NotificationType
  tooltip: string
  action?: () => void
  disabled: boolean
}

const notifications = ref<Notification[]>([])

const refreshNotifications = () => {
  console.log(props)
  notifications.value = []

  if (props.verify_status === -1) {
    notifications.value.push({
      type: 'danger',
      tooltip: 'Товар не прошёл проверку',
      action: () => console.log('Открыть меню изменения товара'),
      disabled: false,
    })
  }

  if (props.refill_status === 1) {
    notifications.value.push({
      type: 'warning',
      tooltip: 'Вы не завершили пополнение',
      action: () => {

      },
      disabled: false,
    })
  }

  if (props.refill_status >= 2) {
    notifications.value.push({
      type: 'info',
      tooltip: 'Товар пополняется',
      disabled: true,
    })
  }

  if (props.verify_status === 0) {
    notifications.value.push({
      type: 'info',
      tooltip: 'Товар на проверке',
      disabled: true,
    })
  }
}

onMounted(() => {
  refreshNotifications()
})

const _delete = async () => {
  await http.post(`/freshmarket/shop/${props.shopId}/product/${props.id}/delete`)
  emit('updateProducts')
}
</script>

<template>
  <ShCard class="p-4 gap-2">
    <div class="flex">
      <div class="">
        <p class="text-base font-medium">{{ name }}</p>
        <p class="text-xs opacity-75 line-clamp-2 break-all">{{ description }}</p>
      </div>
      <div class="ml-auto mr-0 flex">
        <el-tooltip
            v-for="notify in notifications"
            effect="light"
            :content="notify.tooltip"
            placement="top-start"
        >
          <button :disabled="notify.disabled" @click="notify.action" :class="[
                'w-6 h-6 flex justify-center items-center relative',
                {
                  'text-yellow-500': notify.type === 'warning',
                  'text-blue-500': notify.type === 'info',
                  'text-red-500': notify.type === 'danger'
                }
              ]">
            <div class="blur-xs absolute h-5">
              <Icon :name="notify.type === 'warning' ? 'uil:exclamation-triangle' :
                         notify.type === 'info' ? 'uil:exclamation-circle' :
                         'uil:exclamation-octagon'" size="20"/>
            </div>
            <Icon :name="notify.type === 'warning' ? 'uil:exclamation-triangle' :
                       notify.type === 'info' ? 'uil:exclamation-circle' :
                       'uil:exclamation-octagon'" size="20"/>
          </button>
        </el-tooltip>
        <el-tooltip
            effect="light"
            content="Изменить"
            placement="top-start"
        >
          <button @click="selectedProduct = product; productEditWindow = true" class="w-6 h-6 flex justify-center items-center">
            <Icon name="uil:pen" size="20"/>
          </button>
        </el-tooltip>
      </div>
    </div>
    <div class="flex gap-1">
      <el-tooltip
          effect="light"
          :content="refill_status < 2 ? 'Пополнить' : 'Товар пополняется'"
          placement="top-start"
      >
        <button :disabled="refill_status >= 2" @click="() => handleProductAction(product, 'refill')"
                class="w-6 h-6 flex justify-center items-center text-green-400 disabled:opacity-50">
          <div v-if="refill_status == 1" class="w-6 h-6 bg-green-500 absolute blur-xs rounded-full opacity-25"></div>
          <Icon name="material-symbols:deployed-code-update-outline" size="24"/>
        </button>
      </el-tooltip>
      <el-tooltip
          effect="light"
          content="История"
          placement="top-start"
      >
        <button @click="() => handleProductAction(product, 'history')"
                class="w-6 h-6 flex justify-center items-center text-neutral-400">
          <Icon name="uil:history" size="24"/>
        </button>
      </el-tooltip>
      <ShAlertDialog>
        <ShAlertDialogTrigger as-child>
          <ShButton variant="ghost" class="w-6 h-6 p-0 flex justify-center items-center !text-red-500">
            <Icon name="uil:trash-alt" size="24"/>
          </ShButton>
        </ShAlertDialogTrigger>
        <ShAlertDialogContent>
          <ShAlertDialogHeader>
            <ShAlertDialogTitle>Вы уверены что хотите удалить товар?</ShAlertDialogTitle>
            <ShAlertDialogDescription>
              Это действие нельзя будет отменить. Удаление товара возможно только при его полном отсутствии на складе!
            </ShAlertDialogDescription>
          </ShAlertDialogHeader>
          <ShAlertDialogFooter>
            <ShAlertDialogCancel>Отмена</ShAlertDialogCancel>
            <ShAlertDialogAction @click="_delete" class="bg-red-500/[.9] hover:bg-red-500">Удалить</ShAlertDialogAction>
          </ShAlertDialogFooter>
        </ShAlertDialogContent>
      </ShAlertDialog>
    </div>
    <div class="flex justify-center items-center relative">
      <div v-if="refill_status == 1" class="absolute w-1/2 aspect-square bg-neutral-400/[0.75] dark:bg-black/[0.75] rounded-lg flex flex-col justify-center items-center">
        <p class="text-orange-700 dark:text-yellow-400 font-semibold">Пополнение</p>
        <p>Ячейка: <strong class="absolute blur-xs text-blue-700/[0.5] dark:text-white">{{ product?.refillCell?.letter }}-{{ product?.refillCell?.number }}</strong><strong class="text-blue-700 dark:text-white">{{ product?.refillCell?.letter }}-{{ product?.refillCell?.number }}</strong></p>
        <ShButton @click="handleProductAction(product, 'refill')" class="absolute bottom-4" size="sm">Открыть</ShButton>
      </div>
      <img :src="icon" class="w-1/2 aspect-square" alt="">
    </div>
    <div class="mb-0 mt-auto flex">
      <div class="w-full">
        <p class="text-xs opacity-75">Цена</p>
        <p>{{ price }} АР</p>
      </div>
      <p class="text-center mt-auto mb-0">/</p>
      <div class="text-right w-full">
        <p class="text-xs opacity-75">На складе</p>
        <p>{{ count }} ед.</p>
      </div>
    </div>
  </ShCard>
</template>

<style scoped>

</style>