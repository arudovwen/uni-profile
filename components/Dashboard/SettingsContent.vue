<template>
  <div class="max-w-[1120px] mx-auto py-8 font-Avenir">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-lg font-semibold text-[#101828] leading-7">Settings</h1>
      <p class="text-sm text-[#475467] leading-5 mt-1">
        Manage your profile and security settings
      </p>
    </div>

    <!-- Settings Layout -->
    <div class="flex gap-6">
      <!-- Side Navigation -->
      <nav class="w-[147px] flex-shrink-0">
        <ul class="flex flex-col">
          <li v-for="tab in tabs" :key="tab.id">
            <button
              type="button"
              class="w-full flex items-center gap-2 py-2.5 pr-4 transition-colors"
              @click="activeTab = tab.id"
            >
              <span
                :class="`flex flex-row gap-2 pl-[7px] border-l-2 ${
                  activeTab === tab.id
                    ? 'border-[#1570EF]'
                    : 'border-transparent'
                }`"
              >
                <component
                  :is="tab.icon"
                  class="w-6 h-6"
                  :color="activeTab === tab.id ? '#1570EF' : '#667085'"
                />
                <span
                  class="text-base font-medium leading-6"
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
      <div class="flex-1">
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
