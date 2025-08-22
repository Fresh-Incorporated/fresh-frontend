<script setup lang="ts">
import { ref, computed } from 'vue'
import PixelWarsCreateClan from "~/components/pixelwars/PixelWarsCreateClan.vue";

const {pixelwars_clans} = useUser()

// Моковые данные для демонстрации
const clans = ref([
  {
    id: 1,
    name: 'PixelWarriors',
    tag: 'PW',
    level: 15,
    members: 5,
    maxMembers: 10,
    totalPixels: 1500,
    totalCoins: 50000,
    description: 'Лучший клан в игре! Мы покоряем мир пиксель за пикселем.',
    leader: 'Player1',
    isInvited: false
  },
  {
    id: 2,
    name: 'DigitalLegends',
    tag: 'DL',
    level: 12,
    members: 8,
    maxMembers: 12,
    totalPixels: 1200,
    totalCoins: 35000,
    description: 'Легенды цифрового мира. Присоединяйтесь к нам!',
    leader: 'Player2',
    isInvited: true
  },
  {
    id: 3,
    name: 'PixelEmpire',
    tag: 'PE',
    level: 18,
    members: 15,
    maxMembers: 20,
    totalPixels: 2500,
    totalCoins: 75000,
    description: 'Империя пикселей. Мы строим будущее!',
    leader: 'Player3',
    isInvited: false
  },
  {
    id: 4,
    name: 'CyberClan',
    tag: 'CC',
    level: 9,
    members: 8,
    maxMembers: 8,
    totalPixels: 800,
    totalCoins: 20000,
    description: 'Киберпанк клан для настоящих хакеров.',
    leader: 'Player4',
    isInvited: false
  }
])

const searchQuery = ref('')
const sortBy = ref<'level' | 'members' | 'pixels'>('level')
const sortOrder = ref<'asc' | 'desc'>('desc')

const filteredClans = computed(() => {
  let filtered = pixelwars_clans.value.filter(clan =>
    clan.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    clan.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  filtered.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    if (sortOrder.value === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  return filtered
})

const handleInvite = (clanId: number) => {
  // Логика отправки приглашения
  console.log('Отправка приглашения в клан:', clanId)
}

const getLevelColor = (level: number) => {
  if (level >= 15) return 'text-purple-600 bg-purple-100'
  if (level >= 10) return 'text-blue-600 bg-blue-100'
  if (level >= 5) return 'text-green-600 bg-green-100'
  return 'text-gray-600 bg-gray-100'
}

const getMembersColor = (members: number, max: number) => {
  const ratio = members / max
  if (ratio >= 0.8) return 'text-red-600 bg-red-100'
  if (ratio >= 0.6) return 'text-yellow-600 bg-yellow-100'
  return 'text-green-600 bg-green-100'
}
</script>

<template>
  <ShDialog>
    <ShDialogTrigger as-child>
      <slot />
    </ShDialogTrigger>
    <ShDialogContent class="sm:max-w-[800px] w-[95vw] p-0 overflow-hidden max-h-[90vh]">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 border-b">
        <ShDialogHeader>
          <ShDialogTitle class="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Icon name="lucide:building-2" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span class="hidden sm:inline">Список кланов</span>
            <span class="sm:hidden">Кланы</span>
          </ShDialogTitle>
          <ShDialogDescription class="text-gray-600 mt-2 text-sm sm:text-base">
            <span class="hidden sm:inline">Изучите доступные кланы и присоединитесь к тому, который подходит именно вам</span>
            <span class="sm:hidden">Выберите подходящий клан</span>
          </ShDialogDescription>
        </ShDialogHeader>
      </div>

      <ShScrollArea class="max-h-[calc(100vh-240px)]">
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <!-- Поиск и фильтрация -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <ShInput
                  v-model="searchQuery"
                  placeholder="Поиск по названию или тегу клана..."
                  class="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div class="flex flex-row gap-3">
              <ShSelect v-model="sortBy" class="w-full sm:w-32">
                <ShSelectTrigger class="h-11 border-gray-200 w-full">
                  <ShButton variant="outline" size="lg" class="w-full sm:w-auto">
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4 mr-2" />
                    <ShSelectValue placeholder="Сортировка" />
                  </ShButton>
                </ShSelectTrigger>
                <ShSelectContent>
                  <ShSelectItem value="level">По уровню</ShSelectItem>
                  <ShSelectItem value="members">По участникам</ShSelectItem>
                  <ShSelectItem value="pixels">По пикселям</ShSelectItem>
                </ShSelectContent>
              </ShSelect>

              <ShButton
                  @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                  variant="outline"
                  size="icon"
                  class="h-11 w-11 border-gray-200 flex-shrink-0"
              >
                <Icon v-if="sortOrder === 'asc'" name="lucide:arrow-up" class="w-4 h-4" />
                <Icon v-else name="lucide:arrow-down" class="w-4 h-4" />
              </ShButton>
            </div>
          </div>

          <!-- Статистика -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icon name="lucide:users" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-600 truncate">Всего кланов</p>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">{{ pixelwars_clans.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border border-green-200">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="lucide:user" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-600 truncate">Активных игроков</p>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">{{ pixelwars_clans.reduce((sum, clan) => sum + clan.members ?? 0, 0) }}</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border border-purple-200">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Icon name="lucide:square" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-600 truncate">Всего пикселей</p>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">{{ pixelwars_clans.reduce((sum, clan) => sum + clan.totalPixels ?? 0, 0).toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-lg border border-yellow-200">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Icon name="lucide:coins" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-600 truncate">Всего монет</p>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">{{ pixelwars_clans.reduce((sum, clan) => sum + clan.totalCoins ?? 0, 0).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Список кланов -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Доступные кланы</h3>
              <p class="text-xs sm:text-sm text-gray-500">{{ filteredClans.length }} из {{ pixelwars_clans.length }}</p>
            </div>

            <div class="space-y-3">
              <div
                  v-for="clan in filteredClans"
                  :key="clan.id"
                  class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div class="flex-1 space-y-3">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                        {{ clan.tag }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 class="text-base sm:text-lg font-semibold text-gray-900 truncate">{{ clan.name }}</h4>
                          <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(clan.level)} whitespace-nowrap`">
                          {{ clan.level }} ур.
                        </span>
                        </div>
                        <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{{ clan.description }}</p>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span class="flex items-center gap-1">
                          <Icon name="lucide:crown" class="w-3 h-3" />
                          Лидер: {{ clan.leader }}
                        </span>
                          <span class="flex items-center gap-1">
                          <Icon name="lucide:calendar" class="w-3 h-3" />
                          {{ new Date().toLocaleDateString() }}
                        </span>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-2 sm:gap-4">
                      <div class="text-center">
                        <p class="text-xs text-gray-500 mb-1">Участники</p>
                        <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getMembersColor(clan.members, clan.maxMembers)}`">
                        {{ clan.members }}/{{ clan.maxMembers }}
                      </span>
                      </div>
                      <div class="text-center">
                        <p class="text-xs text-gray-500 mb-1">Пиксели</p>
                        <p class="text-xs sm:text-sm font-medium text-gray-900">{{ clan?.totalPixels?.toLocaleString() }}</p>
                      </div>
                      <div class="text-center">
                        <p class="text-xs text-gray-500 mb-1">Монеты</p>
                        <p class="text-xs sm:text-sm font-medium text-gray-900">{{ clan?.totalCoins?.toLocaleString() }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-col gap-2 sm:ml-4 relative">
                    <ShButton
                        @click="handleInvite(clan.id)"
                        :variant="clan.isInvited ? 'outline' : 'default'"
                        :class="clan.isInvited ? 'border-green-500 text-green-600 hover:bg-green-50' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'"
                        size="sm"
                        class="w-full sm:w-48 sm:absolute right-0"
                    >
                      <span class="text-xs sm:text-sm">{{ clan.isInvited ? 'Отправлено' : 'Отправить приглашение' }}</span>
                    </ShButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ShDialogFooter class="p-4 sm:p-6 border-t bg-gray-50 -mx-4 sm:-mx-6">
            <div class="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <p class="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                Не нашли подходящий клан?
                <PixelWarsCreateClan>
                  <button class="text-blue-600 hover:text-blue-700 font-medium underline">
                    Создайте свой!
                  </button>
                </PixelWarsCreateClan>
              </p>
            </div>
          </ShDialogFooter>
        </div>
      </ShScrollArea>
    </ShDialogContent>
  </ShDialog>
</template>

<style scoped>
/* Дополнительные стили для анимаций */
.sh-dialog-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Кастомные стили для скроллбара */
.sh-scroll-area-viewport::-webkit-scrollbar {
  width: 6px;
}

.sh-scroll-area-viewport::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.sh-scroll-area-viewport::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sh-scroll-area-viewport::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Утилиты для мобильной адаптации */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .sh-dialog-content {
    margin: 1rem;
    width: calc(100vw - 2rem);
  }
}
</style>