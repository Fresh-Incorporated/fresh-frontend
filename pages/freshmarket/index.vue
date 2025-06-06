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

onMounted(async () => await load())

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

const changedFilters = async () => {
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
</script>

<template>
  <div v-infinite-scroll="load" infinite-scroll-immediate="false">
    <ProjectHead></ProjectHead>
    <FMCartButton/>
    <div class="md:w-11/12 mx-auto">
      <el-affix :offset="56" :z-index="20">
        <div class="bg-neutral-50/[.9] dark:bg-neutral-900/[.9] backdrop-blur rounded-b-lg shadow dark:shadow-lg p-2 flex gap-2 border border-t-0 border-neutral-100 dark:border-neutral-800">
          <el-input placeholder="Поиск по названию" v-model="search" @input="searchInput" @change="changedFilters" />
          <el-select @change="changedFilters"
              v-model="sort"
              placeholder="Сортировка по цене"
              style="width: 240px"
          >
            <el-option
                label="Сортировка по цене"
                value="relevance"
            />
            <el-option
                label="Сначала дорогие"
                value="expensive"
            />
            <el-option
                label="Сначала дешевые"
                value="cheap"
            />
          </el-select>
        </div>
      </el-affix>
    </div>
    <transition name="hide">
      <FMProductsList v-if="productsModel.products.length > 0" v-model="productsModel"/>
    </transition>
    <transition>
      <div v-if="isAllLoaded && productsModel.products.length > 0 && (search.length > 0)"
           class="transform duration-500 flex justify-center my-6 text-base md:text-xl items-center gap-2">
        <i class="pi pi-times"></i>Похоже, больше нет товаров по вашему запросу!
      </div>
      <div v-else-if="isAllLoaded && productsModel.products.length > 0"
           class="transform duration-500 flex justify-center my-6 text-base md:text-xl items-center gap-2">
        <i class="pi pi-times"></i>Похоже, больше нет товаров!
      </div>
      <div v-else-if="isAllLoaded && productsModel.products.length == 0"
           class="transform duration-500 flex justify-center my-6 text-base md:text-xl items-center gap-2">
        <i class="pi pi-times"></i>Похоже, нет товаров по вашему запросу, попробуйте изменить фильтры!
      </div>
    </transition>
  </div>
</template>

<style scoped>
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