<template>
  <NuxtLayout name="dashboard">
    <div class="font-Avenir">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-[#2F2F2F] mb-2">
          Welcome back, {{ userName }}!
        </h1>
        <p class="text-base text-[#475467]">
          Access your applications from your dashboard
        </p>
      </div>

      <!-- Apps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="app in userApps"
          :key="app.code"
          class="bg-white rounded-lg border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <!-- App Header with Icon and Status -->
          <div class="flex items-start justify-between mb-4">
            <!-- App Icon -->
            <div
              class="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center"
            >
              <img
                v-if="app.iconUrl"
                :src="app.iconUrl"
                :alt="app.name"
                class="w-8 h-8"
              />
              <svg
                v-else
                class="w-6 h-6 text-[#1570EF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                />
              </svg>
            </div>

            <!-- Status Badge -->
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium border',
                app.status === 'Active'
                  ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                  : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
              ]"
            >
              {{ app.status }}
            </span>
          </div>

          <!-- App Name -->
          <h3 class="text-lg font-semibold text-[#2F2F2F] mb-2">
            {{ app.name }}
          </h3>

          <!-- App Description -->
          <p class="text-sm text-[#475467] mb-4 leading-relaxed">
            {{ app.description }}
          </p>

          <!-- Role Badge -->
          <span
            class="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[#344054] text-xs font-medium border border-[#E5E7EB]"
          >
            {{ app.role }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useOnboarding } from "~/composables/useOnboarding";

// definePageMeta({
//   layout: "dashboard",
// });

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { state } = useOnboarding();

// Get user name from auth store or default
const userName = computed(() => {
  return authStore.loggedUser?.firstName || "User";
});

interface UserApp {
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  status: "Active" | "Inactive";
  role: string;
}

// Map role values to display names
const roleDisplayNames: Record<string, string> = {
  clients: "Client",
  truckers: "Driver",
  funder: "Funder",
  merchant: "Merchant",
  vendor: "Vendor",
  user: "User",
  admin: "Administrator",
};

// Transform selected apps and roles into display data
const userApps = computed<UserApp[]>(() => {
  return state.value.selectedApps.map((app) => {
    const roleSelection = state.value.roleSelections.find(
      (r) => r.appCode === app.code
    );
    const roleValue = roleSelection?.role || "user";

    return {
      code: app.code,
      name: app.name,
      description:
        "Real-time data flow management and monitoring system for enterprise workflows.",
      iconUrl: app.iconUrl,
      status: "Active" as const,
      role: roleDisplayNames[roleValue] || roleValue,
    };
  });
});
</script>
