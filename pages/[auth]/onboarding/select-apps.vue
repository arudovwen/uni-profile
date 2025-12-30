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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OnboardingAppCard
            v-for="app in apps"
            :key="app.id"
            :app="app"
            :modelValue="isAppSelected(app.id)"
            @update:modelValue="toggleApp(app)"
          />
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mx-auto flex flex-col items-end max-w-[615px]">
        <button
          type="button"
          class="w-full md:max-w-[218px] py-3 px-4 text-base font-semibold text-white bg-[#1570EF] hover:bg-[#0F5BD3] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="selectedAppsData.length === 0"
          @click="continueToRoles"
        >
          Continue to Roles
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useOnboarding } from "~/composables/useOnboarding";
import { toast } from "vue3-toastify";
import SelectAppIcon from "@/assets/images/icon/SelectAppIcon.vue";
import FluxLogo from "@/assets/images/flux-logo.png";
import OrbitalLogo from "@/assets/images/orbital-logo.png";

interface App {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  logoUrl?: string;
}

const router = useRouter();
const route = useRoute();
const { auth } = route.params;
const { setSelectedApps } = useOnboarding();

// Mock apps data - matches the design screenshot
const apps = ref<App[]>([
  {
    id: "1",
    code: "FLU120",
    name: "Flux Pro",
    description:
      "Real-time data flow management and monitoring system for enterprise workflows.",
    iconUrl: FluxLogo,
  },
  {
    id: "2",
    code: "ORB456",
    name: "Orbital Pro",
    description:
      "Real-time data flow management and monitoring system for enterprise workflows.",
    iconUrl: OrbitalLogo,
  },
  {
    id: "3",
    code: "OXI789",
    name: "Oxide Pro",
    description:
      "Payment requests and early invoice financing for merchants and vendors",
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='3' y='3' width='18' height='18' rx='4'/%3E%3C/svg%3E",
  },
  {
    id: "4",
    code: "POL321",
    name: "Polymer Pro",
    description:
      "Real-time data flow management and monitoring system for enterprise workflows.",
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E",
  },
]);

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

const continueToRoles = () => {
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
    }))
  );

  // Navigate to select-roles page
  router.push(`/${auth}/onboarding/select-roles`);
};
</script>
