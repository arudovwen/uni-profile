<template>
  <div class="w-full">
    <div class="mb-6">
      <GoBack text="Back to User Management" url="/user-management" />
    </div>
    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent :title="name" />
    </div>
    <div>
      <AppTab
        :tabs="tabs"
        @setActive="(val) => (active = val)"
        :active="active"
      />
    </div>
    <div class="flex w-full">
      <PagesUsersUserDetailInformation v-if="active === 'profile'" />
      <div v-if="active === 'apps'" class="w-full">
        <PagesSuperadminUserDetailApps
          v-if="authStore?.userInfo?.userCategory === 3"
        />
        <PagesUsersUserDetailApps v-else />
      </div>
    </div>
  </div>
</template>
<script setup>
const authStore = useAuthStore();
import { getUserDetail } from "~/services/settingservices";

const route = useRoute();

const name = route.query.name;
const id = route.params.id;
const userData = ref(null)
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
function getUserData() {
  getUserDetail(id).then((res) => {
    if (res.status === 200) {
      myUserApps.value = res.data.data.appCodes;
      userData.value = res.data.data
    }
  });
}
const myUserApps = ref([]);
onMounted(() => {
  getUserData();
});
provide("myUserApps", myUserApps);
provide("getUserData", getUserData);
provide('userData', userData)
</script>
