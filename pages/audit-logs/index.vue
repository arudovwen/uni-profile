<template>
  <NuxtLayout :name="layoutName">
    <div :class=" authStore.userInfo?.userCategory === 3 ? '' : 'container py-10 max-w-[900px] mx-auto'">
      <PagesAudit />
    </div>
  </NuxtLayout>
</template>

<script setup>
const authStore = useAuthStore();

const layoutName = computed(() =>
  [0, 3].includes(authStore.userInfo?.userCategory) ? "superadmin" : "default"
);

// Define page meta with just the middleware
definePageMeta({
  middleware: "auth"
});
</script>