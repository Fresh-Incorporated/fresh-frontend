<script setup lang="ts">
import DataTable from "~/components/goodies/DataTable.vue";
import {http} from "~/composables/useHttp";
import {formatDateRelative} from "~/utils/convertDate";

const {user} = useUser()

const data = defineModel("shops")

const cols = [
  { id: "id", name: "ID" },
  { id: "icon", name: "Иконка" },
  { id: "name", name: "Название" },
  { id: "description", name: "Описание" },
  { id: "products_limit", name: "Лимит товаров" },
  { id: "products", name: "Товары" },
  { id: "verify_status", name: "Проверен?" },
  { id: "balance", name: "Баланс" },
  { id: "tag", name: "Тег" },
  { id: "created", name: "Создан" },
  { id: "owner", name: "Владелец" },
  { id: "co_owners", name: "Совладельцы" },
  { id: "actions", name: "Действия" }
]

const enabledCols = ref(["id", "icon", "name", "description", "products_limit", "products", "verify_status", "balance", "tag", "created", "owner", "co_owners", "actions"])
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
            <ShTableCell v-if="enabledCols.includes('icon')">
              <img class="w-12 h-12" :src="row.icon" alt="">
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('name')">
              {{ row.name }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('description')">
              {{ row.description }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('products_limit')">
              {{ row.products_limit }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('products')">
              <div v-if="!row.products || row.products?.length == 0">
                Нет
              </div>
              <div v-else>
                <div class="flex gap-2 items-center" v-for="product in row.products">
                  <img :src="product.icon" class="w-4 h-4" alt="">
                  <p>{{product.name}}</p>
                </div>
              </div>
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('verify_status')">
              <ShCheckbox :class="{
                '!bg-red-500 !border-red-500': row.verify_status == -1,
                '!bg-green-500 !border-green-500': row.verify_status == 1,
              }" disabled :model-value="row.verify_status" />
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('balance')">
              {{ row.balance }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('tag')">
              {{ row.tag }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('created')">
              {{ formatDateRelative(row.createdAt) }}
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('owner')">
              <div class="flex gap-2 items-center">
                <img :src="useXIS().getFullFace(row.owner.uuid)" class="w-4 h-4" alt="">
                <p>{{row.owner.nickname}}</p>
              </div>
            </ShTableCell>
            <ShTableCell v-if="enabledCols.includes('co_owners')">
              <div v-if="!row.co_owners || row.co_owners?.length == 0">
                Нет
              </div>
              <div v-else>
                <div class="flex gap-2 items-center" v-for="co_owner in row.co_owners">
                  <img :src="useXIS().getFullFace(co_owner.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{co_owner.user.nickname}}</p>
                </div>
              </div>
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
            <ShTableCell :colspan="enabledCols?.length" class="h-24 text-center">
              No results.
            </ShTableCell>
          </ShTableRow>
        </template>
      </ShTableBody>
    </ShTable>
  </div>
</template>