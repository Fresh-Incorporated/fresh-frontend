<script setup lang="ts"> import type {WithClassAsProps} from './interface'
import {ArrowRight} from 'lucide-vue-next'
import {cn} from '@/lib/utils'
import type { ButtonVariants } from '~/components/ui/button'
import {Button} from '~/components/ui/button'
import {useCarousel} from './useCarousel'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  infinity?: boolean
} & WithClassAsProps>(), {variant: 'outline', size: 'icon',})
const {orientation, canScrollNext, scrollNext, carouselApi} = useCarousel()
</script>
<template>
  <Button data-slot="carousel-next" :disabled="!canScrollNext && !infinity"
          :class="cn( 'absolute size-8 rounded-full', orientation === 'horizontal' ? 'top-1/2 -right-12 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90', props.class, )"
          :variant="variant" :size="size" @click="() => {
            scrollNext(infinity)
          }">
    <slot>
      <ArrowRight/>
      <span class="sr-only">Next Slide</span></slot>
  </Button>
</template>