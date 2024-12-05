/* eslint-disable no-undef */
<template lang="">
  <div class="bg-white px-3 mb-2" @click="markNotification">
    <div class="flex items-start mb-2">
      <i class="uis uil-info-circle mr-2 text-[#FFB743] flex"></i>
      <div>
        <p
          class="text-xs text-[#182230] flex-1 mb-2"
          :class="isViewed ? 'font-normal' : 'font-medium'"
        >
          {{ text }}
        </p>
        <p class="text-xs text-[#666] mb-2">{{ time }}</p>
        <NuxtLink :to="url">
          <button
            class="text-xs btn-secondary h-8 flex items-center justify-center rounded-lg px-4 py-2"
          >
            See more
          </button>
        </NuxtLink>
      </div>
      <i
        v-if="!isViewed"
        class="uis uil-circle text-[8px] text-[#FFB743] ml-auto"
      ></i>
    </div>
  </div>
</template>
<script setup>
import { defineProps, inject } from "vue";

const props = defineProps(["id", "isViewed", "url", "text", "time"]);
const userId = inject("userId");
const handleNotification = inject("handleNotification");
function markNotification() {
  let data = {
    userId: userId,
    id: props.id,
  };
  handleNotification(data);
}
</script>
