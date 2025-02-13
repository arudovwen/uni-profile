<template>
  <NuxtLayout :name="layoutName">
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

const authStore = useAuthStore()
const layoutName = computed(() =>
  [0, 3].includes(authStore.userInfo?.userCategory) ? "superadmin" : "default"
);
const route = useRoute();

</script>
