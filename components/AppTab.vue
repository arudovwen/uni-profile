<template>
  <div
    class="flex gap-x-4 mb-6 w-full overflow-x-auto"
    :class="className"
  >
    <component
      v-for="tab in tabs"
      :key="tab.key"
      :is="tab.to ? 'NuxtLink' : 'button'"
      :to="tab.to"
      :type="tab.to ? undefined : 'button'"
      :data-testid="tab.title"
      @click="!tab.to && emit('setActive', tab.key)"
      :class="tabClass(tab.key)"
    >
      <span>{{ tab.title }}</span>
      <span
        class="text-xs h-6 min-w-[24px] rounded-full flex justify-center items-center border border-[#EAECF0] bg-[#F9FAFB] text-[#475467]"
        v-if="count && count[tab.key]"
        >{{ count[tab.key] }}</span
      >
    </component>
  </div>
</template>
<script setup>
const props = defineProps(["tabs", "className", "count", "activeClass", "active"]);
const emit = defineEmits(["setActive"]);

const tabClass = (key) =>
  `capitalize text-xs md:text-sm font-semibold pb-3 border-b-2 px-1 flex items-center gap-x-1 ${
    props.active === key
      ? `${props.activeClass || ""} border-primary-500 text-primary-500`
      : "border-transparent text-[#667085]"
  } `;
</script>
