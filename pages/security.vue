<template>
  <NuxtLayout :name="layoutName">
    <div class="grid py-10 gap-y-10">
      <PagesSecurityPassword /> 
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
  [0, 3, 4].includes(authStore.userInfo?.userCategory) ? "superadmin" : "default"
);
</script>
