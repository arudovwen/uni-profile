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
          :fieldServices="fieldServices"
          :modelValue="currentRoleSelection"
          :isLastApp="currentAppIndex === appsWithRoles.length - 1"
          :isSubmitting="isSubmitting"
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
import { useAppRoles } from "~/composables/useAppRoles";
import { getProducts } from "~/services/productservices";
import { toast } from "vue3-toastify";

interface Role {
  value: string | number;
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
const { state, addRoleSelection, getRoleSelection, submitOnboarding, setSlug } =
  useOnboarding();

const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref("");
const currentAppIndex = ref(0);
const currentRoleSelection = ref<string | number | null>(null);
const currentConditionalFields = ref<Record<string, any>>({});

const fieldServices = {
  buyersQuestion: getProducts,
};

// Use app roles composable for centralized role definitions
const { getAvailableRoles, vehicleOptions, truckSizeOptions } = useAppRoles();

const selectedApps = computed(() => state.value.selectedApps);

// Filter apps that have roles defined (using hasRoles from API or getAvailableRoles)
const appsWithRoles = computed(() => {
  return selectedApps.value.filter(
    (app) => app.hasRoles || getAvailableRoles(app.code).length > 0
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

// Auto-select role if only one option is available
const autoSelectRoleIfSingle = (appCode: string) => {
  const availableRoles = getAvailableRoles(appCode);
  if (availableRoles.length === 1) {
    currentRoleSelection.value = availableRoles[0].value;
  }
};

// Check if an app should be auto-handled (1 role with no conditional fields)
const shouldAutoHandleApp = (appCode: string): boolean => {
  const availableRoles = getAvailableRoles(appCode);
  if (availableRoles.length !== 1) return false;

  const role = availableRoles[0];
  const hasConditionalFields = role.conditionalFields && role.conditionalFields.length > 0;
  return !hasConditionalFields;
};

// Auto-handle app with single role and no conditional fields
const autoHandleAppIfPossible = async (appCode: string): Promise<boolean> => {
  if (!shouldAutoHandleApp(appCode)) {
    return false;
  }

  // Auto-select the single role
  const availableRoles = getAvailableRoles(appCode);
  const role = availableRoles[0].value;

  // Store the role selection
  addRoleSelection({
    appCode: appCode,
    role: role,
  });

  return true;
};

// Submit all apps and navigate to dashboard
const completeOnboarding = async () => {
  if (isSubmitting.value) return;

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
      // Navigate back to app selection to allow deselecting failed apps
    } else {
      toast.error(err.message || "Failed to complete registration");
    }
    router.push(`/${auth}/onboarding/select-apps`);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  // Capture slug from URL if present, otherwise clear it from persisted state
  if (route.query.slug) {
    setSlug(route.query.slug as string);
  } else {
    // Clear slug from persisted state if not in URL
    setSlug(null);
  }

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
    } else {
      // Auto-select role if only one option is available
      autoSelectRoleIfSingle(currentApp.code);
    }
  }
});

const updateRole = (role: string | number) => {
  currentRoleSelection.value = role;
  currentConditionalFields.value = {};
};

const updateConditionalFields = (fields: Record<string, any>) => {
  currentConditionalFields.value = fields;
};

const handleNext = async () => {
  if (
    currentRoleSelection.value === null ||
    currentRoleSelection.value === undefined ||
    currentRoleSelection.value === ""
  ) {
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
    currentRoleSelection.value = null;
    currentConditionalFields.value = {};

    // Load role if it was previously selected or auto-select if only one option
    const nextApp = currentAppData.value;
    if (nextApp) {
      const existingSelection = getRoleSelection(nextApp.code);
      if (existingSelection) {
        currentRoleSelection.value = existingSelection.role;
        currentConditionalFields.value = existingSelection.metadata || {};
      } else {
        // Auto-select role if only one option is available
        autoSelectRoleIfSingle(nextApp.code);
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const handleBack = () => {
  if (currentAppIndex.value > 0) {
    currentAppIndex.value--;
    currentRoleSelection.value = null;
    currentConditionalFields.value = {};

    // Load role if it was previously selected or auto-select if only one option
    const previousApp = currentAppData.value;
    if (previousApp) {
      const existingSelection = getRoleSelection(previousApp.code);
      if (existingSelection) {
        currentRoleSelection.value = existingSelection.role;
        currentConditionalFields.value = existingSelection.metadata || {};
      } else {
        // Auto-select role if only one option is available
        autoSelectRoleIfSingle(previousApp.code);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Go back to select-apps page
    router.push(`/${auth}/onboarding/select-apps`);
  }
};
</script>
