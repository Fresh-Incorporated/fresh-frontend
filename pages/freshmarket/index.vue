<script setup lang="ts">
import ProjectHead from "~/components/project/ProjectHead.vue";
import FMProductsList from "~/components/freshmarket/FMProductsList.vue";
import {http} from "~/composables/useHttp"
import FMCartButton from "~/components/freshmarket/FMCart.vue";

const productsModel = ref({
  products: [],
  loading: false
});

const searchSeed = Date.now()
const isAllLoaded = ref(false)
const search = ref("")
const sort = ref("relevance")
const tags = ref([])
const selectedTags = ref([])
const productsInStorage = ref([1, 256])

const { isMobile, isMobileOrTablet } = useDevice()

const { getTags } = useUser()

let throttleTimeout: ReturnType<typeof setTimeout> | null = null;

const scrollEvent = () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight - 300) {
    load();
  }
};

const throttledScrollEvent = () => {
  if (throttleTimeout) return;
  throttleTimeout = setTimeout(() => {
    scrollEvent();
    throttleTimeout = null;
  }, 200);
};

onMounted(async () => {
  window.addEventListener('scroll', throttledScrollEvent);
  tags.value = await getTags()
  await load();
});

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScrollEvent);
});

const load = async () => {
  if (productsModel.value.loading) return;
  if (isAllLoaded.value) return;

  productsModel.value = {...productsModel.value, loading: true};

  try {
    const offset = productsModel.value.products.length;
    const newProducts = await http.get(`freshmarket/products`, {
      params: {
        offset: offset,
        seed: searchSeed,
        search: search.value,
        sort: sort.value,
        tags: selectedTags.value.map(tag => tag.id).join("_"),
        min: productsInStorage.value[0],
        max: productsInStorage.value[1] == 256 ? 10000 : productsInStorage.value[1],
      }
    });

    if (newProducts.data.length == 0) {
      isAllLoaded.value = true;
      return;
    }

    productsModel.value = {
      ...productsModel.value,
      products: [...productsModel.value.products, ...newProducts.data],
    };
  } catch (error) {
    console.error('Ошибка загрузки продуктов:', error);
  } finally {
    productsModel.value = {...productsModel.value, loading: false};
  }
};

const changedFilters = async (newValue: Array | undefined) => {
  if (newValue) {
    selectedTags.value = newValue
  }
  productsModel.value.products = [];
  isAllLoaded.value = false;
  await load();
}

const searchInput = async () => {
  const searchOld = search.value;
  setTimeout(async () => {
    if (searchOld == search.value) {
      await changedFilters();
    }
  }, 1000)
}
watch(sort, () => changedFilters())

watch(productsInStorage, newProductsInStorage => {
  setTimeout(async () => {
    if (productsInStorage.value == newProductsInStorage) {
      await changedFilters();
    }
  }, 1000)
})
</script>

<template>
  <div>
    <ProjectHead></ProjectHead>
    <FMCartButton />
    <div class="mx-auto z-20 sticky top-[56px] w-full flex justify-center">
      <div class="w-full md:w-11/12">
        <div class="bg-neutral-50/[.9] dark:bg-neutral-900/[.9] backdrop-blur-sm rounded-b-lg shadow-sm dark:shadow-lg p-2 flex flex-col gap-2 border border-t-0 border-neutral-100 dark:border-neutral-800">
          <ShInput class="h-8" placeholder="Поиск" v-model="search" @input="searchInput" @change="searchInput()" />
          <div class="flex gap-2 md:gap-4 flex-wrap">
            <div class="space-y-1 hidden xl:flex flex-col">
              <ShLabel>Сортировка</ShLabel>
              <div class="flex gap-2">
                <ShButton size="sm" :variant="sort == 'relevance' ? 'default' : 'outline'" @click="sort = 'relevance'">По релевантности</ShButton>
                <ShButton size="sm" :variant="sort == 'expensive' ? 'default' : 'outline'" @click="sort = 'expensive'">Сначала дорогие</ShButton>
                <ShButton size="sm" :variant="sort == 'cheap' ? 'default' : 'outline'" @click="sort = 'cheap'">Сначала дешевые</ShButton>
                <ShButton size="sm" :variant="sort == 'new' ? 'default' : 'outline'" @click="sort = 'new'">Сначала новые</ShButton>
                <ShButton size="sm" :variant="sort == 'old' ? 'default' : 'outline'" @click="sort = 'old'">Сначала старые</ShButton>
              </div>
            </div>
            <div class="xl:hidden w-full">
              <ShSelect v-model="sort">
                <ShSelectTrigger class="space-y-1 xl:hidden w-full">
                  <ShLabel>Сортировка</ShLabel>
                  <ShButton size="sm" variant="outline" class="w-full"><ShSelectValue placeholder="Сортировка" /></ShButton>
                </ShSelectTrigger>
                <ShSelectContent>
                  <ShSelectGroup>
                    <ShSelectLabel>Сортировка по цене</ShSelectLabel>
                    <ShSelectItem value="relevance">
                      По релевантности
                    </ShSelectItem>
                    <ShSelectItem value="expensive">
                      Сначала дорогие
                    </ShSelectItem>
                    <ShSelectItem value="cheap">
                      Сначала дешевые
                    </ShSelectItem>
                    <ShSelectItem value="new">
                      Сначала новые
                    </ShSelectItem>
                    <ShSelectItem value="old">
                      Сначала старые
                    </ShSelectItem>
                  </ShSelectGroup>
                </ShSelectContent>
              </ShSelect>
            </div>
            <div class="hidden xl:block space-y-1">
              <ShLabel>Теги</ShLabel>
              <ShSkeleton v-if="tags?.length == 0" class="w-full min-w-96 h-8" />
              <div v-else class="flex flex-wrap gap-4 h-8 flex">
                <div class="flex items-center space-x-2" v-for="tag in tags">
                  <ShCheckbox @update:modelValue="(e) => {
                    if (!e) selectedTags = selectedTags.filter(t => t.id != tag.id)
                    else selectedTags.push(tag);
                    changedFilters()
                  }" :id="'tag-' + tag.id" />
                  <label
                      :for="'tag-' + tag.id"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {{tag.name}}
                  </label>
                </div>
              </div>
            </div>
            <div class="xl:hidden w-full">
              <ShSelect @update:modelValue="(e) => changedFilters(e)" multiple>
                <ShSelectTrigger class="space-y-1 xl:hidden w-full">
                  <ShLabel>Теги</ShLabel>
                  <ShButton size="sm" variant="outline" class="text-wrap min-h-8 h-auto w-full"><ShSelectValue placeholder="Выбрать теги" class="text-wrap" /></ShButton>
                </ShSelectTrigger>
                <ShSelectContent>
                  <ShSelectGroup>
                    <ShSelectItem :value="tag" v-for="tag in tags">
                      {{ tag.name }}
                    </ShSelectItem>
                  </ShSelectGroup>
                </ShSelectContent>
              </ShSelect>
            </div>
            <div class="space-y-2 flex flex-col min-w-64">
              <ShLabel>Кол-во на складе</ShLabel>
              <div class="flex items-centers gap-2">
                <ShSlider
                    v-model="productsInStorage"
                    :max="256"
                    :step="1"
                />
              </div>
              <div class="text-xs opacity-75 grid grid-cols-2"><p>Мин. {{productsInStorage[0]}}</p> <p class="text-right">Макс. {{productsInStorage[1] == 256 ? "бесконечность" : productsInStorage[1]}}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="hide">
      <FMProductsList v-if="productsModel.products.length > 0" v-model="productsModel"/>
    </transition>
    <transition>
      <div v-if="isAllLoaded && productsModel.products.length > 0 && (search.length > 0)"
           class="transform duration-500 flex justify-center my-6 text-base md:text-xl items-center gap-2">
        <Icon name="lucide:x" />Похоже, больше нет товаров по вашему запросу!
      </div>
      <div v-else-if="isAllLoaded && productsModel.products.length > 0"
           class="transform duration-500 flex justify-center my-6 text-base md:text-xl items-center gap-2">
        <Icon name="lucide:x" />Похоже, больше нет товаров!
      </div>
      <div v-else-if="isAllLoaded && productsModel.products.length == 0"
           class="transform duration-500 flex justify-center my-6 text-base md:text-xl items-center gap-2">
        <Icon name="lucide:x" />Похоже, нет товаров по вашему запросу, попробуйте изменить фильтры!
      </div>
    </transition>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
  @apply scale-100;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  @apply scale-0;
}

.hide-enter-active,
.hide-leave-active {
  transition: all 0.5s ease;
  @apply scale-y-100;
}

.hide-enter-from,
.hide-leave-to {
  opacity: 0;
  @apply scale-y-0;
}
</style>