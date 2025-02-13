<template>
  <NuxtLayout :name="layoutName">
    <div class="container">
      <PagesMyApplications />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const authStore = useAuthStore()
const layoutName = computed(() =>
  [0, 3].includes(authStore.userInfo?.userCategory) ? "superadmin" : "default"
);
</script>
