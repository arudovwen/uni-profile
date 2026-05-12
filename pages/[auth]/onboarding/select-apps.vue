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
            @click="fetchApps"
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
            :isRegistered="registeredAppCodes.includes(app.code)"
            @update:modelValue="toggleApp(app)"
          />
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mx-auto flex flex-col items-end max-w-[615px]">
        <button
          type="button"
          class="w-full md:max-w-[218px] py-3 px-4 text-base font-semibold text-white bg-[#1570EF] hover:bg-[#0F5BD3] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canContinue || isSubmitting || isLoading"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useOnboarding } from "~/composables/useOnboarding";
import { useAppRoles } from "~/composables/useAppRoles";
import { getSubApps } from "~/services/userservices";
import { getUserApps } from "~/services/authservices";
import { toast } from "vue3-toastify";
import SelectAppIcon from "@/assets/images/icon/SelectAppIcon.vue";
import FluxLogo from "@/assets/images/flux-logo.png";
import OrbitalLogo from "@/assets/images/orbital-logo.png";
import OxideProLogo from "@/assets/apps/oxide-pro-logo.png";
import { APP_CODES } from "~/utils/app-config";

interface App {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  logoUrl?: string;
  hasRoles?: boolean;
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
  [APP_CODES.OXIDE_PRO.code]: OxideProLogo,
  [APP_CODES.ORBITAL.code ]: OrbitalLogo,
  [APP_CODES.OXIDE.code]:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E",
  [APP_CODES.FLUX.code]: FluxLogo,
  [APP_CODES.MATTA.code]:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle fill='%23000000' cx='12' cy='12' r='10'/%3E%3C/svg%3E",
  [APP_CODES.MATTAPEDIA.code]:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E",
};

// Apps that have roles to select (fallback - ideally from API)
const appsWithRolesFallback = [APP_CODES.FLUX.code, APP_CODES.OXIDE_PRO.code];

const isSubmitting = ref(false);
const isLoading = ref(true);
const loadError = ref("");
const apps = ref<App[]>([]);
const registeredAppCodes = ref<string[]>([]);

// Fetch apps from subapplications API
const fetchApps = async () => {
  isLoading.value = true;
  loadError.value = "";

  try {
    // Fetch registered apps first
    try {
      const userAppsResponse = await getUserApps("1", {
        PageNumber: 1,
        PageSize: 50,
      });

      if (userAppsResponse.status === 200 && userAppsResponse.data?.data) {
        const appsData =
          userAppsResponse.data.data.data || userAppsResponse.data.data;
        if (Array.isArray(appsData)) {
          registeredAppCodes.value = appsData.map((app: any) => app.code);
        }
      }
    } catch (err: any) {
      console.warn("Failed to fetch registered apps, continuing without status:", err);
      // Continue without registered apps data
    }

    const response = await getSubApps({});

    if (response.status === 200) {
      const subApps = response.data?.data || response.data || [];

      // Filter out disabled apps and map to our format
      apps.value = subApps
        .filter((app: any) => !app.isDisabled && app.isActive !== false)
        .map((app: any, index: number) => {
          const appCode = app.appCode || app.code;
          return {
            id: app.id?.toString() || (index + 1).toString(),
            code: appCode,
            name: app.appName || app.name,
            description: app.description || "Access your application dashboard and manage your account.",
            iconUrl: app.iconUrl || app.logo || app.logoUrl || appIcons[appCode],
            hasRoles: app.hasRoles ?? appsWithRolesFallback.includes(appCode),
          };
        });
    } else {
      throw new Error("Failed to fetch applications");
    }
  } catch (err: any) {
    console.error("Error fetching apps:", err);
    loadError.value = err?.response?.data?.message || "Failed to load applications";
  } finally {
    isLoading.value = false;
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
  await fetchApps();

  // Restore previously selected apps from persisted state
  // Match by app code since IDs might change across sessions
  // Exclude registered apps from restoration
  if (state.value.selectedApps.length > 0) {
    const previouslySelectedCodes = state.value.selectedApps.map((app) => app.code);
    selectedAppsIds.value = apps.value
      .filter((app) =>
        previouslySelectedCodes.includes(app.code) &&
        !registeredAppCodes.value.includes(app.code)
      )
      .map((app) => app.id);
  }
});

const selectedAppsIds = ref<string[]>([]);

const selectedAppsData = computed(() => {
  return apps.value.filter((app) => selectedAppsIds.value.includes(app.id));
});

const hasRegisteredApps = computed(() => registeredAppCodes.value.length > 0);

const canContinue = computed(() => {
  return selectedAppsData.value.length > 0 || hasRegisteredApps.value;
});

const isAppSelected = (appId: string) => {
  return selectedAppsIds.value.includes(appId);
};

const toggleApp = (app: App) => {
  // Prevent toggling if app is already registered
  if (registeredAppCodes.value.includes(app.code)) {
    return;
  }

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
  if (!canContinue.value) {
    toast.error("Please select at least one application");
    return;
  }

  if (selectedAppsData.value.length === 0 && hasRegisteredApps.value) {
    router.push("/");
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
      // Check if this is a partial failure (some apps failed)
      if (err.message?.startsWith("Failed to sign up for:")) {
        toast.error(err.message);
        // Stay on current page, user can deselect failed apps and retry
      } else {
        toast.error(err.message || "Failed to complete registration");
      }
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
