<template>
    <NuxtLayout>
      <div class="">
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
  