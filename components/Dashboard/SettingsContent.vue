<template>
  <div class="max-w-[1120px] mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-Avenir overflow-hidden">
    <!-- Page Header -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-base sm:text-lg font-semibold text-[#101828] leading-7">Settings</h1>
      <p class="text-xs sm:text-sm text-[#475467] leading-5 mt-1">
        Manage your profile and security settings
      </p>
    </div>

    <!-- Settings Layout -->
    <SidebarLayout v-model="activeTab" :tabs="tabs">
      <template #tab-profile>
        <DashboardSettingsProfile />
      </template>
      <template #tab-password>
        <DashboardSettingsPassword />
      </template>
    </SidebarLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from "vue";
import Profile2UserIcon from "@/assets/images/icon/Profile2UserIcon.vue";
import ShieldSecurityIcon from "@/assets/images/icon/ShieldSecurityIcon.vue";

type TabId = "profile" | "password";

interface Tab {
  id: TabId;
  label: string;
  icon: any;
}

const activeTab = ref<TabId>("profile");

const tabs: Tab[] = [
  { id: "profile", label: "Profile", icon: markRaw(Profile2UserIcon) },
  { id: "password", label: "Password", icon: markRaw(ShieldSecurityIcon) },
];
</script>
