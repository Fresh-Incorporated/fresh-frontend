<script setup lang="ts">
import {http} from "~/composables/useHttp"
import PreviewMinecraftShulker from "~/components/freshmarket/PreviewMinecraftShulker.vue";

definePageMeta({
  layout: 'cabinet'
})

const {user} = useUser()

const locations = ref([])
const selectedLocation = ref()
const selectedLocationData = ref()
const selectedLocationCellLetter = ref()
const selectedLocationCellNumber = ref()
const selectedLocationCellData = ref()

onMounted(async () => {
  locations.value = (await http.get(`freshmarket/work/logic/location/list`))?.data.locations;
})

watch(selectedLocation, async newSelectedLocationId => {
  selectedLocationCellLetter.value = null
  selectedLocationCellNumber.value = null
  selectedLocationData.value = (await http.get(`freshmarket/work/logic/location/${newSelectedLocationId}`))?.data.location;
})

watch(selectedLocationCellLetter, async newSelectedLocationCellLetter => {
  selectedLocationCellNumber.value = null
})

watch(selectedLocationCellNumber, async newSelectedLocationCellNumber => {
  if (newSelectedLocationCellNumber == null || selectedLocationCellLetter.value == null) return;
  selectedLocationCellData.value = (await http.get(`freshmarket/work/logic/location/${selectedLocation.value}/cell/${selectedLocationCellLetter.value}/${newSelectedLocationCellNumber}`))?.data;
})
</script>

<template>
  <div class="w-full p-4">
    <ShCard class="!p-4 gap-2">
      <ShCardTitle>
        Локация: <ShSelect v-model="selectedLocation">
        <ShSelectTrigger class="w-[180px]">
          <ShButton variant="outline" size="sm">
            <ShSelectValue placeholder="Выберите локацию" />
          </ShButton>
        </ShSelectTrigger>
        <ShSelectContent>
          <ShSelectGroup>
            <ShSelectLabel class="text-orange-500">Склады</ShSelectLabel>
            <ShSelectItem :value="location.id" v-for="location in locations.filter(l => l.type == 'storage')">
              {{location.name}}
            </ShSelectItem>
          </ShSelectGroup>
          <ShSelectGroup>
            <ShSelectLabel class="text-yellow-500">Зоны доставки</ShSelectLabel>
            <ShSelectItem :value="location.id" v-for="location in locations.filter(l => l.type == 'deliver')">
              {{location.name}}
            </ShSelectItem>
          </ShSelectGroup>
          <ShSelectGroup>
            <ShSelectLabel class="text-green-500">Зоны пополнения</ShSelectLabel>
            <ShSelectItem :value="location.id" v-for="location in locations.filter(l => l.type == 'refill')">
              {{location.name}}
            </ShSelectItem>
          </ShSelectGroup>
          <ShSelectGroup>
            <ShSelectLabel class="text-blue-500">Филиалы</ShSelectLabel>
            <ShSelectItem :value="location.id" v-for="location in locations.filter(l => l.type == 'branch')">
              {{location.name}}
            </ShSelectItem>
          </ShSelectGroup>
        </ShSelectContent>
      </ShSelect>
      </ShCardTitle>
      <ShCardContent class="p-0">
        <p>ID: {{selectedLocationData?.id}}</p>
        <p>Название: {{selectedLocationData?.name}}</p>
        <p>Описание: {{selectedLocationData?.description}}</p>
        <p>Тип: {{selectedLocationData?.type}}</p>
        <p>Город: {{selectedLocationData?.city}}</p>
        <p>Включена: {{selectedLocationData?.enabled}}</p>
        <p>Создана: {{selectedLocationData?.createdAt}}</p>
        <ShCard class="!p-4 gap-2">
          <ShCardTitle>
            Ячейка: <ShSelect v-model="selectedLocationCellLetter">
            <ShSelectTrigger class="w-[180px]">
              <ShButton variant="outline" size="xs">
                <ShSelectValue placeholder="?" />
              </ShButton>
            </ShSelectTrigger>
            <ShSelectContent>
              <ShSelectItem :value="letter" v-for="letter in [...new Set(selectedLocationData?.cells.map(cell => cell.letter))]?.sort()">
                {{letter}}
              </ShSelectItem>
            </ShSelectContent>
          </ShSelect>-<ShSelect :disabled="!selectedLocationCellLetter" v-model="selectedLocationCellNumber">
            <ShSelectTrigger class="w-[180px]">
              <ShButton :disabled="!selectedLocationCellLetter" variant="outline" size="xs">
                <ShSelectValue placeholder="?" />
              </ShButton>
            </ShSelectTrigger>
            <ShSelectContent>
              <ShSelectItem :value="number" v-for="number in [...new Set(selectedLocationData?.cells.filter(cell => cell.letter == selectedLocationCellLetter).map(cell => cell.number as number))]?.sort((a, b) => a - b)">
                {{number}}
              </ShSelectItem>
            </ShSelectContent>
          </ShSelect>
          </ShCardTitle>
          <ShCardContent class="p-0">
            <p>ID: {{selectedLocationCellData?.cell?.id}}</p>
            <p>Мир: {{selectedLocationCellData?.cell?.world}}</p>
            <p>X: {{selectedLocationCellData?.cell?.x}} Y: {{selectedLocationCellData?.cell?.y}} Z: {{selectedLocationCellData?.cell?.z}}</p>
            <p>Сектор: {{selectedLocationCellData?.cell?.letter}}</p>
            <p>Номер: {{selectedLocationCellData?.cell?.number}}</p>
            <p>Слотов: {{selectedLocationCellData?.cell?.slots}}</p>
            <p>Статус:
              <span class="text-orange-500 font-semibold" v-if="selectedLocationCellData?.cell?.product">Занята товаром</span>
              <span class="text-yellow-500 font-semibold" v-else-if="selectedLocationCellData?.cell?.order">Занята заказом</span>
              <span class="text-green-500 font-semibold" v-else>Свободна</span>
            </p>
            <ShCard class="!p-4 gap-2" v-if="selectedLocationCellData?.cell?.product">
              <ShCardTitle>
                Товар
              </ShCardTitle>
              <ShCardContent class="p-0">
                <p>ID: {{selectedLocationCellData?.cell?.product?.id}}</p>
                <p>Имя: {{selectedLocationCellData?.cell?.product?.name}}</p>
                <p>Описание: {{selectedLocationCellData?.cell?.product?.description}}</p>
                <p class="flex gap-1 items-center">Иконка: <img class="w-4 h-4" :src="selectedLocationCellData?.cell?.product?.icon" alt=""></p>
                <p>Кол-во слотов: {{selectedLocationCellData?.cell?.product?.slots_count}}</p>
                <p>Кол-во в каждом слоте: {{selectedLocationCellData?.cell?.product?.stack_count}}</p>
                <p>Кол-во на складе: {{selectedLocationCellData?.cell?.product?.count}}</p>
              </ShCardContent>
            </ShCard>
            <ShCard class="!p-4 gap-2" v-if="selectedLocationCellData?.cell?.order">
              <ShCardTitle>
                Заказ
              </ShCardTitle>
              <ShCardContent class="p-0">
                <p>ID: {{selectedLocationCellData?.cell?.order?.id}}</p>
                <p>Цена: {{selectedLocationCellData?.cell?.order?.price}}</p>
                <p>Статус: {{selectedLocationCellData?.cell?.order?.status}}</p>
                <div class="flex gap-2">Товары:
                  <p v-for="product in selectedLocationCellData?.cell?.order?.data?.products" class="flex gap-1 items-center">
                    <img class="w-4 h-4" :src="selectedLocationCellData?.products?.find(p => p.id == product.id)?.icon" alt="">
                    {{selectedLocationCellData?.products?.find(p => p.id == product.id)?.name}}
                    <span class="text-sm opacity-75">x{{product.count}}</span>
                  </p>
                </div>
              </ShCardContent>
            </ShCard>
            {{selectedLocationCellData}}
          </ShCardContent>
        </ShCard>
      </ShCardContent>
    </ShCard>
  </div>
</template>

<style scoped>

</style>