<template>
  <div class="w-full h-[32px]border-[#E4E7EC] border-b-[1px] overflow-x-scroll">
    <div class="flex flex-row flex-nowrap justify-start mt-6 mb-6 min-w-[100%]">
      <span
        v-for="tab in tabs"
        @click="$emit('changeTab', tab.key)"
        :class="`cursor-pointer h-full w-fit inline items-center p-3 text-sm text-[#667085] ${
          activeTab === tab.key &&
          'border-[#182230] border-b-[2px] text-[#182230]'
        }`"
      >
        {{ tab.name }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: [
      {
        name: "Active",
        key: "active",
      },
    ],
  },
  activeTab: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(["changeTab"]);
</script>

<style lang="scss" scoped></style>
