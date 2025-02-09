<template>
  <NuxtLayout>
    <div class="">
      <PagesApplicationManagement />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
const route = useRoute();
</script>
