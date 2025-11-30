<template>
  <NuxtLayout>
    <div class="">
      <PagesSuperadminReferralManagementEdit[id] />
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
