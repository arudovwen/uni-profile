import { useEncryption } from "~/composables/useEncryption";
import {
  signUpWithMatta,
  signUpWithMattaFlux,
  signUpWithMattaOrbital,
  signUpWithMattaOxidePro,
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
  }>;
  roleSelections: RoleSelection[];
  currentStep: number;
}

// Role to userType mapping for Flux
const fluxRoleToUserType: Record<string, number> = {
  clients: 0,
  truckers: 1,
};

// Role to accountType mapping for Oxide Pro (string values)
const oxideRoleToAccountType: Record<string, string> = {
  Supplier: "Supplier",
  Buyer: "Buyer",
};

const defaultState: OnboardingState = {
  selectedApps: [],
  roleSelections: [],
  currentStep: 1,
};

export const useOnboarding = () => {
  const state = useState<OnboardingState>("onboarding", () => ({
    ...defaultState,
  }));
  const { encrypt } = useEncryption();
  const authStore = useAuthStore();

  const setSelectedApps = (apps: OnboardingState["selectedApps"]) => {
    state.value.selectedApps = apps;
  };

  const addRoleSelection = (selection: RoleSelection) => {
    // Remove any existing role selection for this app
    state.value.roleSelections = state.value.roleSelections.filter(
      (r) => r.appCode !== selection.appCode
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
  };

  const getOnboardingData = () => {
    return {
      appCodes: state.value.selectedApps.map((app) => app.code),
      roleSelections: state.value.roleSelections,
    };
  };

  // Build payload for each app based on its requirements
  const buildAppPayload = (appCode: string, encryptedEmail: string) => {
    const roleSelection = getRoleSelection(appCode);
    const basePayload = {
      email: encryptedEmail,
      appCode,
      ssoUserCategory: 1,
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

      case "OXI975": {
        // Oxide Pro has roles: Supplier, Buyer (string-based accountType)
        const accountType = roleSelection
          ? oxideRoleToAccountType[roleSelection.role] ?? "Buyer"
          : "Buyer";
        const username =
          authStore.loggedUser?.fullName ||
          authStore.userInfo?.fullName ||
          "";
        return {
          email: encryptedEmail,
          username,
          accountType,
          country: "Nigeria",
          appCode,
          accessToken: authStore.jwToken || "",
          ssoUserCategory: "Admin",
          tenant: 1,
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
      case "OXI975":
        return signUpWithMattaOxidePro;
      default:
        return signUpWithMatta;
    }
  };

  const submitOnboarding = async () => {
    const userEmail = authStore.loggedUser?.email || authStore.userInfo?.email;
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
        const payload = buildAppPayload(app.code, encryptedEmail);
        const signupFn = getSignupFunction(app.code);
        console.log(`Submitting signup for ${app.code}:`, payload);
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

    return results;
  };

  return {
    state,
    setSelectedApps,
    addRoleSelection,
    getRoleSelection,
    setCurrentStep,
    clearOnboarding,
    getOnboardingData,
    submitOnboarding,
  };
};
