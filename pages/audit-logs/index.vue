<template>
    <NuxtLayout>
      <div class="">
       <PagesAudit />
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
  