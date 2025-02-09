<template>
    <NuxtLayout>
      <div class="">
        <PagesApplicationManagementCreateForm />
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
  