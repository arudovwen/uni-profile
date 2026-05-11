<template>
  <div class="mb-5 flex flex-row justify-between items-start flex-wrap gap-4">
    <!-- Title and Subtitle -->
    <div>
      <h1 class="text-xl font-semibold text-[#181D27] leading-[28px]">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-sm text-[#667085]">
        {{ subtitle }}
      </p>
    </div>
    <!-- Right Side Slot -->
    <slot name="right" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: "",
});
</script>
