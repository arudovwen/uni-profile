<template>
  <NuxtLayout>
    <div class="container">
      <PagesSubApps />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
</script>
