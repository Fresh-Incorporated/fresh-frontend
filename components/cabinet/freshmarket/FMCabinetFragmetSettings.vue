<script setup lang="ts">
import IconUpload from "~/components/global/upload/IconUpload.vue";

const shop = defineModel()

const props = defineProps({
  icon: String,
  name: String,
  description: String,
  tag: String,
})

const newIcon = ref()
const newName = ref(props.name)
const newDescription = ref(props.description)
const newTag = ref(props.tag)

</script>

<template>
  <div class="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 h-64 col-span-2 p-3 flex flex-col">
    <div class="flex gap-2">
      <IconUpload v-model="newIcon" :current-image="icon" :show-current-image="newIcon == null" />
      <div class="w-full flex flex-col">
        <el-input
            v-model="newName"
            minlength="3"
            maxlength="16"
            placeholder="Название магазина"
            show-word-limit
            type="text"
            class="w-full"
        />
        <el-input
            v-model="newDescription"
            maxlength="240"
            placeholder="Описание магазина"
            show-word-limit
            :formatter="(value) => `${value}`.replace(/[\r\n]+/g, '')"
            :parser="(value) => value.replace(/[\r\n]+/g, '')"
            type="textarea"
            class="w-full max-h-40 overflow-y-auto mt-auto mb-0"
            :rows="7"
            resize="none"
        />
      </div>
    </div>
    <div class="mt-auto mb-0">
      <el-input
          v-model="newTag"
          minlength="3"
          maxlength="16"
          placeholder="Тег магазина [В разработке]"
          show-word-limit
          type="text"
          class="w-full opacity-75"
          disabled
      >
        <template #prepend>fresh.zaralx.ru/freshmarket/shop/</template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>

</style>