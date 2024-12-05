/* eslint-disable no-undef */
<template lang="">
  <div class="bg-[#F1F3F5] p-4 sm:p-6 rounded-lg" @click="markNotification">
    <div class="flex items-start gap-x-4 group cursor-pointer">
      <span
        class="sm:w-12 w-8 h-8 sm:h-11 flex items-center justify-center rounded-full bg-white group-hover:bg-primary"
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
        <i
          v-if="type == 4"
          class="uis uil-megaphone text-[#222222] flex group-hover:text-white"
        ></i>
      </span>
      <div class="flex-1">
        <p class="text-[10px] sm:text-xs text-[#666] mb-1">
          {{ time }}
        </p>
        <p
          class="text-xs sm:text-sm flex-1 mb-2"
          :class="
            isViewed ? 'font-normal text-[#666]' : 'font-medium text-[#182230]'
          "
        >
          {{ text }}
        </p>
        <div v-if="type == 4" class="text-right">
          <NuxtLink
            :to="url"
            class="text-primary text-xs sm:text-sm border-b border-primary"
            >See details</NuxtLink
          >
        </div>
        <!-- <div v-if="type == 1" class="text-right mt-4">
          <NuxtLink to="/checkout" class="text-primary text-xs sm:text-sm"
            >Proceed to checkout</NuxtLink
          >
        </div> -->
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

const props = defineProps(["id", "isViewed", "url", "text", "time", "type"]);
const handleNotification = inject("handleNotification");
function markNotification() {
  let data = {
    id: props.id,
  };
  handleNotification(data);
}
</script>
