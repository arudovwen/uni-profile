<template>
  <img src="@/assets/apps/mat.png" alt="sso" class="w-auto h-9" />
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
