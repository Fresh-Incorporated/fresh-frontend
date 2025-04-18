<script setup lang="ts">
const opened = defineModel()
const newIcon = ref()
</script>

<template>
<el-dialog v-model="opened">
  <div>
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
  </div>
</el-dialog>
</template>

<style scoped>

</style>