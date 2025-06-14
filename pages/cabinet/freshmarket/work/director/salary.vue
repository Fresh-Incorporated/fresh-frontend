<script setup lang="ts">
import {http} from "~/composables/useHttp";
import {computed, ref} from "vue";

definePageMeta({
  layout: 'cabinet'
})

const salary = ref({ totalSalary: 0, salaries: [] });
const users = ref([])
const workers = ref([])
const notLocated = ref([])
const total = ref(0);
const endDatetime = ref();

onMounted(async () => {
  workers.value = (await http.get("/freshmarket/work/director/users/workers")).data.users;
  await updateLocated();
})

const updateLocated = () => {
  notLocated.value = workers.value.filter(w => users.value.find(u => u.id == w.id) == null)
}

const usersUpdate = async () => {
  users.value = (await http.post("/freshmarket/work/director/users/list", {
    ids: salary.value.salaries.map((item) => item.id),
  })).data.users;
}

const generate = async (): Promise<void> => {
  salary.value = (await http.get("/freshmarket/work/director/salary/generate")).data;
  await usersUpdate();
  salary.value.salaries.forEach(s => {
    s.pays.secretary = s.pays.secretary || { pay: 0 };
    s.pays.director = s.pays.director || { pay: 0 };
  });
  endDatetime.value = salary.value.endDatetime;
  recalculateTotal();
  await updateLocated();
};

const recalculateTotal = () => {
  total.value = salary.value.salaries.reduce((sum, s) => {
    return sum + Object.values(s.pays).reduce((acc, p) => acc + p.pay, 0);
  }, 0);
};

const redistributeSalary = () => {
  const targetDistribution = { director: 0.2, secretary: 0.2, logic: 0.4, deliver: 0.2 };
  const totalSalary = salary.value.totalSalary;

  for (const role in targetDistribution) {
    let roleTotal = salary.value.salaries.reduce((sum, s) => sum + (s.pays[role]?.pay || 0), 0);
    let diff = (totalSalary * targetDistribution[role]) - roleTotal;
    let perUserAdjust = diff / salary.value.salaries.length;

    salary.value.salaries.forEach(s => {
      if (s.pays[role]) {
        s.pays[role].pay += perUserAdjust;
      }
    });
  }
  recalculateTotal();
};

const rolePercentage = computed(() => {
  const percentages: Record<string, number> = { logic: 0, deliver: 0, secretary: 0, director: 0 };
  if (salary.value.totalSalary > 0) {
    for (const s of salary.value.salaries) {
      for (const role in s.pays) {
        percentages[role] += s.pays[role].pay;
      }
    }
    for (const role in percentages) {
      percentages[role] = (percentages[role] / salary.value.totalSalary) * 100;
    }
  }
  return percentages;
});

const userRolePercentage = (userPays: any) => {
  if (salary.value.totalSalary === 0) return {};
  return Object.keys(userPays).reduce((acc, role) => {
    acc[role] = ((userPays[role].pay / salary.value.totalSalary) * 100).toFixed(2);
    return acc;
  }, {} as Record<string, string>);
};

const updatePay = (id: number, role: string, newPay: number) => {
  const user = salary.value.salaries.find((s) => s.id === id);
  if (user) {
    user.pays[role].pay = newPay;
    recalculateTotal();
  }
};

const updateUserId = async (oldId: number, newId: number) => {
  const user = salary.value.salaries.find((s) => s.id === oldId);
  if (user) {
    user.id = newId;
  }
  await usersUpdate();
  await updateLocated();
};

const addSalaryEntry = async () => {
  salary.value.salaries.push({ id: 0, pays: { logic: { pay: 0 }, deliver: { pay: 0 }, secretary: { pay: 0 }, director: { pay: 0 } } });
  recalculateTotal();
  await usersUpdate();
  await updateLocated();
};

const removeSalaryEntry = async (id: number) => {
  salary.value.salaries = salary.value.salaries.filter(s => s.id !== id);
  recalculateTotal();
  await usersUpdate();
  await updateLocated();
};

const submitSalary = async () => {
  await http.post("/freshmarket/work/director/salary/submit", {
    salaries: salary.value.salaries,
    endDatetime: new Date(endDatetime.value).getTime(),
  })

  salary.value = { totalSalary: 0, salaries: [] }
};
</script>

<template>
  <div class="w-full p-4">
    <ShButton variant="outline" @click="generate">Сгенерировать зарплатный отчёт</ShButton>
    <ShButton @click="addSalaryEntry">Добавить запись</ShButton>
    <ShButton variant="success" @click="redistributeSalary">Перераспределить</ShButton>
    <div>
      <p class="text-red-500 font-bold text-xl">Сумма зарплаты: {{ salary.totalSalary }}</p>
      <p class="text-red-500 font-bold text-lg">Распределено: {{ total }}</p>
      <p class="text-green-500 font-bold">Проценты распределения: Логисты {{ rolePercentage.logic.toFixed(2) }}%, Курьеры {{ rolePercentage.deliver.toFixed(2) }}%, Секретари {{ rolePercentage.secretary.toFixed(2) }}%, Директора {{ rolePercentage.director.toFixed(2) }}%</p>
      <p class="text-red-500 font-bold">Не распределены: <span v-for="l in notLocated">[{{ l.id }} - {{ l.nickname }}] </span></p>
      {{salary.salaries}}
      <CabinetFreshmarketSalaryTable v-model:data="salary.salaries" />
<!--        <el-table-column prop="id" label="USER ID" width="200">-->
<!--          <template #default="scope">-->
<!--            <el-input-number v-model="scope.row.id" :min="0" @change="(val) => updateUserId(scope.row.id, val)" />-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="id" label="USER">-->
<!--          <template #default="scope">-->
<!--            <div class="flex flex-col gap-2 justify-center items-center">-->
<!--              <img :src="useXIS().getFullFace(users?.find(u => u.id == scope.row.id)?.uuid)" class="w-8 h-8" alt="">-->
<!--              <p class="text-xl">{{users?.find(u => u.id == scope.row.id)?.nickname}}</p>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="pays" label="Зарплаты" width="380">-->
<!--          <template #default="scope">-->
<!--            <div class="space-y-2 flex flex-col justify-center items-start">-->
<!--              <div v-for="(value, key) in scope.row.pays" :key="key"-->
<!--                   :class="{-->
<!--                     'bg-orange-700/[.5] text-orange-300 border-orange-400/[.5]': key === 'deliver',-->
<!--                     'bg-blue-800/[.5] text-blue-200 border-blue-500/[.5]': key === 'logic',-->
<!--                     'bg-purple-700/[.5] text-purple-300 border-purple-400/[.5]': key === 'secretary',-->
<!--                     'bg-red-800/[.5] text-red-200 border-red-500/[.5]': key === 'director'-->
<!--                   }"-->
<!--                   class="rounded-lg px-2 border font-medium">-->
<!--                <p>{{ key === "logic" ? 'Логист' : key === "deliver" ? 'Курьер' :-->
<!--                    key === "secretary" ? 'Секретарь' : key === "director" ? 'Директор' : key }}-->
<!--                  <el-input-number v-model="scope.row.pays[key].pay" :min="0" @change="(val) => updatePay(scope.row.id, key, val)" /> АР-->
<!--                  ({{ userRolePercentage(scope.row.pays)[key] }}%)-->
<!--                </p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="Действия" width="200">-->
<!--          <template #default="scope">-->
<!--            <el-button type="danger" @click="removeSalaryEntry(scope.row.id)">Удалить</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
    </div>
    <div class="mt-4 flex gap-4">
      <p>Завершение: {{new Date(endDatetime)}}</p>
      <ShButton variant="destructive" @click="submitSalary">Создать отчёт</ShButton>
    </div>
  </div>
</template>

<style scoped></style>