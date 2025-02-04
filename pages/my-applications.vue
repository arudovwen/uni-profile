<template>
    <NuxtLayout>
      <div class="container">
        <PagesMyApplications />
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();
  </script>
  