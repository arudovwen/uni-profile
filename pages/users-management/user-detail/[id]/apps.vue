<template>
  <NuxtLayout :name="layoutName">
    <div class="container py-10">
      <PagesUsersUserDetail />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const layoutName = computed(() =>
  [0, 3, 4].includes(authStore.userInfo?.userCategory)
    ? "superadmin"
    : "default",
);
</script>
