<template>
  <NuxtLayout name="superadmin">
    <div class="font-Avenir max-w-[1120px] mx-auto mt-8 sm:mt-10 lg:mt-[44px] pb-8 lg:px-4">
      <div class="mb-6">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#182230] mb-1 sm:mb-2">
          Applications
        </h1>
        <p class="text-xs sm:text-sm lg:text-base text-[#475467]">
          Manage all your applications in one place.
        </p>
      </div>
      <AdminAppsManagement />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
</script>
