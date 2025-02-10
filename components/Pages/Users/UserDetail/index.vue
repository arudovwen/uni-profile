<template>
  <div class="w-full mx-auto max-w-[1024px]">
    <div class="mb-4">
      <GoBack text="Back to User Management" url="/users-management" />
    </div>
    <div v-if="name" class="mb-6">
      <h2 class="text-base font-semibold capitalize">{{ name }}</h2>
    </div>

    <div class="flex gap-x-6">
      <div>
        <SideTab
          :tabs="tabs"
          @setActive="(val) => (active = val)"
          :active="active"
        />
      </div>
      <div class="flex-1">
        <Information v-if="active === 'profile'" />
        <Apps v-if="active === 'apps'" />
      </div>
    </div>
  </div>
</template>
<script setup>
import Information from "./Information";
import Apps from "./apps";

const {name} = useRoute().query
const active = ref("profile");
const tabs = [
  {
    label: "Personal Info",
    value: "profile",
  },
  {
    label: "Applications",
    value: "apps",
  },
];
</script>
