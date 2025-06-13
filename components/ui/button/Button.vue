<script setup lang="ts">
import type {HTMLAttributes} from 'vue'
import {Primitive, type PrimitiveProps} from 'reka-ui'
import {cn} from '@/lib/utils'
import {type ButtonVariants, buttonVariants} from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
      :disabled="loading || disabled"
      data-slot="button"
      :as="as"
      :as-child="asChild"
      :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Icon v-if="loading" name="lucide:loader-circle" class="animate-spin"/>
    <slot/>
  </Primitive>
</template>
