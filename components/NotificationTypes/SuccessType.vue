/* eslint-disable no-undef */
<template lang="">
  <div class="bg-white px-3 mb-2">
    <div class="flex items-start mb-2" @click="markNotification">
      <i
        class="uit uit-arrow-circle-up bg-[#258E3F] text-white rounded-full mr-2 before:!flex before:items-center before:justify-center before:w-[15px] before:h-[15px] rotate-[225deg]"
      ></i>
      <div>
        <p
          class="text-xs text-[#182230] flex-1 mb-2"
          :class="isViewed ? 'font-normal' : 'font-medium'"
        >
          {{ text }}
        </p>
        <p class="text-xs text-[#666] mb-2">{{ time }}</p>
        <!-- <NuxtLink :to="url">
          <button
            class="text-xs btn-secondary flex items-center justify-center h-8 rounded-lg px-4 py-2"
          >
            See more
          </button>
        </NuxtLink> -->
      </div>
      <i
        v-if="!isViewed"
        class="uis uil-circle text-[8px] text-[#258E3F] ml-auto"
      ></i>
    </div>
  </div>
</template>
<script setup>
import { defineProps, inject } from "vue";

const userId = inject("userId");
const props = defineProps(["id", "isViewed", "url", "text", "time"]);

const handleNotification = inject("handleNotification");
function markNotification() {
  let data = {
    userId: userId,
    id: props.id,
  };
  handleNotification(data);
}
</script>
