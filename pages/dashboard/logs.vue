<template>
  <NuxtLayout name="dashboard">
    <div class="font-Avenir max-w-[1120px] mx-auto mt-8 sm:mt-10 lg:mt-[44px] pb-8 lg:px-4">
      <DashboardLogsContent />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ middleware: "auth" });
</script>
