<template>
  <NuxtLayout>
    <PagesSuperadminReferralManagementShell>
      <PagesSuperadminReferralManagementLeaderboard
        customClass="py-0"
        hideHeader
      />
    </PagesSuperadminReferralManagementShell>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
</script>
