<script setup lang="ts">

import PixelWarsClans from "~/components/pixelwars/PixelWarsClans.vue";
import PixelWarsCreateClan from "~/components/pixelwars/PixelWarsCreateClan.vue";
</script>

<template>
  <ShDialog open>
    <ShDialogContent remove-close class="sm:max-w-[425px]">
      <ShDialogHeader>
        <ShDialogTitle>Добро пожаловать в PixelWars</ShDialogTitle>
        <ShDialogDescription class="space-y-1">
          <p>• В этой игре вам нужно вместе с кланом захватывать территорию которая будет пассивно приносить вам монеты и опыт клану.</p>
          <p>• За монеты вы сможете покупать улучшения в магазине.</p>
          <p>• Опыт повышает уровень клана а так-же влияет на топ.</p>
          <p>• Уровень клана даёт плюшки в виде лимита участников</p>
        </ShDialogDescription>
      </ShDialogHeader>

      <ShDialogFooter class="grid grid-cols-2">
        <PixelWarsCreateClan>
          <ShButton variant="warning" class="w-full">
            Создать клан
          </ShButton>
        </PixelWarsCreateClan>
        <PixelWarsClans>
          <ShButton class="w-full">
            Выбрать клан
          </ShButton>
        </PixelWarsClans>
      </ShDialogFooter>
    </ShDialogContent>
  </ShDialog>
</template>

<style scoped>

</style>