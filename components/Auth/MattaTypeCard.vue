<template>
  <div
    @click="$emit('click')"
    :class="[
      'box-border  bg-white border-2 shadow-md rounded-lg relative px-4 py-4 cursor-pointer',
      active && 'border-[#80B0FF]',
      'flex-none w-full ',
    ]"
  >
    <div class="mb-3">
      <!-- Dynamically render the correct icon component based on the 'active' state -->
      <span class="block text-[28px]"  :class="active ? 'text-primary-500' : 'text-[#344054]'"><AppIcon :icon="icon" /></span>
    </div>

    <div
      class="font-medium text-sm"
      :class="active ? 'text-primary-500' : 'text-[#344054]'"
    >
      {{ title }}
    </div>

    <div
      class="font-normal text-[10px] text-[#667085]"
      :class="active ? 'text-primary-500' : 'text-[#667085]'"
    >
      {{ description }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: Boolean,
  title: String,
  description: String,
  icon: String,
});
</script>
