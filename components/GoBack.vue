<template>
  <button
    @click="navigateTo(url)"
    class="flex gap-x-2 items-center font-medium text-sm text-primary-500"
  >
    <AppIcon icon="line-md:arrow-left" /> {{ text }}
  </button>
</template>

<script setup>
defineProps(["text", "url"]);
</script>
