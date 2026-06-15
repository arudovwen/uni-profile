<template>
  <NuxtLayout :name="layoutName">
    <div class="container ">
      <PagesOwnerUsers
        v-if="authStore?.userInfo?.userCategory === 1 && !isRedirecting"
      />
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
  [0, 3, 4].includes(authStore.userInfo?.userCategory) ? "superadmin" : "default"
);
const isRedirecting = ref(false);

if (authStore?.userInfo?.userCategory === 1) {
  isRedirecting.value = true;
  await navigateTo("/users-management/members", { replace: true });
}

</script>
