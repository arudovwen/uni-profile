<template>
  <div
    class="flex gap-x-4 mb-6 w-full overflow-x-auto border-b border-[#EAECF0]"
    :class="className"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :data-testid="tab.title"
      @click="emit('setActive', tab.key)"
      :class="`capitalize text-xs md:text-sm font-semibold pb-3 border-b-2 px-1 flex items-center gap-x-1 ${
        active === tab.key
          ? `${activeClass} border-primary-500 text-primary-500`
          : 'border-transparent text-[#667085]'
      } `"
    >
      <span>{{ tab.title }}</span>
      <span
        class="text-xs h-6 min-w-[24px] rounded-full flex justify-center items-center border border-[#EAECF0] bg-[#F9FAFB] text-[#475467]"
        v-if="count && count[tab.key]"
        >{{ count[tab.key] }}</span
      >
    </button>
  </div>
</template>
<script setup>
defineProps(["tabs", "className", "count", "activeClass", "active"]);
const emit = defineEmits(["setActive"]);
</script>
