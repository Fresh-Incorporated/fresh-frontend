<script setup lang="ts">
import {http} from "~/composables/useHttp"
import FMProductHistory from "~/components/freshmarket/FMProductHistory.vue";

definePageMeta({
  layout: 'freshmarketwork'
})

const {user} = useUser()
const refillCount = ref(0)
const refillMessage = ref("")
const refillDialog = ref(false)

const selectedId = ref(0)

const products = ref([])

onMounted(async () => {
  await updateProductsList();
})

async function updateProductsList() {
  products.value = (await http.get(`freshmarket/work/logic/list/refill`))?.data;
  for (const product of products.value) {
    product?.history?.reverse()
  }
}

const accept = async (id: number) => {
  await http.post(`freshmarket/work/logic/product/${id}/refill`)
  await updateProductsList();
}

const confirm = async () => {
  await http.post(`freshmarket/work/logic/product/${selectedId.value}/refill/end`, {
    add: refillCount.value,
    message: refillMessage.value.length === 0 ? null : refillMessage.value,
  })
  await updateProductsList();
  refillDialog.value = false
}
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-5 gap-4">
      <el-dialog
          v-model="refillDialog"
          title="Пополнение товара"
          width="800"
      >
        <div>
          <el-input-number
              v-model="refillCount"
              placeholder="Кол-во"
              :min="0"
              :max="27 * 64 * 10"
          />
          <el-input
              v-model="refillMessage"
              type="textarea"
              placeholder="Напишите сообщение (при надобности).."
              :maxlength="120"
              show-word-limit
              :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
              :parser="(value) => value.replace(/[\r\n]+/g, '')"
          />
          <el-button @click="confirm">
            Завершить
          </el-button>
        </div>
      </el-dialog>
      <div v-for="product in products" class="flex flex-col">
        <img :src="product.icon" class="w-full aspect-square" alt="">
        <p class="font-semibold">{{ product.name }}</p>
        <p>{{ product.description }}</p>
        <p>Кол-во в стаке: {{ product.stack_count }}</p>
        <p>Кол-во слотов: {{ product.slots_count }}</p>
        <p>Ячейка: {{ product.cell?.letter }}-{{ product.cell?.number }}</p>
        <p>Склад: {{ product.cell?.location?.name }}</p>
        <div class="flex flex-col gap-1">
          <el-button v-if="product?.currentRefiller?.id == user?.id"
                     @click="selectedId = product.id; refillDialog = true">Открыть меню
          </el-button>
          <el-button @click="accept(product.id)" type="success" plain
                     :disabled="product.refill_status != 2 || product?.currentRefiller != null">Принять
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>