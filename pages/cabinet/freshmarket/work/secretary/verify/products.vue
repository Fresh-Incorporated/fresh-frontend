<script setup lang="ts">
import {http} from "~/composables/useHttp"

definePageMeta({
  layout: 'cabinet'
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
  declineDialog.value = false
}
</script>

<template>
  <div class="w-full p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 gap-2">
      <ShCard v-for="product in products" class="flex flex-col !p-2 gap-0">
        <img :src="product.icon" class="w-full aspect-square" alt="">
        <p class="font-semibold">{{product.name}}</p>
        <p class="break-all">{{product.description}}</p>
        <p>Кол-во в каждом слоте: {{product.stack_count}}</p>
        <p>Кол-во слотов: {{product.slots_count}}</p>
        <p>Цена: {{product.price}} АР</p>
        <p>Ячейка: {{product.cell?.letter}}-{{product.cell?.number}}</p>
        <p>Склад: {{product.cell?.location?.name}}</p>
        <div class="flex flex-col gap-2">
          <FreshmarketProductHistory :history="product?.history">
            <ShButton class="w-full" variant="outline" size="sm" @click="selectedId = product.id; showProductHistory = true">Показать историю товара [{{product.history.length}}шт]</ShButton>
          </FreshmarketProductHistory>
          <div class="grid grid-cols-2 gap-2">
            <ShButton size="sm" variant="success" @click="accept(product.id)" confirmation>Подтвердить</ShButton>
            <ShDialog v-model="declineDialog">
              <ShDialogTrigger as-child>
                <ShButton size="sm" variant="destructive" @click="selectedId = product.id;">Отклонить</ShButton>
              </ShDialogTrigger>
              <ShDialogContent>
                <ShDialogTitle>
                  Отклонение товара {{product.name}}
                </ShDialogTitle>
                <div class="flex flex-col gap-2">
                  <ShTextarea
                      v-model="declineMessage"
                      placeholder="Напишите причину отклонения.."
                      :maxlength="120"
                  />
                  <ShButton variant="destructive" @click="decline" confirmation>
                    Отклонить
                  </ShButton>
                </div>
              </ShDialogContent>
            </ShDialog>
          </div>
        </div>
      </ShCard>
    </div>
  </div>
</template>

<style scoped>

</style>