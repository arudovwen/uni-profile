<template>
    <NuxtLayout>
      <div class="container py-10">
          <PagesUsersUserDetail />
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();
  </script>
  