<script setup lang="ts"> import type {HTMLAttributes} from 'vue'
import {reactiveOmit} from '@vueuse/core'
import {ChevronDown} from 'lucide-vue-next'
import {SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps} from 'reka-ui'
import {cn} from '@/lib/utils'

const props = withDefaults(defineProps<SelectTriggerProps & {
  class?: HTMLAttributes['class'],
  size?: 'sm' | 'default'
}>(), {size: 'default'},)
const delegatedProps = reactiveOmit(props, 'class', 'size')
const forwardedProps = useForwardProps(delegatedProps) </script>
<template>
  <SelectTrigger data-slot="select-trigger" :data-size="size" v-bind="forwardedProps"
                 :class="cn( `...`, props.class, )">
    <slot/>
  </SelectTrigger>
</template>