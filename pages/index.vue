<template>
  <NuxtLayout name="dashboard">
    <div
      class="font-Avenir max-w-[1120px] mx-auto mt-8 sm:mt-10 lg:mt-[44px] pb-8"
    >
      <!-- Users Tab -->
      <DashboardUsersContent v-if="currentTab === 'users'" />

      <!-- Logs Tab -->
      <DashboardLogsContent v-else-if="currentTab === 'logs'" />

      <!-- Apps Tab (default) -->
      <template v-else-if="currentTab === 'apps'">
        <!-- Welcome Header -->
        <div class="mb-5 sm:mb-[26px]">
          <h1
            class="text-2xl sm:text-3xl font-[800] text-[#2F2F2F] mb-1 sm:mb-2"
          >
            Welcome back, {{ userName }}!
          </h1>
          <p class="text-sm sm:text-base text-[#475467]">
            Access your applications from your dashboard
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1570EF]"
          ></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]"
        >
          <p class="text-[#EF4444] mb-4">{{ error }}</p>
          <button
            @click="fetchUserApps"
            class="px-4 py-2 bg-[#1570EF] text-white rounded-lg hover:bg-[#0F5BD3] transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="userApps.length === 0"
          class="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]"
        >
          <p class="text-[#475467] mb-4">No applications registered yet.</p>
        </div>

        <!-- Apps Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <div
            v-for="app in userApps"
            :key="app.code"
            class="bg-white rounded-lg border border-[#E5E7EB] p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToApp(app)"
          >
            <!-- App Header with Icon and Status -->
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <!-- App Icon -->
              <div>
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
                  'px-2 sm:px-3 py-1 rounded-full text-xs font-medium border',
                  app.isActive
                    ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                    : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
                ]"
              >
                {{ app.isActive ? "Active" : "Inactive" }}
              </span>
            </div>

            <!-- App Name -->
            <h3
              class="text-base sm:text-lg font-semibold text-[#2F2F2F] mb-1.5 sm:mb-2"
            >
              {{ app.name }}
            </h3>

            <!-- App Description -->
            <p
              class="text-sm text-[#475467] mb-3 sm:mb-4 leading-relaxed line-clamp-2"
            >
              {{ app.description }}
            </p>

            <!-- Role Badge -->
            <span
              v-if="app.role"
              class="inline-block px-2 sm:px-3 py-1 rounded-full bg-[#F3F4F6] text-[#344054] text-xs font-medium border border-[#E5E7EB]"
            >
              {{ app.role }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getSubApps } from "~/services/userservices";
import { useEncryption } from "~/composables/useEncryption";
import FluxLogo from "@/assets/images/flux-logo.png";
import OrbitalLogo from "@/assets/images/orbital-logo.png";
import OxideProLogo from "@/assets/apps/oxide-pro-logo.png";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const authStore = useAuthStore();
const { encrypt } = useEncryption();

// Current tab based on query param
const currentTab = computed(() => {
  return (route.query.tab as string) || "apps";
});

// App icons mapping
const appIcons: Record<string, string> = {
  FLU722: FluxLogo,
  ORB789: OrbitalLogo,
  OXP975: OxideProLogo,
  POL766:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E",
};

// App base URLs mapping
const appBaseUrls: Record<string, string> = {
  ORB789: "https://dev.orbital.matta.trade",
  FLU722: "https://dev.deltalog.co",
  OXP975: "https://dev.oxidepro.oxidefinance.com",
};

// State
const isLoading = ref(true);
const error = ref("");
const userApps = ref<UserApp[]>([]);

// Get user name from auth store or default
const userName = computed(() => {
  return authStore.loggedUser?.firstName || "User";
});

interface UserApp {
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  url?: string;
  isActive: boolean;
  role?: string;
}

// Build authenticated URL with encrypted tokens
const buildAuthUrl = (baseUrl: string) => {
  const token = authStore.jwToken;
  const refreshToken = authStore.refreshToken;

  if (!token || !refreshToken) {
    return baseUrl;
  }

  const encryptedToken = encrypt(token);
  const encryptedRefreshToken = encrypt(refreshToken);

  return `${baseUrl}/auth/validate?token=${encodeURIComponent(encryptedToken)}&code=${encodeURIComponent(encryptedRefreshToken)}`;
};

// Fetch user's registered apps from API
const fetchUserApps = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const response = await getSubApps({});

    if (response.status === 200) {
      const apps = response.data?.data || response.data || [];
      userApps.value = apps.map((app: any) => {
        const appCode = app.appCode || app.code;
        const baseUrl = appBaseUrls[appCode] || app.url;
        return {
          code: appCode,
          name: app.appName || app.name,
          description:
            app.description ||
            "Access your application dashboard and manage your account.",
          iconUrl: appIcons[appCode] || app.iconUrl || app.logo,
          url: baseUrl ? buildAuthUrl(baseUrl) : null,
          isActive: app.isActive ?? true,
          role: app.userType || app.accountType || app.role,
        };
      });
    }
  } catch (err: any) {
    console.error("Error fetching user apps:", err);
    error.value = err?.response?.data?.message || "Failed to load applications";
  } finally {
    isLoading.value = false;
  }
};

// Navigate to app URL
const navigateToApp = (app: UserApp) => {
  if (app.url) {
    window.open(app.url, "_blank");
  }
};

onMounted(() => {
  fetchUserApps();
});
</script>
