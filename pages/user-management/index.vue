<template>
  <NuxtLayout>
    <div class="">
        <PagesSuperadminUsers />
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
