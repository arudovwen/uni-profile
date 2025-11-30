<template>
  <NuxtLayout>
    <div class="">
      <PagesSuperadminReferralManagementCreate />
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
