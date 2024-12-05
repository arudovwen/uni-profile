<template>
    <NuxtLayout>
      <div class="container">
        <PagesBusiness />
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();
  </script>
  