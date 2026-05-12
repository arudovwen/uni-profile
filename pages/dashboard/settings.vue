<template>
  <NuxtLayout name="dashboard">
    <DashboardSettingsContent />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ middleware: "auth" });
</script>
