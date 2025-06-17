<script setup lang="ts">
import {http} from "~/composables/useHttp"
import { useDebounce } from '@vueuse/core'
const userModel = defineModel("user")

const uuidPopover = ref(false)

const users = ref([{
  uuid: "11fd94e9-706b-486e-8274-60c55a55c01b",
  nickname: "_zaralX_"
}])

const open = ref(false)
const search = ref("")

const updateUsers = async () => {
  const response = await http.get("/users", {
    params: {
      search: search.value
    }
  })

  users.value = response.data.users
}

const debouncedSearch = useDebounce(search, 200)

watch(debouncedSearch, async () => {
  await updateUsers()
})

onMounted(() => {
  updateUsers()
})
</script>

<template>
  <ShPopover v-model:open="open">
    <ShPopoverTrigger as-child>
      <ShButton
          variant="outline"
          class=""
      >
        <template v-if="user">
          <div class="flex items-center gap-2 font-medium">
            <img class="w-6 h-6" :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${user.uuid}/full`" alt="">
            {{user.nickname}}
          </div>
        </template>
        <template v-else>
          Выбрать игрока
        </template>
      </ShButton>
    </ShPopoverTrigger>
    <ShPopoverContent class="p-0">
      <ShCommand>
        <ShCommandInput v-model="search" placeholder="Поиск пользователя..." />
        <ShCommandList>
          <ShCommandEmpty v-if="users?.length == 0">Ничего не найдено.</ShCommandEmpty>
          <ShCommandGroup>
            <ShCommandItem
                v-for="user in users"
                :key="user.uuid"
                :value="user.uuid"
                @select="() => {
                  userModel = user
                  open = false
                }"
                class="p-2 cursor-pointer"
            >
              <div class="flex items-center gap-2 font-medium">
                <img class="w-6 h-6" :src="`https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/${user.uuid}/full`" alt="">
                {{user.nickname}}
              </div>
            </ShCommandItem>
          </ShCommandGroup>
        </ShCommandList>
      </ShCommand>
    </ShPopoverContent>
  </ShPopover>
</template>