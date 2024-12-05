<template>
  <span :class="`${containerClass} flex flex-row gap-2 items-center w-full`">
    <slot></slot>
    <div class="flex flex-col">
      <span :class="`${textClass} text-[#667085] text-sm`">{{
        props.text
      }}</span>
      <span
        :class="`${subTextClass} text-[18px] font-semibold text-[#344054]`"
        >{{ props.subText }}</span
      >
    </div>
  </span>
</template>

<script setup>
const props = defineProps([
  "text",
  "subText",
  "containerClass",
  "subTextClass",
  "textClass",
]);
</script>

<style lang="scss" scoped></style>
