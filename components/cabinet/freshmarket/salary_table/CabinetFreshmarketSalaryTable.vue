<script setup lang="ts">
import DataTable from "~/components/goodies/DataTable.vue";
import {http} from "~/composables/useHttp";

const {user} = useUser()

const data = defineModel("salary")
const users = ref([])
const lastUsersUpdate = ref(0)

const usersUpdate = async () => {
  const now = Date.now();
  if (now - lastUsersUpdate.value < 5000) return; // ждём 5 секунд между вызовами
  lastUsersUpdate.value = now;

  users.value = (await http.post("/freshmarket/work/director/users/list", {
    ids: data.value?.salaries.map((item) => item.id),
  })).data.users;
}

watch(data, async () => {
  await usersUpdate()
}, {deep: true})

const removeSalaryEntry = async (id: number) => {
  data.value.salaries = data.value.salaries.filter(s => s.id !== id);
  await usersUpdate();
};
</script>

<template>
  <div class="border rounded-md">
    <p>{{data}}</p>
    <ShTable>
      <ShTableHeader>
        <ShTableRow>
          <ShTableHead>
            Аватар
          </ShTableHead>
          <ShTableHead>
            Накнейм
          </ShTableHead>
          <ShTableHead>
            Зарплата
          </ShTableHead>
          <ShTableHead>
            Действия
          </ShTableHead>
        </ShTableRow>
      </ShTableHeader>
      <ShTableBody>
        <template v-if="data?.salaries?.length">
          <ShTableRow
              v-for="row in data?.salaries"
          >
            <ShTableCell>
              <img class="w-12 h-12" :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${users.find(u => u.id == row.id)?.uuid}/full`" alt="">
            </ShTableCell>
            <ShTableCell>
              <ShNumberField @change="data" v-model="row.id" :min="0">
                <ShLabel>{{users.find(u => u.id == row.id)?.nickname}}</ShLabel>
                <ShNumberFieldContent>
                  <ShNumberFieldDecrement />
                  <ShNumberFieldInput />
                  <ShNumberFieldIncrement />
                </ShNumberFieldContent>
              </ShNumberField>
            </ShTableCell>
            <ShTableCell class="w-96">
              <ShNumberField :step="0.1" v-for="(pay, id) in row.pays" :id="`${id}-${row.id}`" v-model="pay.pay" :min="0">
                <ShLabel :for="`${id}-${row.id}`">{{id}} {{(row.pays[id].pay / data?.totalSalary * 100).toFixed(2)}}%</ShLabel>
                <ShNumberFieldContent>
                  <ShNumberFieldDecrement />
                  <ShNumberFieldInput />
                  <ShNumberFieldIncrement />
                </ShNumberFieldContent>
              </ShNumberField>
            </ShTableCell>
            <ShTableCell class="w-64">
              <div class="w-full h-full flex items-center justify-center">
                <ShButton @click="removeSalaryEntry(row.id)" variant="destructive">Удалить</ShButton>
              </div>
            </ShTableCell>
          </ShTableRow>
        </template>
        <template v-else>
          <ShTableRow>
            <ShTableCell :colspan="4" class="h-24 text-center">
              No results.
            </ShTableCell>
          </ShTableRow>
        </template>
      </ShTableBody>
    </ShTable>
  </div>
</template>