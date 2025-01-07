<template>
  <NuxtLink to="/">
    <img
      :src="AppsObject[app]?.logo || '/logo.png'"
      :alt="AppsObject[app]?.label"
      :class="className"
    />
  </NuxtLink>
</template>

<script setup>
const route = useRoute();
const { app } = route.query;

defineProps({
  className: {
    default: "w-auto h-8",
    type: String,
  },
  dark: {
    default: false,
  },
});
</script>
