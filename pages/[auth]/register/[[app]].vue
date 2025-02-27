<template>
  <AuthVendorSignUp />
</template>
<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const step = ref(1);


onMounted(() => {
  if (route.query.step) {
    step.value = Number(route.query.step);
  }
});
provide("step", step);
</script>
