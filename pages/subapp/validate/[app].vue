<template>
  <section class="container p-10 flex gap-x-4">
    Validating user information...
  </section>
</template>
<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const { app } = route.params;

const auth = useAuthStore();

onMounted(() => {
  if (auth.access_token) {
    window.location.href = `${AppsObject[app]?.url}/auth/validate/${auth.access_token}`;
  }
});
</script>
