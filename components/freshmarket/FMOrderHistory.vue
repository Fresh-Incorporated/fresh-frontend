<script setup lang="ts">
import {http} from "~/composables/useHttp"
import {formatDateAbsolute} from "~/utils/convertDate";

const model = defineModel()
const props = defineProps({
  history: Array,
})
</script>

<template>
  <div>
    <el-drawer
        v-model="model"
        title="История заказа"
        direction="rtl"
    >
      <el-timeline style="max-width: 600px">
        <el-timeline-item
            v-for="(activity, index) in history"
            :key="index"
            :timestamp="formatDateAbsolute(activity.createdAt)"
            :type="activity.action_type === 'created' ? 'success' :
                   activity.action_type === 'paid' ? 'success' :
                   activity.action_type === 'confirmed' ? 'success' : 'primary'"
        >
          <div class="transform -translate-y-1">
            <div v-if="activity.action_type === 'created'">
              <p class="text-lg font-medium text-green-500">Заказ создан</p>
              <div class="flex gap-2">
                <p>Пользователь:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
            </div>
            <div v-else-if="activity.action_type === 'paid'">
              <p class="text-lg font-medium text-green-500">Заказ оплачен</p>
              <div class="flex gap-2">
                <p>Пользователь:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
            </div>
            <div v-else-if="activity.action_type === 'collect_picked'">
              <p class="text-lg font-medium text-blue-400">Сбор заказа</p>
              <div class="flex gap-2">
                <p>Логист:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
            </div>
            <div v-else-if="activity.action_type === 'collect_finished'">
              <p class="text-lg font-medium text-blue-400">Заказ собран</p>
              <div class="flex gap-2">
                <p>Логист:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
            </div>
            <div v-else-if="activity.action_type === 'deliver_started'">
              <p class="text-lg font-medium text-blue-400">Принят курьером</p>
              <div class="flex gap-2">
                <p>Курьер:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
            </div>
            <div v-else-if="activity.action_type === 'deliver_finished'">
              <p class="text-lg font-medium text-blue-400">Доставлен</p>
              <div class="flex gap-2">
                <p>Курьер:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
            </div>
            <div v-else-if="activity.action_type === 'confirmed'">
              <p class="text-lg font-medium text-green-500">Подтверждено получение</p>
              <div class="flex gap-2">
                <p>Пользователь:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.data}}</p>
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
    </el-drawer>
  </div>
</template>