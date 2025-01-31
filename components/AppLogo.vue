<template>

    <img
      src="@/assets/apps/ssologo.png"
      alt="sso"
      class="w-auto h-16"
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
