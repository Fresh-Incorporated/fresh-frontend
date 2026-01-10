<script setup lang="ts">
import {http} from "~/composables/useHttp"

const props = defineProps({
  id: Number,
  history: Array,
})

const opened = ref(false)

const history = ref([])

const steps = ref([
  {
    step: 1,
    title: 'Your details',
    description:
        'Provide your name and email address. We will use this information to create your account',
  },
  {
    step: 2,
    title: 'Company details',
    description: 'A few details about your company will help us personalize your experience',
  },
  {
    step: 3,
    title: 'Invite your team',
    description:
        'Start collaborating with your team by inviting them to join your account. You can skip this step and invite them later',
  },
])

onMounted(async () => {
  if (!props.history) {
    // Maybe http get?
  } else {
    history.value = props.history
  }
})
</script>

<template>
  <ShSheet v-model:open="opened">
    <ShSheetTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShSheetTrigger>
    <ShSheetContent>
      <ShSheetHeader>
        <ShSheetTitle>История заказа</ShSheetTitle>
      </ShSheetHeader>
      <ShStepper orientation="vertical" class="mx-auto flex w-full max-w-md flex-col justify-start gap-4 px-2">
        <ShStepperItem
            disabled
            v-for="step in history"
            :key="step.id"
            v-slot="{ state }"
            class="relative flex w-full items-start gap-6"
            :step="step.id"
        >
          <ShStepperSeparator
              v-if="step.id !== steps[steps.length - 1].id"
              class="absolute left-[11px] top-[24px] block h-[100%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
          />

          <ShStepperTrigger as-child>
            <div class="z-10 rounded-full shrink-0 w-6 h-6">
              <ShButton
                  :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                  size="icon"
                  class="z-10 rounded-full shrink-0 w-6 h-6 absolute"
                  :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
              >

              </ShButton>
            </div>
          </ShStepperTrigger>

          <div class="flex flex-col gap-1 w-full wrap-anywhere">
            <ShStepperTitle
                :class="[state === 'active' && 'text-primary']"
                class="text-sm font-semibold transition lg:text-base"
            >
              <p v-if="step.action_type == 'created'" class="text-green-500">Создан</p>
              <p v-else-if="step.action_type == 'paid'" class="text-green-500">Оплачен</p>
              <p v-else-if="step.action_type == 'collect_picked'" class="text-blue-500">Сбор принят</p>
              <p v-else-if="step.action_type == 'collect_finished'" class="text-blue-500">Собран</p>
              <p v-else-if="step.action_type == 'deliver_started'" class="text-blue-500">Принят курьером</p>
              <p v-else-if="step.action_type == 'deliver_finished'" class="text-blue-500">Заказ собран</p>
              <p v-else-if="step.action_type == 'confirmed'" class="text-green-500">Заказ подтверждён</p>
              <p v-else class="text-blue-500">{{step.action_type}}</p>
            </ShStepperTitle>
            <ShStepperDescription
                :class="[state === 'active' && 'text-primary']"
                class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
            >
              <div class="flex gap-2">
                <p>Исполнитель:</p>
                <img :src="useXIS().getFullFace(step.user.uuid)" class="w-4 h-4" alt="">
                <p>{{step.user.nickname}}</p>
              </div>
              <div>
                {{ step.data }}
              </div>
            </ShStepperDescription>
          </div>
        </ShStepperItem>
      </ShStepper>
    </ShSheetContent>
  </ShSheet>
</template>

<style scoped>

</style>