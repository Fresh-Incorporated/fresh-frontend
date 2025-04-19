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
          width="350"
      >
        <div class="flex flex-col gap-2">
          <el-input
              v-model="declineMessage"
              type="textarea"
              placeholder="Напишите причину отклонения.."
              :maxlength="120"
              :rows="6"
              show-word-limit
              :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
              :parser="(value) => value.replace(/[\r\n]+/g, '')"
          />
          <el-popconfirm
              confirm-button-text="Подтвердить"
              cancel-button-text="Отмена"
              hide-icon
              title="Вы уверены что хотите подтвердить этот товар?"
              @confirm="decline"
              :width="300"
          >
            <template #reference>
              <el-button type="danger">
                Отклонить
              </el-button>
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel">Отмена</el-button>
              <el-button size="small" type="danger" @click="confirm">Подтвердить</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-dialog>
      <div v-for="product in products" class="flex flex-col">
        <img :src="product.icon" class="w-full aspect-square" alt="">
        <p class="font-semibold">{{product.name}}</p>
        <p class="break-all">{{product.description}}</p>
        <p>Кол-во в стаке: {{product.stack_count}}</p>
        <p>Кол-во слотов: {{product.slots_count}}</p>
        <p>Цена: {{product.price}} АР</p>
        <p>Ячейка: {{product.cell?.letter}}-{{product.cell?.number}}</p>
        <p>Склад: {{product.cell?.location?.name}}</p>
        <div class="flex flex-col gap-1">
          <el-button @click="selectedId = product.id; showProductHistory = true" plain>Показать историю товара [{{product.history.length}}шт]</el-button>
          <div class="flex">
            <el-popconfirm
                confirm-button-text="Подтвердить"
                cancel-button-text="Отмена"
                hide-icon
                title="Вы уверены что хотите подтвердить этот товар?"
                @confirm="accept(product.id)"
                :width="300"
            >
              <template #reference>
                <el-button class="w-full" type="success" plain>Подтвердить</el-button>
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">Отмена</el-button>
                <el-button size="small" type="danger" @click="confirm">Подтвердить</el-button>
              </template>
            </el-popconfirm>
            <el-button class="w-full" @click="selectedId = product.id; declineDialog = true" type="danger" plain>Отклонить</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>