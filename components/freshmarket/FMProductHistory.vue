<script setup lang="ts">
import {http} from "~/composables/useHttp"

const model = defineModel()
const loading = defineModel('loading', { default: false})
const props = defineProps({
  history: Array,
})
</script>

<template>
  <div>
    <el-drawer
        v-model="model"
        title="История товара"
        direction="rtl"
    >
      <div class="h-full w-full" v-loading="loading">
        <el-timeline style="max-width: 600px">
          <el-timeline-item
              v-for="(activity, index) in history"
              :key="index"
              :timestamp="activity.createdAt"
              :type="activity.action_type === 'created' ? 'success' :
                   activity.action_type === 'accepted' ? 'success' :
                   activity.action_type === 'declined' ? 'danger' :
                   ['refill_started', 'refill_waiting', 'refill_picked', 'refill_completed'].includes(activity.action_type) ? 'primary' : ''"
          >
            <div class="transform -translate-y-1">
              <div v-if="activity.action_type === 'created'">
                <p class="text-lg font-medium text-green-500">Товар создан</p>
                <div class="flex gap-2">
                  <p>Пользователь:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
                <p>{{activity.data}}</p>
              </div>
              <div v-else-if="activity.action_type === 'declined'">
                <p class="text-lg font-medium text-red-500">Товар отклонён</p>
                <div class="flex gap-2">
                  <p>Проверяющий:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
                <p>Сообщение: <strong class="text-neutral-400">{{activity.message?.length > 0 ? activity.message : "Сообщение отсутствует"}}</strong></p>
              </div>
              <div v-else-if="activity.action_type === 'accepted'">
                <p class="text-lg font-medium text-green-500">Товар проверен</p>
                <div class="flex gap-2">
                  <p>Проверяющий:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
              </div>
              <div v-else-if="activity.action_type === 'refill_started'">
                <p class="text-lg font-medium text-blue-500">Запрошена ячейка пополнения</p>
                <div class="flex gap-2">
                  <p>Пользователь:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
                <div class="flex gap-2">
                  <p>Ячейка:</p>
                  <p>{{activity?.data?.cell?.letter}}-{{activity?.data?.cell?.number}}</p>
                </div>
                <div class="flex gap-2">
                  <p>Локация:</p>
                  <p>{{activity?.data?.cell?.location?.name}}</p>
                </div>
              </div>
              <div v-else-if="activity.action_type === 'refill_waiting'">
                <p class="text-lg font-medium text-blue-500">Ожидает перемещения на склад</p>
                <div class="flex gap-2">
                  <p>Пользователь:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
              </div>
              <div v-else-if="activity.action_type === 'refill_picked'">
                <p class="text-lg font-medium text-blue-500">Пополнение принято логистом</p>
                <div class="flex gap-2">
                  <p>Пользователь:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
              </div>
              <div v-else-if="activity.action_type === 'refill_completed'">
                <p class="text-lg font-medium text-blue-500">Пополнение завершено</p>
                <div class="flex gap-2">
                  <p>Пользователь:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
                <div class="flex gap-2">
                  <p>Добавлено:</p>
                  <p>{{activity?.data?.count}} ед. товара</p>
                </div>
                <p>Сообщение: <strong class="text-neutral-400">{{activity.message?.length > 0 ? activity.message : "Сообщение отсутствует"}}</strong></p>
              </div>
              <div v-else>
                <p class="text-lg font-medium text-neutral-500">{{activity.action_type}}</p>
                <div class="flex gap-2">
                  <p>Пользователь:</p>
                  <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                  <p>{{activity.user.nickname}}</p>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
  </div>
</template>