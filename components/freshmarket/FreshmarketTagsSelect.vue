<script setup lang="ts">
import { useFilter } from 'reka-ui'

const { getTags } = useUser()

const props = defineProps({
  componentField: Object
})

const selectedTags = defineModel()

const open = ref(false)
const value = ref<string[]>([])
const searchTerm = ref('')

const tags = ref([])

onMounted(async () => {
  tags.value = await getTags()
})

const { contains } = useFilter({ sensitivity: 'base' })
const filteredTags = computed(() => {
  const options = tags.value.filter(i => !selectedTags.value.find(tag => i.name == tag.name))
  return searchTerm.value ? options.filter(option => contains(option.name, searchTerm.value)) : options
})
</script>

<template>
  <ShCombobox v-model="selectedTags" v-model:open="open" :ignore-filter="true">
    <ShComboboxAnchor as-child>
      <ShFormControl>
        <ShTagsInput
            v-model="selectedTags"
            @update:model-value="componentField['onUpdate:modelValue']"
            class="w-full"
            @click="open = true"
        >
          <ShTagsInputItem v-for="item in selectedTags" :key="item" :value="item">
            <ShTagsInputItemText>{{item.name}}</ShTagsInputItemText>
            <ShTagsInputItemDelete />
          </ShTagsInputItem>

          <ShComboboxInput wrapper-class="border-none px-0 h-8" class="!py-0 !h-8" no-icon v-model="searchTerm" as-child>
            <ShTagsInputInput autocomplete="off" placeholder="Выберите теги.." @keydown.enter.prevent />
          </ShComboboxInput>
        </ShTagsInput>
      </ShFormControl>

      <ShComboboxList class="w-[--reka-popper-anchor-width]">
        <ShComboboxEmpty />
        <ShComboboxGroup>
          <ShComboboxItem
              v-for="tag in filteredTags" :key="tag.id" :value="tag.name"
              @select.prevent="(e) => {
                          if (typeof e.detail.value === 'string') {
                            searchTerm = ''
                            selectedTags.push(tag)
                          }

                          if (filteredTags.length === 0) {
                            open = false
                          }
                        }"
          >
            {{ tag.name }}
          </ShComboboxItem>
        </ShComboboxGroup>
      </ShComboboxList>
    </ShComboboxAnchor>
  </ShCombobox>
</template>

<style scoped>

</style>