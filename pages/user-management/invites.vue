<template>
  <NuxtLayout>
    <div>
      <PagesSuperadminUsers />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
</script>
