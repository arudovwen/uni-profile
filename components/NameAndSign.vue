<template>
  <div class="relative w-full flex flex-row justify-between my-6">
    <div class="w-[263px] h-[49px] left-[355px] top-[765px]">
      <span
        class="w-[96px] left-0 top-0 font-semibold text-[12px] leading-[15px] text-[#475467] font-['Onest']"
      >
        {{ label }}
      </span>
      <div
        class="w-full mt-7 h-[1px] right-8 top-[49px] bg-[#475467] border-t border-[#344054]"
      ></div>
    </div>
    <div class="w-[213px] h-[49px] left-[355px] top-[765px]">
      <span
        class="w-[96px] left-0 top-0 font-semibold text-[12px] leading-[15px] text-[#475467] font-['Onest']"
      >
        Signature / Date
      </span>
      <div
        class="w-[213px] mt-7 h-[1px] right-8 top-[49px] bg-[#475467] border-t border-[#344054]"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["label"]);
</script>

<style lang="scss" scoped></style>
