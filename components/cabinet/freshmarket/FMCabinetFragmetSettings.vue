<script setup lang="ts">
</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-2">
    Настройки магазина
    <input
        type="file"
        @change="handleFileChange"
        accept="image/*"
        class="w-full"
    />
    <el-input
        v-model="name"
        minlength="3"
        maxlength="16"
        placeholder="Название магазина"
        show-word-limit
        type="text"
    />
    <el-input
        v-model="description"
        maxlength="240"
        placeholder="Описание магазина"
        show-word-limit
        :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
        :parser="(value) => value.replace(/[\r\n]+/g, '')"
        type="textarea"
    />

    лимит товаров, тег магазина (например магазин "Шаурмечная" shaurma377 для ссылки /freshmarket/shop/shaurma377)
  </div>
</template>

<style scoped>

</style>