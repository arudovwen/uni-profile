<template>
  <div class="bg-[#ECECEC] rounded-full w-full">
    <span :style="{ width: `${value}%` }" class="bg-[#15B79E] rounded-full p-[4px] block">
    </span>
  </div>
</template>

<script setup>
defineProps(["value"]);
</script>
