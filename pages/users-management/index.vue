<template>
  <NuxtLayout>
    <div class="container py-10">
      <PagesOwnerUsers v-if="authStore?.userInfo?.userCategory === 1" />
      <PagesUsers v-else />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const route = useRoute();
</script>
