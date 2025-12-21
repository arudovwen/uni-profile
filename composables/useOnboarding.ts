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

const defaultState: OnboardingState = {
  selectedApps: [],
  roleSelections: [],
  currentStep: 1,
};

export const useOnboarding = () => {
  const state = useState<OnboardingState>("onboarding", () => ({ ...defaultState }));

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

  const submitOnboarding = async () => {
    try {
      const data = getOnboardingData();
      // TODO: Call API endpoint when backend is ready
      // const response = await submitUserOnboarding(data);
      console.log("Submitting onboarding data:", data);
      return data;
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      throw error;
    }
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
