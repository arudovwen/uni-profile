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
import { getUserDetail } from "~/services/settingservices";

const { name } = useRoute().query;
const route = useRoute();
const { id } = route.params;

const active = computed(() => (route.path.endsWith("/apps") ? "apps" : "profile"));

const tabs = computed(() => [
  {
    label: "Personal Info",
    value: "profile",
    to: {
      path: `/users-management/user-detail/${id}/profile`,
      query: route.query,
    },
  },
  {
    label: "Applications",
    value: "apps",
    to: {
      path: `/users-management/user-detail/${id}/apps`,
      query: route.query,
    },
  },
]);
const myUserApps = ref([]);
onMounted(() => {
  getUserDetail(id).then((res) => {
    if (res.status === 200) {
      myUserApps.value = res.data.data.subAppCodes;
    }
  });
});
provide("myUserApps", myUserApps);
</script>
