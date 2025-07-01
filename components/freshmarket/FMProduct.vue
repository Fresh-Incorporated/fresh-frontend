<script setup lang="ts">
const props = defineProps({
  id: Number,
  name: String,
  description: String,
  price: Number,
  icon: String,
  shop_name: String,
  shop_icon: String,
  count: Number,
  slots_count: Number,
  stack_count: Number,
  shop_tag: String,
  tags: Array,
})

const {putInCart, cart} = useUser()

const adult = ref(false)
</script>

<template>
  <ShCard
      class="w-full h-96 border shadow-lg gap-0 !p-0 items-center rounded-lg relative">
    <div v-if="count === 0"
         class="absolute w-full h-full bg-neutral-900/[0.75] z-10 rounded-lg flex justify-center items-center">
      <p class="absolute blur-md text-3xl text-center font-semibold text-red-600">Товар закончился</p>
      <p class="text-3xl text-center font-semibold text-red-600">Товар закончился</p>
    </div>
    <div class="absolute top-1 left-1 rounded-lg bg-neutral-300 dark:bg-neutral-950/[.4] px-2 py-1 text-xs select-none">
      <ShTooltip>
        <ShTooltipTrigger class="!cursor-default">
          x{{ props.slots_count * props.stack_count }}
        </ShTooltipTrigger>
        <ShTooltipContent>
          <p>Кол-во предметов в 1 ед. товара</p>
        </ShTooltipContent>
      </ShTooltip>
    </div>
    <div v-if="tags && tags?.length > 0" class="absolute top-1 right-1 flex gap-1">
      <ShBadge variant="secondary" v-for="tag in tags">
        {{tag.name}}
      </ShBadge>
    </div>
    <div v-if="!tags?.find(tag => tag.name == '18+' || tag.id == 1) || adult" class="w-48 h-48 flex justify-center p-2 overflow-hidden">
      <img class="aspect-square" :src="props.icon" alt="">
    </div>
    <ShButton @click="adult = true" confirmation confirmation-title="Вам есть 18 лет?" confirmation-description="Нажимая <strong>ПОДТВЕРДИТЬ</strong>, вы подтверждаете, что вам исполнилось 18 лет. После этого все изображения на странице с пометкой 18+ будут отображены без размытия." variant="secondary" v-else class="w-48 h-48 flex justify-center p-2 overflow-hidden p-0 !bg-transparent">
      <div class="absolute text-orange-500">
        <Icon name="lucide:shield-alert" size="64" />
        <p>Возрастное ограничение</p>
      </div>
      <div class="absolute blur-xs text-orange-500">
        <Icon name="lucide:shield-alert" size="64" />
        <p>Возрастное ограничение</p>
      </div>
      <img class="aspect-square blur-md opacity-50" :src="props.icon" alt="">
    </ShButton>
    <div class="flex-1 flex flex-col h-full w-full px-4 py-2">
      <div class="mb-1">
        <h3 class="text-lg font-medium">{{ props.name }}</h3>
        <ShTooltip>
          <ShTooltipTrigger class="opacity-75 text-sm line-clamp-2 break-all w-full text-left !cursor-default" as="p">
            {{ props.description }}
          </ShTooltipTrigger>
          <ShTooltipContent>
            <p>{{ props.description }}</p>
          </ShTooltipContent>
        </ShTooltip>
      </div>
      <NuxtLink class="flex items-center gap-2" :to="`/freshmarket/shop/${shop_tag}`">
        <img class="w-5 h-5" :src="props.shop_icon" alt="">
        <p class="font-medium">{{ props.shop_name }}</p>
        <div class="flex-1 flex justify-end">
          <!--          <p class="text-xs font-rubik opacity-75"><i class="pi pi-star-fill text-yellow-400"></i> <span>4.7</span> <span>999 Оценок</span></p>-->
        </div>
      </NuxtLink>
      <div class="flex-1 flex flex-col justify-end">
        <div class="w-full" v-if="props.count < 10">
          <p class="text-xs text-amber-500 font-medium">Осталось: {{ props.count }} ед.</p>
          <ShProgress :model-value="Math.min(props.count * 4, 100)" class="h-2" color="bg-amber-500" />
        </div>
        <div class="w-full" v-if="props.count >= 10">
          <p class="text-xs text-blue-400 font-medium">Осталось: {{ props.count }} ед.</p>
          <ShProgress :model-value="Math.min(props.count + 50, 100)" class="h-2" color="bg-primary" />
        </div>
      </div>
    </div>
    <div class="w-full">
      <button v-if="!cart.find(product => product.id === props.id)" @click="putInCart(props, 1)"
              class="flex justify-center items-center align-middle gap-1 py-2 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-dark duration-200 w-full rounded-lg font-semibold font-montserrat text-white">
        <Icon name="lucide:shopping-cart" size="18"/>
         {{ props.price }} АР
      </button>
      <!--      <div v-else class="bg-secondary-light h-10 dark:bg-secondary-dark duration-200 w-full rounded-lg font-semibold font-montserrat flex">-->
      <!--        <button @click="putInCart(props, -1)" class="hover:bg-primary-dark h-full aspect-square rounded-l-lg border-r-2 border-white/[0.25] flex justify-center items-center text-sm"><i class="pi pi-minus"></i></button>-->
      <!--        <div class="w-full h-full flex justify-center items-center">{{ cart.find(product => product.id === props.id)?.picked }}</div>-->
      <!--        <button @click="putInCart(props, 1)" class="hover:bg-primary-dark h-full aspect-square rounded-r-lg border-l-2 border-white/[0.25] flex justify-center items-center text-sm"><i class="pi pi-plus"></i></button>-->
      <!--      </div>-->
      <button v-else @click="putInCart(props, -10000)"
              class="flex justify-center items-center align-middle gap-1 py-2 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-dark duration-200 w-full rounded-lg font-semibold font-montserrat text-white">
        <Icon name="lucide:shopping-cart" size="18"/>
         В корзине - {{ props.price }} АР
      </button>
    </div>
  </ShCard>
</template>

<style scoped>
:deep(.el-progress .el-progress__text) {
  display: none;
}
</style>