<template>
  <div class="flex">
    <div class="w-[280px] flex  flex-col">
      <span class="text-sm font-semibold text-[#344054]"
        >{{ label }} <RedDot v-if="isCumpulsory"
      /></span>
      <span class="text-sm text-[#344054]">{{ subtext }}</span>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
defineProps({
  isCumpulsory: {
    default: false,
  },
  label: {
    default: "",
  },
  subtext: {
    default: "",
  },
});
</script>
