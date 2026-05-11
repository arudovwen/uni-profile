import { useEncryption } from "~/composables/useEncryption";
import {
  signUpWithMatta,
  signUpWithMattaFlux,
  signUpWithMattaOrbital,
  signUpWithMattaOxidePro,
  signUpWithMattaPolymer,
} from "~/services/authservices";

export interface RoleSelection {
  appCode: string;
  role: string;
  metadata?: Record<string, any>;
}

export interface OnboardingState {
  selectedApps: Array<{
    id: string;
    code: string;
    name: string;
    iconUrl?: string;
    hasRoles?: boolean;
  }>;
  roleSelections: RoleSelection[];
  currentStep: number;
  slug: string | null;
  successfulRegistrations: string[]; // Track app codes that were successfully registered
}

// Role to userType mapping for Flux
const fluxRoleToUserType: Record<string, number> = {
  clients: 0,
  truckers: 1,
};

// Role to accountType mapping for Oxide Pro (string values)
const oxideRoleToAccountType: Record<string, string> = {
  Funder: "Funder",
  Supplier: "Supplier",
  Buyer: "Buyer",
};

const defaultState: OnboardingState = {
  selectedApps: [],
  roleSelections: [],
  currentStep: 1,
  slug: null,
  successfulRegistrations: [],
};

const STORAGE_KEY = "matta_onboarding_state";

// Helper to safely access localStorage (SSR-safe)
const getStoredState = (): OnboardingState | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading onboarding state from localStorage:", e);
  }
  return null;
};

const saveState = (state: OnboardingState): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving onboarding state to localStorage:", e);
  }
};

const clearStoredState = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing onboarding state from localStorage:", e);
  }
};

export const useOnboarding = () => {
  // Initialize state with persisted data if available
  const state = useState<OnboardingState>("onboarding", () => {
    const storedState = getStoredState();
    return storedState || { ...defaultState };
  });

  const { encrypt, decrypt } = useEncryption();
  const authStore = useAuthStore();

  // Watch for state changes and persist to localStorage
  watch(
    state,
    (newState) => {
      saveState(newState);
    },
    { deep: true },
  );

  // Restore state from localStorage on client-side mount
  const restoreState = () => {
    const storedState = getStoredState();
    if (storedState) {
      state.value = storedState;
    }
  };

  const setSelectedApps = (apps: OnboardingState["selectedApps"]) => {
    state.value.selectedApps = apps;
  };

  const setSlug = (slug: string | null) => {
    state.value.slug = slug;
  };

  const addRoleSelection = (selection: RoleSelection) => {
    // Remove any existing role selection for this app
    state.value.roleSelections = state.value.roleSelections.filter(
      (r) => r.appCode !== selection.appCode,
    );
    // Add the new role selection
    state.value.roleSelections.push(selection);
  };

  const getRoleSelection = (appCode: string) => {
    return state.value.roleSelections.find((r) => r.appCode === appCode);
  };

  const setCurrentStep = (step: number) => {
    state.value.currentStep = step;
  };

  const clearOnboarding = () => {
    state.value = { ...defaultState };
    clearStoredState();
  };

  const getOnboardingData = () => {
    return {
      appCodes: state.value.selectedApps.map((app) => app.code),
      roleSelections: state.value.roleSelections,
    };
  };

  // Build payload for each app based on its requirements
  const buildAppPayload = (
    appCode: string,
    encryptedEmail: string,
    roleSelection?: RoleSelection | null,
    slug?: string | null,
    ssoCategory: number | string = 1,
    userCategory: number | string = 1,
  ) => {
    const basePayload = {
      email: encryptedEmail,
      appCode,
      ssoUserCategory: ssoCategory,
      userCategory,
    };
    switch (appCode) {
      case "FLU722": {
        // Flux requires userType, preferredSize, preferredTruckType for clients
        const userType = roleSelection
          ? fluxRoleToUserType[roleSelection.role] ?? 0
          : 0;
        const payload: Record<string, any> = {
          ...basePayload,
          userType,
          allowNewsLetter: true,
        };

        // Add conditional fields for clients role
        if (roleSelection?.role === "clients" && roleSelection.metadata) {
          if (roleSelection.metadata.preferredTruckType !== undefined) {
            payload.preferredTruckType =
              roleSelection.metadata.preferredTruckType;
          }
          if (roleSelection.metadata.preferredSize !== undefined) {
            payload.preferredSize = roleSelection.metadata.preferredSize;
          }
        }
        return payload;
      }

      case "OXI972": {
        // Oxide Pro has roles: Supplier, Buyer (string-based accountType)
        const accountType = roleSelection
          ? oxideRoleToAccountType[roleSelection.role] ?? "Buyer"
          : "Buyer";
        const username =
          (authStore.loggedUser as any)?.fullName ||
          (authStore.userInfo as any)?.fullName ||
          "";
        return {
          // email: decrypt(encryptedEmail),
          email: basePayload.email,
          username: username.replace(/\s+/g, ""),
          accountType,
          country: "Nigeria",
          appCode,
          accessToken: null,
          ssoUserCategory: "Admin",
          tenant: 1,
          slug: accountType !== "Funder" ? slug : null,
        };
      }

      case "ORB789":
      case "POL766":
      default:
        // Orbital and Polymer don't have roles, just basic payload
        return basePayload;
    }
  };

  // Get the appropriate signup function for each app
  const getSignupFunction = (appCode: string) => {
    switch (appCode) {
      case "FLU722":
        return signUpWithMattaFlux;
      case "ORB789":
        return signUpWithMattaOrbital;
      case "OXI972":
        return signUpWithMattaOxidePro;
      case "POL628":
        return signUpWithMattaPolymer;
      default:
        return signUpWithMatta;
    }
  };

  const submitOnboarding = async () => {
    const userEmail =
      (authStore.loggedUser as any)?.email ||
      (authStore.userInfo as any)?.email;
    if (!userEmail) {
      throw new Error("User email not found");
    }

    const encryptedEmail = userEmail;
    if (!encryptedEmail) {
      throw new Error("Failed to encrypt email");
    }

    const results: Array<{ appCode: string; success: boolean; error?: any }> =
      [];

    // Call the appropriate signup function for each selected app
    for (const app of state.value.selectedApps) {
      try {
        const roleSelection = getRoleSelection(app.code);
        const payload = buildAppPayload(
          app.code,
          encryptedEmail,
          roleSelection,
          state.value.slug,
        );
        const signupFn = getSignupFunction(app.code);
        await signupFn(payload);
        results.push({ appCode: app.code, success: true });
      } catch (error) {
        console.error(`Error signing up for ${app.code}:`, error);
        results.push({ appCode: app.code, success: false, error });
      }
    }

    // Check if all signups were successful
    const allSuccessful = results.every((r) => r.success);
    if (!allSuccessful) {
      const failedApps = results
        .filter((r) => !r.success)
        .map((r) => r.appCode);
      throw new Error(`Failed to sign up for: ${failedApps.join(", ")}`);
    }

    // Clear persisted state after successful submission
    clearStoredState();

    return results;
  };

  return {
    state,
    setSelectedApps,
    setSlug,
    addRoleSelection,
    getRoleSelection,
    setCurrentStep,
    clearOnboarding,
    getOnboardingData,
    buildAppPayload,
    submitOnboarding,
    restoreState,
    getSignupFunction,
  };
};
