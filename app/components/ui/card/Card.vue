<script setup lang="ts">
import type {HTMLAttributes} from 'vue'
import {cn} from '@/lib/utils'

const loading = defineModel<Boolean>('loading')

const props = defineProps<{
  class?: HTMLAttributes['class']
  outlined?: boolean
}>()
</script>

<template>
  <div
      data-slot="card"
      :class="cn(
        'text-card-foreground rounded-xl border shadow-sm overflow-hidden relative flex flex-col gap-6',
        props.class,
        {
          'bg-card': !outlined,
          'py-6': !loading,
        }
      )"
  >
    <transition name="loaded">
      <Skeleton v-if="loading" class="h-full w-full rounded-full absolute top-0 left-0 z-10" />
    </transition>
    <slot :class="loading ? 'opacity-0' : 'opacity-100'" />
  </div>
</template>