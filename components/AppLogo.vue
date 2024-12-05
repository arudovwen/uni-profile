<template>
  <NuxtLink to="/">
    <img src="/logo.png" alt="Oxide" :class="className" />
  </NuxtLink>
</template>

<script setup>
defineProps({
  className: {
    default: "w-[124px] h-auto",
    type: String,
  },
  dark: {
    default: false,
  },
});
</script>
