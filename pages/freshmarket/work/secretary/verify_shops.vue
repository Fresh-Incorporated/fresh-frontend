<script setup lang="ts">
import {http} from "~/composables/useHttp"

definePageMeta({
  layout: 'freshmarketwork'
})

const shops = ref([])

onMounted(async () => {
  await updateShopsList()
})

async function updateShopsList() {
  shops.value = (await http.get(`freshmarket/work/secretary/shops`))?.data;
}

const accept = async (id: number) => {
  await http.post(`freshmarket/work/secretary/shop/${id}/accept`)
  await updateShopsList()
}

const decline = async (id: number) => {
  await http.post(`freshmarket/work/secretary/shop/${id}/decline`)
  await updateShopsList()
}
</script>

<template>
<div class="grid grid-cols-5 gap-4 p-4">
  <div v-for="shop in shops" class="flex flex-col">
    <img :src="shop.icon" class="w-full aspect-square" alt="">
    <p>Название: <strong>{{shop.name}}</strong></p>
    <p>Описание: {{shop.description?.length > 0 ? shop.description : 'Отсутствует'}}</p>
    <div class="w-full flex">
      <el-popconfirm
          confirm-button-text="Подтвердить"
          cancel-button-text="Отмена"
          hide-icon
          title="Вы уверены что хотите подтвердить этот магазин?"
          @confirm="accept(shop.id)"
          :width="300"
      >
        <template #reference>
          <el-button class="w-full" type="success" plain>Подтвердить</el-button>
        </template>
        <template #actions="{ confirm, cancel }">
          <el-button size="small" @click="cancel">Отмена</el-button>
          <el-button
              type="danger"
              size="small"
              @click="confirm"
          >
            Подтвердить
          </el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
          confirm-button-text="Отклонить"
          cancel-button-text="Отмена"
          hide-icon
          title="Вы уверены что хотите отклонить этот магазин?"
          @confirm="decline(shop.id)"
          :width="300"
      >
        <template #reference>
          <el-button class="w-full" type="danger" plain>Отклонить</el-button>
        </template>
        <template #actions="{ confirm, cancel }">
          <el-button size="small" @click="cancel">Отмена</el-button>
          <el-button
              type="danger"
              size="small"
              @click="confirm"
          >
            Отклонить
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>