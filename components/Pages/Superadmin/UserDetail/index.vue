<template>
  <div class="w-full">
    <div class="mb-6">
      <GoBack text="Back to User Management" url="/user-management" />
    </div>
    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent title="John Snow" />
    </div>
    <div>
      <AppTab
        :tabs="tabs"
        @setActive="(val) => (active = val)"
        :active="active"
      />
    </div>
    <div class="flex">
      <Information v-if="active === 'profile'" />
      <Apps v-if="active === 'apps'" />
    </div>
  </div>
</template>
<script setup>
import Information from "./Information";
import Apps from "./apps";

const active = ref("profile");
const tabs = [
  {
    title: "User Profile",
    key: "profile",
  },
  {
    title: "Apps",
    key: "apps",
  },
];
</script>
