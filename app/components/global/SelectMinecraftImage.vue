<script setup lang="ts">
import axios from "axios";

const model = defineModel()
const opened = defineModel('opened', {
  default: false,
})

const categoryKey_LocalizationKey = {
  "tools_and_utilities": "itemGroup.tools",
  "building_blocks": "itemGroup.buildingBlocks",
  "food_and_drinks": "itemGroup.consumables",
  "natural_blocks": "itemGroup.natural",
  // "op_blocks": "itemGroup.op",
  "functional_blocks": "itemGroup.functional",
  "spawn_eggs": "itemGroup.spawnEggs",
  "colored_blocks": "itemGroup.coloredBlocks",
  "ingredients": "itemGroup.ingredients",
  "combat": "itemGroup.combat",
}

const itemsByCategories = ref({})
const categories = ref([])
const localization = ref({})
const loading = ref(true)
const search = ref("")

onMounted(async () => {
  itemsByCategories.value = (await axios.get("https://assets.zaralx.ru/api/v1/minecraft/vanilla/item/categories"))?.data
  localization.value = (await axios.get("https://assets.zaralx.ru/api/v1/minecraft/vanilla/lang/ru_ru"))?.data
  updateItems()

  loading.value = false;
})

const updateItems = () => {
  categories.value = []
  for (const category in categoryKey_LocalizationKey) {
    let items = itemsByCategories.value[category];
    if (search.value != null && search.value.length > 0) {
      items = items.filter(item => getItemName(item).toLowerCase().includes(search.value.toLowerCase()) || item.includes(search.value.toLowerCase()));
    }
    categories.value.push({
      name: localization.value[categoryKey_LocalizationKey[category]],
      items: items
    })
  }
}

const getItemName = (item) => {
  let name = localization.value['item.minecraft.' + item]
  if (!name) {
    name = localization.value['block.minecraft.' + item]
  }
  if (!name) {
    name = item
  }
  return name
}
</script>

<template>
  <ShSheet v-model:open="opened">
    <ShSheetTrigger as-child>
      <span @click="opened = true">
        <slot />
      </span>
    </ShSheetTrigger>
    <ShSheetContent class="gap-0">
      <ShSheetHeader>
        <ShSheetTitle>Создание товара</ShSheetTitle>
        <ShSheetDescription>
          Заполните поля ниже и нажмите СОЗДАТЬ
        </ShSheetDescription>
        <ShInput
            v-model="search"
            maxlength="32"
            placeholder="Название предмета"
            type="text"
            @input="updateItems"
        />
      </ShSheetHeader>
      <div class="w-full h-full rounded-lg px-4 overflow-y-scroll">
        <div v-for="(category, category_id) in categories" :key="category_id" class="pb-4">
          <p v-if="category.items.length > 0" class="text-neutral-600 dark:text-neutral-300">{{ category.name }}</p>
          <div v-if="category.items.length > 0" class="h-px w-full border-b border-neutral-300 dark:bg-neutral-700 mb-2"></div>
          <div v-if="category.items.length > 0" class="grid grid-cols-12 gap-2">
            <div v-for="(item, item_id) in category.items" :key="item_id">
              <div :title="getItemName(item)" @click="model = item; opened = false" class="cursor-pointer">
                <img :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/item/${item}/icon`" class="w-6 h-6" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShSheetContent>
  </ShSheet>
</template>

<style scoped>

</style>