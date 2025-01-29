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
  if (auth.isLoggedIn && auth.access_token) {
    const encodededToken = encodeURIComponent(auth.access_token);
    window.location.href = `${AppsObject[app]?.url}/auth/validate/app?token=${encodededToken}`;
    return;
  }
  navigateTo(
    `/auth/login${
      route.query.app ? `/${route.query.app}` : ""
    }?${new URLSearchParams({
      redirected_from: route.path,
      ...route.query,
    })}`
  );
});
</script>
