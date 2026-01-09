<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.17967 8C1.65301 7.36667 1.33301 6.55333 1.33301 5.66667C1.33301 3.65333 2.97967 2 4.99967 2H8.33301C10.3463 2 11.9997 3.65333 11.9997 5.66667C11.9997 7.68 10.353 9.33333 8.33301 9.33333H6.66634"
      stroke-width="1.5"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.82 8.00008C14.3467 8.63341 14.6667 9.44675 14.6667 10.3334C14.6667 12.3467 13.02 14.0001 11 14.0001H7.66667C5.65333 14.0001 4 12.3467 4 10.3334C4 8.32008 5.64667 6.66675 7.66667 6.66675H9.33333"
      stroke-width="1.5"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), {
  color: "#475467",
});
</script>
