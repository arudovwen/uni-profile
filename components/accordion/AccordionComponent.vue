<template>
  <div class="accordion grid gap-y-8">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="overflow-hidden"
    >
      <div
        @click="toggleAccordion(index)"
        class="w-full flex justify-between items-center text-left gap-x-6"
      >
        <p class="leading-normal px-2 font-semibold text-sm md:text-base">{{ item.title }}</p>

        <AppIcon :icon="!isOpen(index) ? 'ei:plus' : 'ei-minus'" iconClass="text-[#98A2B3] text-lg" />
      </div>
      <div v-if="isOpen(index)" class="px-2 py-1 text-left font-normal text-[13px] md:text-[15px] text-[#475467]">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
  },
  data() {
    return {
      openItem: null,
    };
  },
  methods: {
    toggleAccordion(index) {
      if (this.isOpen(index)) {
        this.openItem = null;
      } else {
        this.openItem = index;
      }
    },
    isOpen(index) {
      return this.openItem === index;
    },
  },
};
</script>

<style scoped>
/* Add Tailwind CSS classes here as needed */
</style>
