<template>
  <div class="grid">
    <div
      v-for="tab in tabs"
      :value="tab.value"
      @click="emit('setActive', tab.value)"
      class="flex pb-6 relative group cursor-pointer"
    >
      <span class="flex gap-x-3 z-20 relative">
        <span
          class="bg-white relative before:content-[''] before:absolute before:border-l-2 before:border-[#EAECF0] before:h-[38px] before:bottom-1/2 before:translate-x-[-50%] before:translate-y-[-50%] before:ml-[12px] before:mb-[4px] before:rounded-lg before:group-first:content-none"
          :class="`${
            active >= tab.value
              ? 'before:border-primary-500'
              : 'before:border-[#EAECF0]'
          } `"
        >
          <AppIcon
            v-if="active < tab.value"
            icon="fa-regular:dot-circle"
            iconClass="text-[24px] text-[#EAECF0]"
          />
          <span
            v-if="active >= tab.value"
            class="rounded-full flex justify-center items-center relative"
          >
            <AppIcon
              v-if="active > tab.value"
              icon="si:check-circle-fill"
              iconClass="text-2xl text-primary-500 relative"
            />
            <AppIcon
              v-if="active === tab.value"
              icon="fa-solid:dot-circle"
              iconClass="text-2xl text-primary-500 relative"
            />
          </span>
        </span>
        <div
          :class="`pt-[2px] text-sm leading-5 block  whitespace-nowrap ${
            active >= tab.value ? 'text-primary-500' : 'text-[#414651]'
          }`"
        >
          <span class="font-semibold block"> {{ tab.name }}</span>
          <span class="text-sm"> {{ tab.subtext }}</span>
        </div>
      </span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: [],
  },
  complete: {
    type: Boolean,
    default: false,
  },
  pending: { type: Boolean, default: false },
});
const active = inject("active");
const emit = defineEmits(["setActive"]);
</script>
