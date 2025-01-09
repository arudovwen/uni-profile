<template>

    <img
      :src="AppsObject[app]?.logo || '/logo.png'"
      :alt="AppsObject[app]?.label"
      :class="className"
    />

</template>

<script setup>
const route = useRoute();
const { app } = route.params;

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
