<template>
  <div
    v-show="showTopMargin"
    :class="`${containerClass} h-[1px] w-full bg-[#E4E7EC] my-4`"
  ></div>
  <div class="flex flex-col lg:flex-row items-start content-start p-0 w-full">
    <div
      class="flex flex-col items-start p-0 mb-4 w-[280px] min-w-[200px] max-w-[280px] h-[20px]"
    >
      <div class="flex flex-row items-center p-0 gap-1 h-[20px]">
        <span
          class="flex-none w-fit h-[20px] font-Onest font-semibold text-[14px] leading-[20px] text-[#344054]"
        >
          {{ text }}
        </span>
        <!-- <RedDot :v-show="isCompulsory" /> -->
      </div>
    </div>
    <div class="w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    default: "",
  },
  showTopMargin: {
    default: true,
  },
  containerClass: {
    default: "",
  },
  isCompulsory: {
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
