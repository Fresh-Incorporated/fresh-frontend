import type {CarouselEmits, CarouselProps, UnwrapRefCarouselApi as CarouselApi} from './interface'
import {createInjectionState} from '@vueuse/core'
import emblaCarouselVue from 'embla-carousel-vue'
import {onMounted, ref} from 'vue'

const [useProvideCarousel, useInjectCarousel] = createInjectionState(({
                                                                          opts,
                                                                          orientation,
                                                                          plugins,
                                                                      }: CarouselProps, emits: CarouselEmits) => {
    const [emblaNode, emblaApi] = emblaCarouselVue({...opts, axis: orientation === 'horizontal' ? 'x' : 'y',}, plugins)

    function scrollPrev(infinity = false) {
        if (emblaApi.value.selectedScrollSnap() == 0 && infinity) {
            emblaApi.value?.scrollTo(emblaApi.value.slideNodes()?.length - 1)
        } else {
            emblaApi.value?.scrollPrev()
        }
    }

    function scrollNext(infinity = false) {
        if (emblaApi.value.selectedScrollSnap() + 1 == emblaApi.value.slideNodes()?.length && infinity) {
            emblaApi.value?.scrollTo(0)
        } else {
            emblaApi.value?.scrollNext()
        }
    }

    const canScrollNext = ref(false)
    const canScrollPrev = ref(false)

    function onSelect(api: CarouselApi) {
        canScrollNext.value = api?.canScrollNext() || false
        canScrollPrev.value = api?.canScrollPrev() || false
    }

    onMounted(() => {
        emblaApi.value?.on('init', onSelect)
        emblaApi.value?.on('reInit', onSelect)
        emblaApi.value?.on('select', onSelect)
        emits('init-api', emblaApi.value)
    })
    return {
        carouselRef: emblaNode,
        carouselApi: emblaApi,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        orientation
    }
},)

function useCarousel() {
    const carouselState = useInjectCarousel()
    if (!carouselState) throw new Error('useCarousel must be used within a <Carousel />')
    return carouselState
}

export {useCarousel, useProvideCarousel}