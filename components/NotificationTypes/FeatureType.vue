/* eslint-disable no-undef */
<template lang="">
  <div class="bg-white px-3 mb-2" @click="markNotification">
    <div class="flex items-start mb-2">
      <div
        class="bg-[#8C25C1] w-4 h-4 flex items-center justify-center mr-2 rounded-full"
      >
        <i class="uil uil-megaphone text-white text-[11px]"></i>
      </div>
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
            class="text-xs btn-secondary flex justify-center items-center h-8 rounded-lg px-4 py-2"
          >
            Learn more
            <i
              class="uis uil-arrow-up text-primary ml-1 rotate-45 flex text-sm"
            ></i>
          </button>
        </NuxtLink>
      </div>
      <i
        v-if="!isViewed"
        class="uis uil-circle text-[8px] text-[#8C25C1] ml-auto"
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
