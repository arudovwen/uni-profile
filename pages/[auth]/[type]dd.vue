<template>
  <AuthVendorSignUp />
</template>
<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const step = ref(1);
const { type } = route.params;
const options = [
  {
    title: "Buyer account",
    icon: "ri:user-3-line",
    type: "register",
    url: "/auth/register",
    sub: "Search, buy and place orders for products",
  },
  {
    title: "Vendor account",
    icon: "solar:shop-linear",
    type: "vendor-register",
    url: "/auth/vendor-register",
    sub: "For merchants who wants to sell their products",
  },
];
onMounted(() => {
  if (route.query.step) {
    step.value = Number(route.query.step);
  }
});
provide("step", step);
</script>
