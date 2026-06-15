<template>
  <NuxtLayout>
    <PagesSettlements />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
</script>
