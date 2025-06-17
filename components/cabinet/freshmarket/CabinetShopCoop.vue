<script setup lang="ts">
import {http} from "~/composables/useHttp";
import {toast} from "vue-sonner";

const co_owners = defineModel("co-owners")

const emit = defineEmits(['updateShop'])

const {updateShops} = useUser()

const props = defineProps({
  shopId: Number,
})

const user = ref()
const inviteOpened = ref(false)
const permissions = ref({
  edit_shop_info: false,
  create_products: false,
  edit_products: false,
  refill_products: false,
  delete_products: false
})

const permissionTranslation = {
  edit_shop_info: {
    title: "Изменение магазина",
    description: "Позволяет редактировать данные магазина."
  },
  create_products: {
    title: "Создание товаров",
    description: "Позволяет добавлять новые товары в магазин."
  },
  edit_products: {
    title: "Изменение товаров",
    description: "Позволяет изменять уже созданные товаров."
  },
  refill_products: {
    title: "Пополнение товаров",
    description: "Позволяет пополнить товар на склад."
  },
  delete_products: {
    title: "Удаление товаров",
    description: "Позволяет полностью удалять товары из магазина."
  }
};


const invite = async () => {
  const response = await http.post(`/freshmarket/shop/${props.shopId}/coop/invite`, {
    uuid: user.value.uuid,
    permissions: permissions.value
  })

  inviteOpened.value = false
  await updateShops()
  emit("updateShop")
}

const _delete = async (id: number) => {
  const response = await http.post(`/freshmarket/shop/${props.shopId}/coop/delete`, {
    id: id,
  })

  await updateShops()
  emit("updateShop")
}

</script>

<template>
  <ShCard outlined class="rounded-sm col-span-2">
    <ShCardHeader>
      <ShCardTitle>Совладельцы магазина</ShCardTitle>
      <ShCardDescription>Пригласите друзей или жителей города для совместной торговли</ShCardDescription>
    </ShCardHeader>
    <ShCardContent class="space-y-4 p-1 md:p-4">
      <ShCard v-for="owner in co_owners" class="rounded-sm flex-row items-center">
        <div v-if="owner.status == 'pending'" class="absolute top-2 left-3 flex items-center gap-2">
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-ping absolute"></div>
          <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
          <p class="text-xs text-orange-400 font-medium">Ожидание принятия</p>
        </div>
        <div v-else-if="owner.status == 'declined'" class="absolute top-2 left-3 flex items-center gap-2">
          <div class="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></div>
          <div class="w-2 h-2 bg-red-500 rounded-full"></div>
          <p class="text-xs text-red-400 font-medium">Предложение отклонено</p>
        </div>
        <ShCardHeader class="flex-1">
          <ShCardTitle>{{owner.user.nickname}}</ShCardTitle>
          <ShCardDescription>{{
              Object.keys(permissionTranslation)
                  .filter((s) => owner[s])
                  .map(key => permissionTranslation[key].title)
                  .join(", ")
            }}</ShCardDescription>
        </ShCardHeader>
        <ShCardContent class="flex flex-col justify-between gap-2">
          <ShButton size="sm" variant="outline" :disabled="owner.status != 'accepted'">Изменить</ShButton>
          <ShButton size="sm" variant="destructive" @click="_delete(owner.user.id)">Удалить</ShButton>
        </ShCardContent>
      </ShCard>
      <ShCard outlined class="flex-jusity-center items-center !py-0">
        <ShDialog v-model:open="inviteOpened">
          <ShDialogTrigger as-child>
            <ShButton variant="ghost" class="h-full w-full">Пригласить совладельца</ShButton>
          </ShDialogTrigger>
          <ShDialogContent>
            <ShDialogHeader>
              <ShDialogTitle>Приглашение совладельцев</ShDialogTitle>
              <ShDialogDescription>
                По умолчанию каждый совладелец имеет право просматривать всю информацию о магазине.
              </ShDialogDescription>
            </ShDialogHeader>

            <SelectUser v-model:user="user" />

            <ShCard v-for="(value, id) in permissions" outlined class="!p-4 rounded-sm flex-row items-center">
              <div class="flex-1 space-y-1">
                <ShCardTitle>
                  {{permissionTranslation[id]?.title}}
                </ShCardTitle>
                <ShCardDescription>
                  {{permissionTranslation[id]?.description}}
                </ShCardDescription>
              </div>
              <ShSwitch v-model="permissions[id]" />
            </ShCard>

            <ShDialogFooter>
              <ShButton @click="invite" type="submit">
                Пригласить
              </ShButton>
            </ShDialogFooter>
          </ShDialogContent>
        </ShDialog>
      </ShCard>
    </ShCardContent>
  </ShCard>
</template>

<style scoped>

</style>