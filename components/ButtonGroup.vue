<template>
  <div
    class="box-border flex border border-[#D0D5DD] shadow-[inset_0_0_0_1px_rgba(16,24,40,0.18),inset_0_-2px_0_rgba(16,24,40,0.05)] drop-shadow-[0_1px_2px_rgba(16,24,40,0.05)] rounded-[8px] overflow-hidden"
  >
    <button
      v-for="(item, index) in content"
      @click="emit('onSelect', item.value);"
      :key="index"
      type="button"
      class="text-sm font-semibold  border-r last:border-none border-[#D0D5DD] text-[#182230] px-[16px] py-[10px]"
      :class="active == item.value ? 'bg-[#F9FAFB]' : 'bg-white'"
    >
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps(["content", "active"]);
const emit = defineEmits(["onSelect"]);
</script>
