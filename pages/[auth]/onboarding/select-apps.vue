<template>
  <NuxtLayout name="auth">
    <template #header-right>
      <OnboardingStepIndicator :currentStep="1" />
    </template>

    <div class="w-full font-Avenir">
      <!-- Header -->
      <div class="text-center mb-12 max-w-[615px] mx-auto">
        <div
          class="inline-flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2"
        >
          <SelectAppIcon class="w-4 h-4 text-[#6B7280]" />
          <span class="text-sm font-medium text-[#4B5563]">Step 1 of 3</span>
        </div>
        <h1 class="text-2xl font-semibold text-[#2F2F2F] !mt-8 mb-3">
          Choose your applications
        </h1>
        <p class="text-base text-[#475467] font-normal">
          Select the Matta Pro applications you want to access.<br />You can
          change this later from your dashboard.
        </p>
      </div>

      <!-- Apps Grid -->
      <div class="mb-8 max-w-[615px] mx-auto">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1570EF]"
          ></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="loadError"
          class="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]"
        >
          <p class="text-[#EF4444] mb-4">{{ loadError }}</p>
          <button
            @click="retryFetchApps"
            class="px-4 py-2 bg-[#1570EF] text-white rounded-lg hover:bg-[#0F5BD3] transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="apps.length === 0"
          class="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]"
        >
          <p class="text-[#475467]">No applications available at the moment.</p>
        </div>

        <!-- Apps Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OnboardingAppCard
            v-for="app in apps"
            :key="app.id"
            :app="app"
            :modelValue="isAppSelected(app.id)"
            :isRegistered="app.isRegistered"
            @update:modelValue="toggleApp(app)"
          />
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mx-auto flex flex-col items-end max-w-[615px]">
        <button
          type="button"
          class="w-full md:max-w-[218px] py-3 px-4 text-base font-semibold text-white bg-[#1570EF] hover:bg-[#0F5BD3] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="selectedAppsData.length === 0 || isSubmitting || isLoading"
          @click="continueToRoles"
        >
          {{
            isSubmitting
              ? "Processing..."
              : hasAppsRequiringUserInput
                ? "Continue to Roles"
                : "Continue to Dashboard"
          }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useOnboarding } from "~/composables/useOnboarding";
import { useAppRoles } from "~/composables/useAppRoles";
import { getSubApps } from "~/services/userservices";
import { getUserApps } from "~/services/authservices";
import { toast } from "vue3-toastify";
import SelectAppIcon from "@/assets/images/icon/SelectAppIcon.vue";
import FluxLogo from "@/assets/images/flux-logo.png";
import OrbitalLogo from "@/assets/images/orbital-logo.png";
import OxideProLogo from "@/assets/apps/oxide-pro-logo.png";

interface App {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  logoUrl?: string;
  hasRoles?: boolean;
  isRegistered?: boolean;
}

const router = useRouter();
const route = useRoute();
const { auth } = route.params;
const { setSelectedApps, setSlug, submitOnboarding, addRoleSelection, state } = useOnboarding();
const { requiresUserRoleSelection, getDefaultRole } = useAppRoles();

// Get slug from URL query or state
const slug = computed(() => (route.query.slug as string) || state.value.slug);

// Fallback icons for apps (used when API doesn't provide icons)
const appIcons: Record<string, string> = {
  FLU722: FluxLogo,
  ORB789: OrbitalLogo,
  OXI972: OxideProLogo,
  POL766:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E",
};

// Apps that have roles to select (fallback - ideally from API)
const appsWithRolesFallback = ["FLU722", "OXI972"];

const isSubmitting = ref(false);
const isLoading = ref(true);
const loadError = ref("");
const apps = ref<App[]>([]);
const registeredAppCodes = ref<string[]>([]);

// Cache for API requests to prevent redundant calls
// Tracks both the promise and success state for each request
const apiCache = {
  registeredApps: {
    promise: null as Promise<any> | null,
    succeeded: false,
  },
  subApps: {
    promise: null as Promise<any> | null,
    succeeded: false,
  },
};

// Fetch user's registered apps
const fetchRegisteredApps = async () => {
  // Return cached promise if request already succeeded
  if (apiCache.registeredApps.succeeded && apiCache.registeredApps.promise) {
    console.log("Using cached registered apps (already succeeded)");
    return apiCache.registeredApps.promise;
  }

  // Return existing promise if one is in flight
  if (apiCache.registeredApps.promise) {
    console.log("Registered apps request already in flight, waiting...");
    return apiCache.registeredApps.promise;
  }

  // Create and cache the promise
  apiCache.registeredApps.promise = (async () => {
    try {
      console.log("Fetching registered apps from API...");
      const response = await getUserApps("1", {
        PageNumber: 1,
        PageSize: 50,
      });

      if (response.status === 200 && response.data?.data) {
        const appsData = response.data.data.data || response.data.data;
        console.log("Registered apps response:", appsData);

        if (Array.isArray(appsData)) {
          registeredAppCodes.value = appsData.map((app: any) => app.code || app.appCode);
          console.log("Registered app codes:", registeredAppCodes.value);

          // Mark as succeeded
          apiCache.registeredApps.succeeded = true;
        }
      }
    } catch (err) {
      console.error("Error fetching registered apps:", err);
      // Mark as failed by clearing promise but not setting succeeded
      apiCache.registeredApps.promise = null;
      // Don't show error to user - this is not critical
    }
  })();

  return apiCache.registeredApps.promise;
};

// Fetch apps from subapplications API
const fetchApps = async () => {
  // Return cached promise if request already succeeded
  if (apiCache.subApps.succeeded && apiCache.subApps.promise) {
    console.log("Using cached subapps (already succeeded)");
    return apiCache.subApps.promise;
  }

  // Return existing promise if one is in flight
  if (apiCache.subApps.promise) {
    console.log("SubApps request already in flight, waiting...");
    return apiCache.subApps.promise;
  }

  isLoading.value = true;
  loadError.value = "";

  // Create and cache the promise
  apiCache.subApps.promise = (async () => {
    try {
      console.log("Fetching subapps from API...");
      const response = await getSubApps({});

      if (response.status === 200) {
        const subApps = response.data?.data || response.data || [];

        // Filter out disabled apps and map to our format
        apps.value = subApps
          .filter((app: any) => !app.isDisabled && app.isActive !== false)
          .map((app: any, index: number) => {
            const appCode = app.appCode || app.code;
            const isRegistered = registeredAppCodes.value.includes(appCode);
            console.log(`App ${appCode} registered status:`, isRegistered);
            return {
              id: app.id?.toString() || (index + 1).toString(),
              code: appCode,
              name: app.appName || app.name,
              description: app.description || "Access your application dashboard and manage your account.",
              iconUrl: app.iconUrl || app.logo || app.logoUrl || appIcons[appCode],
              hasRoles: app.hasRoles ?? appsWithRolesFallback.includes(appCode),
              isRegistered,
            };
          });

        // Mark as succeeded
        apiCache.subApps.succeeded = true;
      } else {
        throw new Error("Failed to fetch applications");
      }
    } catch (err: any) {
      console.error("Error fetching apps:", err);
      loadError.value = err?.response?.data?.message || "Failed to load applications";
      // Mark as failed by clearing promise but not setting succeeded
      apiCache.subApps.promise = null;
    } finally {
      isLoading.value = false;
    }
  })();

  return apiCache.subApps.promise;
};

// Retry fetching apps - only retries failed requests
const retryFetchApps = async () => {
  console.log("Retrying failed requests...");
  console.log("Registered apps succeeded:", apiCache.registeredApps.succeeded);
  console.log("SubApps succeeded:", apiCache.subApps.succeeded);

  // Only clear and retry failed requests
  if (!apiCache.registeredApps.succeeded) {
    console.log("Retrying registered apps...");
    apiCache.registeredApps.promise = null;
    registeredAppCodes.value = [];
    await fetchRegisteredApps();
  } else {
    console.log("Skipping registered apps (already succeeded)");
  }

  if (!apiCache.subApps.succeeded) {
    console.log("Retrying subapps...");
    apiCache.subApps.promise = null;
    await fetchApps();
  } else {
    console.log("Skipping subapps (already succeeded)");
  }
};

// Store slug from URL on mount and fetch apps
onMounted(async () => {
  if (route.query.slug) {
    setSlug(route.query.slug as string);
  } else {
    // Clear slug from persisted state if not in URL
    setSlug(null);
  }

  // Fetch registered apps first, then fetch all apps
  await fetchRegisteredApps();
  await fetchApps();

  // Restore previously selected apps from persisted state
  // Match by app code since IDs might change across sessions
  if (state.value.selectedApps.length > 0) {
    const previouslySelectedCodes = state.value.selectedApps.map((app) => app.code);
    selectedAppsIds.value = apps.value
      .filter((app) => previouslySelectedCodes.includes(app.code))
      .map((app) => app.id);
  }
});

const selectedAppsIds = ref<string[]>([]);

const selectedAppsData = computed(() => {
  return apps.value.filter((app) => selectedAppsIds.value.includes(app.id));
});

const isAppSelected = (appId: string) => {
  return selectedAppsIds.value.includes(appId);
};

const toggleApp = (app: App) => {
  const index = selectedAppsIds.value.indexOf(app.id);
  if (index > -1) {
    selectedAppsIds.value.splice(index, 1);
  } else {
    selectedAppsIds.value.push(app.id);
  }
};

// Check if any selected apps require role selection (have more than auto-selectable roles)
const hasAppsRequiringUserInput = computed(() => {
  return selectedAppsData.value.some((app) => requiresUserRoleSelection(app.code));
});

const continueToRoles = async () => {
  if (selectedAppsData.value.length === 0) {
    toast.error("Please select at least one application");
    return;
  }

  // Store selected apps in composable
  setSelectedApps(
    selectedAppsData.value.map((app) => ({
      id: app.id,
      code: app.code,
      name: app.name,
      iconUrl: app.iconUrl,
      hasRoles: app.hasRoles,
    }))
  );

  // Check if any app requires user input for role selection
  if (!hasAppsRequiringUserInput.value) {
    // Auto-select default roles for all apps and submit directly
    selectedAppsData.value.forEach((app) => {
      const defaultRole = getDefaultRole(app.code);
      if (defaultRole) {
        addRoleSelection({
          appCode: app.code,
          role: defaultRole,
        });
      }
    });

    isSubmitting.value = true;
    try {
      await submitOnboarding();
      toast.success("Successfully registered for selected applications");
      router.push("/");
    } catch (err: any) {
      console.error("Onboarding submission error:", err);
      toast.error(err.message || "Failed to complete registration");
    } finally {
      isSubmitting.value = false;
    }
    return;
  }

  // Navigate to select-roles page with slug
  const query = slug.value ? { slug: slug.value } : {};
  router.push({ path: `/${auth}/onboarding/select-roles`, query });
};
</script>
