<script setup lang="ts">

const { getTags } = useUser()

const props = defineProps({
  componentField: Object,
  notForm: Boolean,
  tags: Array
})

const selectedTags = defineModel()

const tagsModel = ref([])

onMounted(async () => {
  tagsModel.value = await getTags()
  if (props.tags) {
    selectedTags.value = tagsModel.value.filter(tag => props.tags.find(t => tag.id == t.id))
  }
})
</script>

<template>
  <ShSelect v-model="selectedTags" multiple v-bind="componentField">
    <ShFormControl v-if="!notForm">
      <ShSelectTrigger>
        <ShButton class="w-full" variant="outline" size="sm"><ShSelectValue placeholder="Выбрать теги" /></ShButton>
      </ShSelectTrigger>
    </ShFormControl>
    <ShSelectTrigger v-else>
      <ShButton class="w-full" variant="outline" size="sm"><ShSelectValue placeholder="Выбрать теги" /></ShButton>
    </ShSelectTrigger>
    <ShSelectContent>
      <ShSelectGroup>
        <ShSelectItem :value="tag" v-for="tag in tagsModel">
          {{ tag.name }}
        </ShSelectItem>
      </ShSelectGroup>
    </ShSelectContent>
  </ShSelect>
</template>

<style scoped>

</style>