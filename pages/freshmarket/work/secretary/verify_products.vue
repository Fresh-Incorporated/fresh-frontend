<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMProductHistory from "~/components/freshmarket/FMProductHistory.vue";

definePageMeta({
  layout: 'freshmarketwork'
})

const declineMessage = ref("")
const declineDialog = ref(false)

const showProductHistory = ref(false)

const selectedId = ref(0)

const products = ref([])


onMounted(async () => {
  await updateProductsList();
})

async function updateProductsList() {
  products.value = (await http.get(`freshmarket/work/secretary/products`))?.data;
  for (const product of products.value) {
    product?.history?.reverse()
  }
}

const accept = async (id: number) => {
  await http.post(`freshmarket/work/secretary/product/${id}/accept`).finally(async () => {
    await updateProductsList();
  })
}

const decline = async () => {
  await http.post(`freshmarket/work/secretary/product/${selectedId.value}/decline`, {
    message: declineMessage.value,
  }).finally(async () => {
    declineDialog.value = false;
    declineMessage.value = "";
    await updateProductsList();
  })

}
</script>

<template>
  <div class="w-full p-4">
    <FMProductHistory v-model="showProductHistory" :history="products?.find(product => product.id === selectedId)?.history" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 gap-2">
      <el-dialog
          v-model="declineDialog"
          title="Отклонение товара"
          width="800"
      >
        <div>
          <el-input
              v-model="declineMessage"
              type="textarea"
              placeholder="Напишите причину отклонения.."
              :maxlength="120"
              show-word-limit
              :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
              :parser="(value) => value.replace(/[\r\n]+/g, '')"
          />
          <el-button @click="decline">
            Отклонить
          </el-button>
        </div>
      </el-dialog>
      <div v-for="product in products" class="flex flex-col">
        <img :src="product.icon" class="w-full aspect-square" alt="">
        <p class="font-semibold">{{product.name}}</p>
        <p>{{product.description}}</p>
        <p>Кол-во в стаке: {{product.stack_count}}</p>
        <p>Кол-во слотов: {{product.slots_count}}</p>
        <p>Цена: {{product.price}} АР</p>
        <p>Ячейка: {{product.cell?.letter}}-{{product.cell?.number}}</p>
        <p>Склад: {{product.cell?.location?.name}}</p>
        <div class="flex flex-col gap-1">
          <el-button @click="selectedId = product.id; showProductHistory = true" plain>Показать историю товара [{{product.history.length}}шт]</el-button>
          <div class="flex">
            <el-button class="w-full" @click="accept(product.id)" type="success" plain>Подтвердить</el-button>
            <el-button class="w-full" @click="selectedId = product.id; declineDialog = true" type="danger" plain>Отклонить</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>