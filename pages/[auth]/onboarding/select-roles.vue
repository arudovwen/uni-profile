<template>
  <NuxtLayout name="auth">
    <template #header-right>
      <OnboardingStepIndicator :currentStep="2" />
    </template>

    <div class="w-full font-Avenir">
      <!-- Role Selector -->
      <div v-if="currentAppData" class="mb-8">
        <OnboardingRoleSelector
          :appName="currentAppData.name"
          :appIcon="currentAppData.iconUrl"
          :roles="getAvailableRoles(currentAppData.code)"
          :modelValue="currentRoleSelection"
          :isLastApp="currentAppIndex === appsWithRoles.length - 1"
          :currentAppNumber="currentAppNumber"
          :totalAppsWithRoles="totalAppsWithRoles"
          @update:modelValue="updateRole"
          @update:conditionalFields="updateConditionalFields"
          @next="handleNext"
          @back="handleBack"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-sm text-[#475467]">No applications selected</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOnboarding } from "~/composables/useOnboarding";
import { toast } from "vue3-toastify";

interface Role {
  value: string;
  label: string;
  description: string;
  conditionalFields?: ConditionalField[];
}

interface ConditionalField {
  name: string;
  label: string;
  type: "select" | "text" | "radio";
  options?: string[];
  optionValues?: Array<{ label: string; value: number }>;
  placeholder?: string;
}

const router = useRouter();
const route = useRoute();
const { auth } = route.params;
const { state, addRoleSelection, getRoleSelection, submitOnboarding } =
  useOnboarding();

const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref("");
const currentAppIndex = ref(0);
const currentRoleSelection = ref("");
const currentConditionalFields = ref<Record<string, any>>({});

// Define roles per app - dynamic and easy to modify
interface AppRoles {
  [appCode: string]: Role[];
}

// Vehicle type options for Flux (values match API)
const vehicleOptions = [
  { label: "Delivery Truck", value: 0 },
  { label: "Sided Body", value: 1 },
  { label: "Flat Bed Truck", value: 2 },
  { label: "Tanker Truck", value: 3 },
  { label: "Dump Truck", value: 4 },
  { label: "Others", value: 5 },
];

// Truck size options for Flux (values in tons)
const truckSizeOptions = [
  { label: "3 Tons", value: 3 },
  { label: "5 Tons", value: 5 },
  { label: "7 Tons", value: 7 },
  { label: "10 Tons", value: 10 },
  { label: "15 Tons", value: 15 },
  { label: "20 Tons", value: 20 },
];

const appRolesMap: AppRoles = {
  FLU722: [
    {
      value: "clients",
      label: "Clients",
      description: "Need a logistic and fulfillment partner",
      conditionalFields: [
        {
          name: "preferredTruckType",
          label: "What kind of truck do you use the most?",
          type: "select",
          options: vehicleOptions.map((opt) => opt.label),
          optionValues: vehicleOptions,
          placeholder: "Select truck type",
        },
        {
          name: "preferredSize",
          label: "What size of truck do you use most?",
          type: "select",
          options: truckSizeOptions.map((opt) => opt.label),
          optionValues: truckSizeOptions,
          placeholder: "Select truck size",
        },
      ],
    },
    {
      value: "truckers",
      label: "Truckers",
      description: "Become a fulfillment service provider",
      conditionalFields: [],
    },
  ],
  OXI975: [
    {
      value: "Supplier",
      label: "Supplier",
      description: "Fund early invoice payments",
      conditionalFields: [],
    },
    {
      value: "Buyer",
      label: "Buyer",
      description: "Request invoice financing",
      conditionalFields: [],
    },
  ],
  ORB789: [],
  POL766: [],
};

const getAvailableRoles = (appCode: string): Role[] => {
  return appRolesMap[appCode] || [];
};

const selectedApps = computed(() => state.value.selectedApps);

// Filter apps that have roles defined
const appsWithRoles = computed(() => {
  return selectedApps.value.filter(
    (app) => appRolesMap[app.code] && appRolesMap[app.code].length > 0
  );
});

const totalAppsWithRoles = computed(() => appsWithRoles.value.length);

// Current app number (1-based)
const currentAppNumber = computed(() => currentAppIndex.value + 1);

// Get current app from appsWithRoles (only apps that have roles)
const currentAppData = computed(() => {
  if (
    appsWithRoles.value.length === 0 ||
    currentAppIndex.value >= appsWithRoles.value.length
  ) {
    return null;
  }
  return appsWithRoles.value[currentAppIndex.value];
});

// Submit all apps and navigate to dashboard
const completeOnboarding = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    await submitOnboarding();
    toast.success("Successfully registered for selected applications");
    router.push("/dashboard");
  } catch (err: any) {
    console.error("Onboarding submission error:", err);
    toast.error(err.message || "Failed to complete registration");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (selectedApps.value.length === 0) {
    // No apps selected, redirect back to select-apps
    router.push(`/${auth}/onboarding/select-apps`);
    return;
  }

  if (appsWithRoles.value.length === 0) {
    // No apps with roles, submit directly and go to dashboard
    await completeOnboarding();
    return;
  }

  // Load the current app's role selection if it exists
  const currentApp = currentAppData.value;
  if (currentApp) {
    const existingSelection = getRoleSelection(currentApp.code);
    if (existingSelection) {
      currentRoleSelection.value = existingSelection.role;
      currentConditionalFields.value = existingSelection.metadata || {};
    }
  }
});

const updateRole = (role: string) => {
  currentRoleSelection.value = role;
  currentConditionalFields.value = {};
};

const updateConditionalFields = (fields: Record<string, any>) => {
  currentConditionalFields.value = fields;
};

const handleNext = async () => {
  if (!currentRoleSelection.value) {
    toast.error("Please select a role");
    return;
  }

  const currentApp = currentAppData.value;
  if (currentApp) {
    // Store the role selection
    addRoleSelection({
      appCode: currentApp.code,
      role: currentRoleSelection.value,
      metadata:
        Object.keys(currentConditionalFields.value).length > 0
          ? currentConditionalFields.value
          : undefined,
    });
  }

  // Check if this is the last app
  if (currentAppIndex.value === appsWithRoles.value.length - 1) {
    // Submit all apps and navigate to dashboard
    await completeOnboarding();
  } else {
    // Move to next app
    currentAppIndex.value++;
    currentRoleSelection.value = "";
    currentConditionalFields.value = {};

    // Load role if it was previously selected
    const nextApp = currentAppData.value;
    if (nextApp) {
      const existingSelection = getRoleSelection(nextApp.code);
      if (existingSelection) {
        currentRoleSelection.value = existingSelection.role;
        currentConditionalFields.value = existingSelection.metadata || {};
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const handleBack = () => {
  if (currentAppIndex.value > 0) {
    currentAppIndex.value--;
    currentRoleSelection.value = "";
    currentConditionalFields.value = {};

    // Load role if it was previously selected
    const previousApp = currentAppData.value;
    if (previousApp) {
      const existingSelection = getRoleSelection(previousApp.code);
      if (existingSelection) {
        currentRoleSelection.value = existingSelection.role;
        currentConditionalFields.value = existingSelection.metadata || {};
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Go back to select-apps page
    router.push(`/${auth}/onboarding/select-apps`);
  }
};
</script>
