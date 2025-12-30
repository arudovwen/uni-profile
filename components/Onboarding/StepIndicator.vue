<template>
  <div class="hidden md:flex items-center justify-center gap-4">
    <!-- Step 1: Select Apps -->
    <button
      type="button"
      :class="[
        'text-sm font-medium transition-colors whitespace-nowrap',
        currentStep >= 1 ? 'text-[#1570EF]' : 'text-[#A0A6AC]',
      ]"
      @click="$emit('step-click', 1)"
    >
      <span class="mr-1">1.</span>Select Apps
    </button>

    <!-- Step 2: Choose Roles -->
    <button
      type="button"
      :class="[
        'text-sm font-medium transition-colors whitespace-nowrap',
        currentStep >= 2 ? 'text-[#1570EF]' : 'text-[#A0A6AC]',
      ]"
      @click="$emit('step-click', 2)"
    >
      <span class="mr-1">2.</span>Choose Roles
    </button>

    <!-- Step 3: Complete -->
    <button
      type="button"
      :class="[
        'text-sm font-medium transition-colors whitespace-nowrap',
        currentStep >= 3 ? 'text-[#1570EF]' : 'text-[#A0A6AC]',
      ]"
      @click="$emit('step-click', 3)"
    >
      <span class="mr-1">3.</span>Complete
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number;
}

withDefaults(defineProps<Props>(), {
  currentStep: 1,
});
</script>
