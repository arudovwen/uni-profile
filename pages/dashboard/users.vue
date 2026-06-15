<template>
  <NuxtLayout name="dashboard">
    <div
      class="font-Avenir max-w-[1120px] mx-auto mt-8 sm:mt-10 lg:mt-[44px] pb-8 lg:px-4"
    >
      <UsersContent v-if="isAdmin" />
      <DashboardUsersListContent v-else />
    </div>
  </NuxtLayout>
</template>

<script setup>
import UsersContent from "~/components/Dashboard/UsersContent.vue";

definePageMeta({ middleware: "auth" });

const authStore = useAuthStore();
const isAdmin = computed(() =>
  [0, 3].includes(authStore.userInfo?.userCategory),
);
</script>
