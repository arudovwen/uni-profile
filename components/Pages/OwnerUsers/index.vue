<template>
  <div class="w-full">
    <!-- Top bar   -->

    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="User Management"
        subtext="Manage your team members and their account permissions here."
      />
    </div>
 
    <div>
      <AppTab
        :tabs="tabs"
        :active="active"
      />
    </div>
    <div>
      <UsersTable v-if="active=== 'members'" />
      <Invites  v-if="active=== 'invites'" />
    </div>
    <div>

    </div>
  </div>
</template>
<script setup>
import Invites from './invites.vue';
import UsersTable from './users-table.vue';

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();

const active = computed(() =>
  route.path.endsWith("/invites") ? "invites" : "members",
);

const tabs = [
  {
    title: "Users",
    key: "members",
    to: "/users-management/members",
  },
  {
    title: "Invites",
    key: "invites",
    to: "/users-management/invites",
  },
];
</script>
