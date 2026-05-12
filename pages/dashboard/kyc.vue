<template>
  <NuxtLayout name="dashboard">
    <DashboardKYCContent />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ middleware: "auth" });
</script>
