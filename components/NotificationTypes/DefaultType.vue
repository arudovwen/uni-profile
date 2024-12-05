/* eslint-disable no-undef */
<template lang="">
  <div class="bg-[#F1F3F5] p-6 rounded-lg" @click="markNotification">
    <div class="flex items-start gap-x-4 group cursor-pointer">
      <span
        class="w-12 h-11 flex items-center justify-center rounded-full bg-white group-hover:bg-primary"
      >
        <i
          v-if="type == 3"
          class="uis uil-shop text-[#222222] flex group-hover:text-white"
        ></i>
        <i
          v-if="type == 1"
          class="uis uil-box text-[#222222] flex group-hover:text-white"
        ></i>
        <i
          v-if="type == 0"
          class="uis uil-bag text-[#222222] flex group-hover:text-white"
        ></i>
        <i
          v-if="type == 2"
          class="uis uil-file text-[#222222] flex group-hover:text-white"
        ></i>
      </span>
      <div class="flex-1">
        <p class="text-xs text-[#666] mb-1">
          {{ moment(new Date(time)).format("lll") }}
        </p>
        <p
          class="text-sm text-[#182230] flex-1 mb-2"
          :class="isViewed ? 'font-normal' : 'font-medium'"
        >
          {{ text }}
        </p>
      </div>
      <i
        v-if="!isViewed"
        class="uis uil-circle text-[8px] text-[#222222] ml-auto group-hover:text-primary"
      ></i>
      <i
        v-if="isViewed"
        class="uis uil-circle text-[8px] text-[#222222] ml-auto"
      ></i>
    </div>
  </div>
</template>
<script setup>
import { defineProps, inject } from "vue";
import moment from "moment";

const props = defineProps(["id", "isViewed", "url", "text", "time", "type"]);
const handleNotification = inject("handleNotification");
function markNotification() {
  let data = {
    id: props.id,
  };
  handleNotification(data);
}
</script>
