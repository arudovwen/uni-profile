<template>
    <NuxtLayout>
      <div class="container">
       <PagesAudit />
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();
  </script>
  