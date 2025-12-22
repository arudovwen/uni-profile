<template>
  <NuxtLayout name="auth">
    <div class="w-full font-Avenir">
      <!-- Step Indicator at Top Right -->
      <div class="absolute top-8 right-8">
        <OnboardingStepIndicator :currentStep="2" />
      </div>

      <!-- Role Selector -->
      <div v-if="currentAppData" class="mb-8">
        <OnboardingRoleSelector
          :appName="currentAppData.name"
          :appIcon="currentAppData.iconUrl"
          :roles="getAvailableRoles(currentAppData.code)"
          :modelValue="currentRoleSelection"
          :isLastApp="currentAppIndex === selectedApps.length - 1"
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
  placeholder?: string;
}

const router = useRouter();
const route = useRoute();
const { auth } = route.params;
const { state, addRoleSelection, getRoleSelection } = useOnboarding();

const isLoading = ref(false);
const error = ref("");
const currentAppIndex = ref(0);
const currentRoleSelection = ref("");
const currentConditionalFields = ref<Record<string, any>>({});

// Define roles per app - dynamic and easy to modify
interface AppRoles {
  [appCode: string]: Role[];
}

const appRolesMap: AppRoles = {
  FLU120: [
    {
      value: "clients",
      label: "Clients",
      description: "Need a logistic and fulfillment partner",
      conditionalFields: [],
    },
    {
      value: "truckers",
      label: "Truckers",
      description: "Become a fulfillment service provider",
      conditionalFields: [
        {
          name: "truckType",
          label: "What kind of truck do you use the most?",
          type: "select",
          options: ["Pickup", "Van", "Box Truck", "Semi Truck"],
          placeholder: "Select truck type",
        },
        {
          name: "truckSize",
          label: "What size of truck do you use most?",
          type: "select",
          options: ["Small", "Medium", "Large", "Extra Large"],
          placeholder: "Select truck size",
        },
      ],
    },
  ],
  OXI789: [
    {
      value: "funder",
      label: "Funder",
      description: "Provide early invoice financing",
      conditionalFields: [],
    },
    {
      value: "merchant",
      label: "Merchant",
      description: "Merchant selling goods and services",
      conditionalFields: [],
    },
    {
      value: "vendor",
      label: "Vendor",
      description: "Vendor providing services",
      conditionalFields: [],
    },
  ],
  ORB456: [
    {
      value: "user",
      label: "User",
      description: "Access Orbital Pro features",
      conditionalFields: [],
    },
  ],
  POL321: [
    {
      value: "user",
      label: "User",
      description: "Access Polymer Pro features",
      conditionalFields: [],
    },
  ],
};

const getAvailableRoles = (appCode: string): Role[] => {
  return appRolesMap[appCode] || [];
};

const selectedApps = computed(() => state.value.selectedApps);

const currentAppData = computed(() => {
  if (
    selectedApps.value.length === 0 ||
    currentAppIndex.value >= selectedApps.value.length
  ) {
    return null;
  }
  return selectedApps.value[currentAppIndex.value];
});

onMounted(() => {
  if (selectedApps.value.length === 0) {
    // No apps selected, redirect back to select-apps
    router.push(`/${auth}/onboarding/select-apps`);
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

const handleNext = () => {
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
  if (currentAppIndex.value === selectedApps.value.length - 1) {
    // Navigate to dashboard
    router.push("/dashboard");
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
