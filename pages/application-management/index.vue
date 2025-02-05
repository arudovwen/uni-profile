<template>
  <NuxtLayout>
    <div class="">
      <PagesSubApps />
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
