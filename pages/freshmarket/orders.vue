<script setup lang="ts">
import {http} from "~/composables/useHttp"

const {orders} = useUser();

const confirm = async (id: number) => {
  await http.post(`/freshmarket/order/${id}/confirm`)
}
</script>

<template>
<div>
  <div v-for="order in orders?.orders">
    {{order}}
    <el-button v-if="order.status === 4" @click="confirm(order.id)">Подтвердить получение</el-button>
  </div>
</div>
</template>

<style scoped>

</style>