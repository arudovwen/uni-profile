<template>
    <NuxtLayout>
      <div class="container">
          <PagesSuperadminUserDetail />
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
  