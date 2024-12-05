<template>
    <NuxtLayout>
      <div class="py-10">
        <PagesNotification />
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();
  </script>
  