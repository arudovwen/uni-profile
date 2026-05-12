<template>
  <NuxtLayout>
    <PagesSuperadminReferralManagementShell>
      <PagesSuperadminReferralManagement />
    </PagesSuperadminReferralManagementShell>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
</script>
