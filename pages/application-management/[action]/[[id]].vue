<template>
    <NuxtLayout>
      <div class="container">
        <PagesSubAppsCreateForm />
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
  