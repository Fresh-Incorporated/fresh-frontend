<script setup lang="ts">
import { computed } from 'vue';
import type { Clan, Player } from '~/types/pixelwars';

interface Props {
  clan?: Clan;
  members?: Player[];
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: false
});

const emit = defineEmits<{
  'toggle-expand': [];
}>();

const totalMembers = computed(() => props.members?.length || 0);
const averageLevel = computed(() => {
  if (!props.members || props.members.length === 0) return 0;
  const sum = props.members.reduce((acc, member) => acc + member.level, 0);
  return Math.round(sum / props.members.length);
});

const totalClanPixels = computed(() => props.members?.reduce((acc, member) => acc + member.pixels, 0) || 0);
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ clan?.name || 'Информация о клане' }}
      </h3>
      <button
        @click="emit('toggle-expand')"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          :class="['w-5 h-5 transform transition-transform', { 'rotate-180': isExpanded }]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <div v-if="clan" class="space-y-3">
      <!-- Основная информация -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Тег клана:</span>
          <div class="font-medium text-gray-900">[{{ clan.tag }}]</div>
        </div>
        <div>
          <span class="text-sm text-gray-500">Уровень:</span>
          <div class="font-medium text-gray-900">{{ clan.level }}</div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Участники:</span>
          <div class="font-medium text-gray-900">{{ totalMembers }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-500">Средний уровень:</span>
          <div class="font-medium text-gray-900">{{ averageLevel }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Всего пикселей:</span>
          <div class="font-medium text-gray-900">{{ totalClanPixels.toLocaleString() }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-500">Монеты клана:</span>
          <div class="font-medium text-gray-900">{{ clan.totalCoins.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Ранг сезона -->
      <div v-if="clan.seasonRank" class="pt-2 border-t border-gray-100">
        <span class="text-sm text-gray-500">Ранг сезона:</span>
        <div class="font-medium text-yellow-600">#{{ clan.seasonRank }}</div>
      </div>

      <!-- Описание -->
      <div v-if="clan.description" class="pt-2 border-t border-gray-100">
        <span class="text-sm text-gray-500">Описание:</span>
        <div class="text-sm text-gray-700 mt-1">{{ clan.description }}</div>
      </div>
    </div>

    <!-- Список участников (если развернут) -->
    <div v-if="isExpanded && members && members.length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Участники клана</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <div
          v-for="member in members"
          :key="member.id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded"
        >
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-900">{{ member.username }}</span>
            <span class="text-xs text-gray-500">Ур. {{ member.level }}</span>
          </div>
          <div class="text-sm text-gray-600">
            {{ member.pixels }} пикс.
          </div>
        </div>
      </div>
    </div>

    <!-- Заглушка если клан не выбран -->
    <div v-else-if="!clan" class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Клан не выбран</h3>
      <p class="mt-1 text-sm text-gray-500">Выберите клан для просмотра статистики</p>
    </div>
  </div>
</template> 