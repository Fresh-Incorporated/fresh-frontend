<script setup lang="ts">
import DataTable from "~/components/goodies/DataTable.vue";
import { http } from "~/composables/useHttp";
import { formatDateRelative } from "~/utils/convertDate";

const { user } = useUser()

const data = defineModel("products")

const cols = [
  { id: "id", name: "ID" },
  { id: "icon", name: "Иконка" },
  { id: "name", name: "Название" },
  { id: "description", name: "Описание" },
  { id: "stack_count", name: "Кол-во в слоте" },
  { id: "slots_count", name: "Кол-во слотов" },
  { id: "price", name: "Цена" },
  { id: "verify_status", name: "Проверен?" },
  { id: "refill_status", name: "Пополнение" },
  { id: "count", name: "На складе" },
  { id: "created", name: "Создан" },
  { id: "shop", name: "Магазин" },
  { id: "cell", name: "Ячейка" },
  { id: "actions", name: "Действия" }
]

const enabledCols = ref(cols.map(col => col.id)) // по умолчанию все активны
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
            <ShSelectItem v-for="col in cols" :key="col.id" :value="col.id">
              {{ col.name }}
            </ShSelectItem>
          </ShSelectGroup>
        </ShSelectContent>
      </ShSelect>
    </div>

    <ShTable>
      <ShTableHeader>
        <ShTableRow>
          <ShTableHead
              v-for="col in cols.filter(c => enabledCols.includes(c.id))"
              :key="col.id"
          >
            {{ col.name }}
          </ShTableHead>
        </ShTableRow>
      </ShTableHeader>

      <ShTableBody>
        <template v-if="data?.length > 0">
          <ShTableRow v-for="row in data" :key="row.id">
            <ShTableCell v-if="enabledCols.includes('id')">
              {{ row.id }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('icon')">
              <img class="w-12 h-12" :src="row.icon" alt="">
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('name')">
              {{ row.name }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('description')">
              {{ row.description }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('stack_count')">
              {{ row.stack_count }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('slots_count')">
              {{ row.slots_count }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('price')">
              {{ row.price }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('verify_status')">
              <ShCheckbox
                  :class="{
                  '!bg-red-500 !border-red-500': row.verify_status == -1,
                  '!bg-green-500 !border-green-500': row.verify_status == 1,
                }"
                  disabled
                  :model-value="row.verify_status"
              />
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('refill_status')">
              {{
                row.refill_status === 0 ? 'Не пополняется' :
                    row.refill_status === 1 ? 'Продавец пополняет' :
                        row.refill_status === 2 ? 'Ожидает логиста' :
                            row.refill_status === 3 ? 'Принято логистом' :
                                'Неизвестно'
              }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('count')">
              {{ row.count }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('created')">
              {{ formatDateRelative(row.createdAt) }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('shop')">
              <div class="flex gap-2 items-center">
                <img :src="row.shop.icon" class="w-4 h-4" alt="">
                <p>{{ row.shop.name }}</p>
              </div>
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('cell')">
              {{ row.cell?.letter }}-{{ row.cell?.number }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('actions')">
              <ShDropdownMenu>
                <ShDropdownMenuTrigger as-child>
                  <ShButton variant="ghost" size="icon">
                    <Icon name="lucide:menu" />
                  </ShButton>
                </ShDropdownMenuTrigger>
                <ShDropdownMenuContent>
                  <ShDropdownMenuGroup>
                    <ShDropdownMenuItem>
                      <span>Действий пока нет...</span>
                    </ShDropdownMenuItem>
                  </ShDropdownMenuGroup>
                </ShDropdownMenuContent>
              </ShDropdownMenu>
            </ShTableCell>
          </ShTableRow>
        </template>

        <template v-else>
          <ShTableRow>
            <ShTableCell :colspan="enabledCols.length" class="h-24 text-center">
              No results.
            </ShTableCell>
          </ShTableRow>
        </template>
      </ShTableBody>
    </ShTable>
  </div>
</template>
