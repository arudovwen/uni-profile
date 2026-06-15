<template>
  <div class="w-full">
    <!-- <div>
      <AppTab
        :tabs="tabs"
        :active="active"
      />
    </div> -->
    <div>
      <UsersContent v-if="active === 'admin'" />
      <!-- <Invites v-if="active === 'invites'" /> -->
    </div>
  </div>
</template>
<script setup>
import UsersContent from '~/components/Dashboard/UsersContent.vue';
import Invites from './invites.vue';
import UsersListContent from '~/components/Dashboard/UsersListContent.vue';

definePageMeta({
  layout: "superadmin",
});
const route = useRoute();

const active = computed(() =>
  route.path.endsWith("/invites") ? "invites" : "admin",
);

const tabs = [
  {
    title: "Users",
    key: "admin",
    to: "/users-management/members",
  },
  {
    title: "Invites",
    key: "invites",
    to: "/users-management/invites",
  },
];
</script>
