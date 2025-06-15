<script setup lang="ts">
import type {HTMLAttributes} from 'vue'
import {Primitive, type PrimitiveProps} from 'reka-ui'
import {cn} from '@/lib/utils'
import {type ButtonVariants, buttonVariants} from '.'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog"

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
  disabled?: boolean
  confirmation?: boolean
  confirmationTitle?: string
  confirmationDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  confirmation: false,
  confirmationTitle: 'Вы уверены?',
  confirmationDescription: 'Это действие нельзя будет отменить.',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  if (!props.confirmation) {
    emit('click', e)
  } else {
    showDialog.value = true
  }
}

const showDialog = ref(false)

const confirm = (e: MouseEvent) => {
  emit('click', e)
  showDialog.value = false
}
</script>

<template>
  <AlertDialog v-if="confirmation" v-model:open="showDialog">
    <AlertDialogTrigger as-child>
      <Primitive
          :disabled="loading || disabled"
          data-slot="button"
          :as="as"
          :as-child="asChild"
          :class="cn(buttonVariants({ variant, size }), props.class)"
          @click="handleClick"
      >
        <Icon v-if="loading" name="lucide:loader-circle" class="animate-spin"/>
        <slot />
      </Primitive>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ confirmationTitle }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ confirmationDescription }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction @click="confirm">Подтвердить</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <template v-else>
    <Primitive
        :disabled="loading || disabled"
        data-slot="button"
        :as="as"
        :as-child="asChild"
        :class="cn(buttonVariants({ variant, size }), props.class)"
        @click="handleClick"
    >
      <Icon v-if="loading" name="lucide:loader-circle" class="animate-spin"/>
      <slot />
    </Primitive>
  </template>
</template>
