<script setup lang="ts">
import CreateProductMenu from "~/components/cabinet/freshmarket/CreateProductMenu.vue";

const {shops} = useUser()

const props = defineProps({
  shop: Number,
})

const opened = ref(false);
const shop = ref({})

const initWindow = async () => {
  shop.value = shops?.value?.find(s => s.id == props.shop)
}

onMounted(async () => {
  await initWindow()
})

watch(() => props.shop, async () => {
  await initWindow()
})

</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-[18.5rem]  flex flex-col justify-center items-center">
    <CreateProductMenu :shop="props.shop" v-model="opened" />
    <el-button @click="opened = true" plain type="success">
      Создать товар
    </el-button>
    <p>{{shop?.products?.length}}/{{shop?.products_limit}}</p>
    <el-button disabled plain type="warning" size="large">
      Увеличить лимит <br> (Временно не доступно!)
    </el-button>
  </div>
</template>

<style scoped>

</style>