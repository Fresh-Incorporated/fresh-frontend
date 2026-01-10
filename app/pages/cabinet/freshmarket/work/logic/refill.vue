<script setup lang="ts">
import {http} from "~/composables/useHttp"
import PreviewMinecraftShulker from "~/components/freshmarket/PreviewMinecraftShulker.vue";

definePageMeta({
  layout: 'cabinet'
})

const {user} = useUser()
const refillCount = ref(0)
const refillMessage = ref("")
const refillDialog = ref(false)

const selected = ref({})

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
  await http.post(`freshmarket/work/logic/product/${selected.value.id}/refill/end`, {
    add: refillCount.value,
    message: refillMessage.value.length === 0 ? null : refillMessage.value,
  })
  await updateProductsList();
  refillCount.value = 0;
  refillDialog.value = false
}
</script>

<template>
  <div class="w-full p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      <ShCard :key="product.id" v-for="product in products" class="flex flex-col !p-2 gap-0">
        <img :src="product.icon" class="w-full aspect-square" alt="">
        <p class="font-semibold">{{ product.name }}</p>
        <p class="break-all line-clamp-2">{{ product.description }}</p>
        <p>Кол-во в каждом слоте: {{ product.stack_count }}</p>
        <p>Кол-во слотов: {{ product.slots_count }}</p>
        <p>ID: {{ product.id }}</p>
        <p>Ячейка Пополнения: {{ product.refillCell?.letter }}-{{ product.refillCell?.number }}</p>
        <p>Ячейка Склада: {{ product.cell?.letter }}-{{ product.cell?.number }}</p>
        <p>Склад: {{ product.cell?.location?.name }}</p>
        <p>Сейчас на складе: {{ product.count }}</p>
        <div class="flex flex-col gap-1">
          <ShDialog v-model:open="refillDialog">
            <ShDialogTrigger as-child>
              <ShButton v-if="product?.currentRefiller?.id == user?.id" size="sm" variant="outline" class="w-full" @click="selected = product; refillDialog = true">Открыть меню</ShButton>
            </ShDialogTrigger>
            <ShDialogContent class="sm:max-w-[425px]">
              <ShDialogHeader>
                <ShDialogTitle>Пополнение товара {{selected.name}}</ShDialogTitle>
                <ShDialogDescription class="space-y-1">
                  <div>
                    <p class="break-all">Описание: {{ selected.description }}</p>
                    <p>Кол-во в каждом слоте: {{ selected.stack_count }}</p>
                    <p>Кол-во слотов: {{ selected.slots_count }}</p>
                  </div>
                  <ShSeparator />
                  <div>
                    <p>Ячейка Пополнения: <span class="text-primary">{{ selected.refillCell?.letter }}-{{ selected.refillCell?.number }}</span></p>
                    <p>Ячейка Склада: <span class="text-primary">{{ selected.cell?.letter }}-{{ selected.cell?.number }}</span></p>
                  </div>
                  <ShSeparator />
                  <div>
                    <p>ID: {{ selected.id }}</p>
                    <p>Склад: {{ selected.cell?.location?.name }}</p>
                    <p>Сейчас на складе: {{ selected.count }}</p>
                  </div>
                </ShDialogDescription>
              </ShDialogHeader>
              <ShNumberField id="count" v-model="refillCount" :default-value="18" :min="0" :max="27 * 64 * 10">
                <ShLabel for="count">Кол-во ед. товара</ShLabel>
                <ShNumberFieldContent>
                  <ShNumberFieldDecrement />
                  <ShNumberFieldInput />
                  <ShNumberFieldIncrement />
                </ShNumberFieldContent>
              </ShNumberField>
              <ShTextarea
                  v-model="refillMessage"
                  placeholder="Напишите сообщение (при надобности).."
                  :maxlength="120"
                  show-word-limit
              />
              <ShDialogFooter>
                <PreviewMinecraftShulker
                    :default-image="selected.icon"
                    :slots="selected.slots_count"
                    :per-slot="selected.stack_count"
                    :price="selected.price"
                >
                  <ShButton variant="outline">
                    1 ед. товара
                  </ShButton>
                </PreviewMinecraftShulker>
                <ShButton type="submit" @click="confirm" confirmation>
                  Завершить пополнение
                </ShButton>
              </ShDialogFooter>
            </ShDialogContent>
          </ShDialog>
          <ShButton v-if="product?.currentRefiller?.id != user?.id" :disabled="product.refill_status != 2 || product?.currentRefiller != null" size="sm" variant="success" class="w-full" @click="accept(product.id)">Принять</ShButton>
        </div>
      </ShCard>
    </div>
  </div>
</template>

<style scoped>

</style>