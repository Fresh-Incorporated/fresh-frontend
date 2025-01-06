<script setup lang="ts">
import {http} from "~/composables/useHttp"

const model = defineModel()
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
      <el-timeline style="max-width: 600px">
        <el-timeline-item
            v-for="(activity, index) in history"
            :key="index"
            :timestamp="activity.createdAt"
            :type="activity.action_type === 'created' ? 'success' :
                   activity.action_type === 'accepted' ? 'success' :
                   activity.action_type === 'declined' ? 'danger' : ''"
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
                <p>Пользователь:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
              <p>{{activity.message}}</p>
            </div>
            <div v-else-if="activity.action_type === 'accepted'">
              <p class="text-lg font-medium text-green-500">Товар проверен</p>
              <div class="flex gap-2">
                <p>Пользователь:</p>
                <img :src="useXIS().getFullFace(activity.user.uuid)" class="w-4 h-4" alt="">
                <p>{{activity.user.nickname}}</p>
              </div>
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