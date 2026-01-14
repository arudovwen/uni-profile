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
    <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <!-- Side Navigation -->
      <nav class="w-full sm:w-[147px] flex-shrink-0">
        <ul class="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-0 pb-2 sm:pb-0 border-b sm:border-b-0 border-[#E4E7EC]">
          <li v-for="tab in tabs" :key="tab.id">
            <button
              type="button"
              class="w-full flex items-center justify-center sm:justify-start gap-2 py-2 sm:py-2.5 px-2 sm:px-0 sm:pr-4 transition-colors rounded-lg sm:rounded-none"
              :class="activeTab === tab.id ? 'bg-[#EFF8FF] sm:bg-transparent' : ''"
              @click="activeTab = tab.id"
            >
              <span
                :class="`flex flex-row items-center gap-2 sm:pl-[7px] sm:border-l-2 ${
                  activeTab === tab.id
                    ? 'sm:border-[#1570EF]'
                    : 'sm:border-transparent'
                }`"
              >
                <component
                  :is="tab.icon"
                  class="w-5 h-5 sm:w-6 sm:h-6"
                  :color="activeTab === tab.id ? '#1570EF' : '#667085'"
                />
                <span
                  class="text-sm sm:text-base font-medium leading-6"
                  :class="
                    activeTab === tab.id ? 'text-[#1570EF]' : 'text-[#344054]'
                  "
                >
                  {{ tab.label }}
                </span>
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Content Area -->
      <div class="flex-1 min-w-0">
        <!-- Profile Content -->
        <div v-if="activeTab === 'profile'">
          <DashboardSettingsProfile />
        </div>

        <!-- Password Content -->
        <div v-if="activeTab === 'password'">
          <DashboardSettingsPassword />
        </div>
      </div>
    </div>
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
