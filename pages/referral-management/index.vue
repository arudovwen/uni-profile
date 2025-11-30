<template>
  <NuxtLayout>
    <div class="">
      <PagesSuperadminReferralManagement />
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
