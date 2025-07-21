<script setup lang="ts">
import DataTable from "~/components/goodies/DataTable.vue";
import {http} from "~/composables/useHttp";
import {formatDateRelative} from "~/utils/convertDate";

const {user} = useUser()

const data = defineModel()
const products = defineModel("products")
const emit = defineEmits(['updateOrders'])

const cols = [
  { id: "id", name: "ID" },
  { id: "customer", name: "Покупатель" },
  { id: "products", name: "Товары" },
  { id: "price", name: "Цена" },
  { id: "status", name: "Статус" },
  { id: "paid", name: "Оплачен" },
  { id: "branch", name: "Филиал" },
  { id: "cell", name: "Ячейка" },
  { id: "updatedAt", name: "Последнее изменение" },
  { id: "actions", name: "Действия" }
]

const enabledCols = ref(["id", "customer", "products", "price", "status", "paid", "branch", "cell", "updatedAt", "actions"])

const secretaryEndOrder = async (id: number) => {
  await http.post(`/freshmarket/work/secretary/order/${id}/confirm`)
  emit("updateOrders")
}
</script>

<template>
  <div class="rounded-md space-y-2">
    <div class="flex justify-end">
      <ShSelect v-model="enabledCols" multiple>
        <ShSelectTrigger as-child>
          <ShButton variant="outline" size="sm">Отображение</ShButton>
        </ShSelectTrigger>
        <ShSelectContent>
          <ShSelectGroup>
            <ShSelectItem v-for="col in cols" :value="col.id">
              {{ col.name }}
            </ShSelectItem>
          </ShSelectGroup>
        </ShSelectContent>
      </ShSelect>
    </div>
    <ShTable>
      <ShTableHeader>
        <ShTableRow>
          <ShTableHead v-for="col in cols.filter(c => enabledCols.includes(c.id))" :key="col.id">
            {{ col.name }}
          </ShTableHead>
        </ShTableRow>
      </ShTableHeader>
      <ShTableBody>
        <template v-if="data?.length > 0">
          <ShTableRow
              v-for="row in data"
          >
            <ShTableCell v-if="enabledCols.includes('id')">
              {{ row.id }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('customer')">
              <div class="flex gap-2 items-center">
                <img :src="useXIS().getFullFace(row.customer.uuid)" class="w-4 h-4" alt="">
                <p>{{row.customer.nickname}}</p>
              </div>
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('products')">
              <div v-if="!row.data.products || row.data.products?.length == 0">
                Нет
              </div>
              <div v-else>
                <div class="flex gap-2 items-center" v-for="product in row.data.products">
                  <img :src="products.find(p => p.id == product.id).icon" class="w-4 h-4" alt="">
                  <p>{{products.find(p => p.id == product.id).name}}</p>
                </div>
              </div>
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('price')">
              {{ row.price }} АР
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('status')">
              {{ row.status }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('paid')">
              <ShCheckbox :class="{
                '!bg-red-500 !border-red-500': !row.paid,
                '!bg-green-500 !border-green-500': row.paid,
              }" disabled :model-value="row.paid" />
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('branch')">
              {{ row.branch.name }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('cell')">
              {{ row.branchCell.letter }}-{{ row.branchCell.number }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('updatedAt')">
              {{ formatDateRelative(row.updatedAt) }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('actions')">
              <ShButton variant="destructive" size="xs" @click="secretaryEndOrder(row.id)" confirmation>
                Подтвердить
              </ShButton>
            </ShTableCell>
          </ShTableRow>
        </template>
        <template v-else>
          <ShTableRow>
            <ShTableCell :colspan="enabledCols?.length" class="h-24 text-center">
              No results.
            </ShTableCell>
          </ShTableRow>
        </template>
      </ShTableBody>
    </ShTable>
  </div>
</template>