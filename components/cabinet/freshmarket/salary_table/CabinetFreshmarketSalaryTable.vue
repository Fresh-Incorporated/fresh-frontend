<script setup lang="ts">
import { columns } from './salary.columns'
import DataTable from "~/components/goodies/DataTable.vue";
import {http} from "~/composables/useHttp";

const {user} = useUser()

const data = defineModel("data")
const users = ref([])

const compiledData = ref([])

const usersUpdate = async () => {
  users.value = (await http.post("/freshmarket/work/director/users/list", {
    ids: data.value.map((item) => item.id),
  })).data.users;
}

onMounted(() => {
  refresh()
})
watch(data, async () => {
  await usersUpdate()
  refresh()
})

const refresh = () => {
  compiledData.value = []
  for (const datum of data.value) {
    const user = users.value.find((p) => p.id === datum.id) ?? {}
    compiledData.value.push(Object.assign({}, datum, user))
  }
}
</script>

<template>
  <div class="col-span-1 xl:col-span-2 2xl:col-span-4 relative">
    {{users}}
    {{compiledData}}
    <DataTable :columns="columns" v-model:data="compiledData" />
  </div>
</template>