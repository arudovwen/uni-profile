<template>
  <div class="w-full mx-auto max-w-[900]">
    <!-- Top bar   -->

    <div
      class="flex flex-col mb-6 lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="User Management"
        subtext="Manage your team members here."
      />
    </div>
    <hr class="my-7" />
    <UsersTable />
  </div>
</template>
<script setup>
import UsersTable from "../Superadmin/Users/users-table.vue";

definePageMeta({
  layout: "dashboard",
});
</script>
