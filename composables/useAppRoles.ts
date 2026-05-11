import { computed } from "vue";
import { useRoute } from "vue-router";
import { useOnboarding } from "./useOnboarding";
import { APP_CODES } from "~/utils/app-config";

export interface Role {
  value: string;
  label: string;
  description: string;
  conditionalFields: any[];
}

// Vehicle type options for Flux
const vehicleOptions = [
  { label: "Delivery Truck", value: 0 },
  { label: "Sided Body", value: 1 },
  { label: "Flat Bed Truck", value: 2 },
  { label: "Tanker Truck", value: 3 },
  { label: "Dump Truck", value: 4 },
  { label: "Others", value: 5 },
];

// Truck size options for Flux
const truckSizeOptions = [
  { label: "3 Tons", value: 3 },
  { label: "5 Tons", value: 5 },
  { label: "7 Tons", value: 7 },
  { label: "10 Tons", value: 10 },
  { label: "15 Tons", value: 15 },
  { label: "20 Tons", value: 20 },
];

// Map of app codes to their available roles
export const appRolesMap: Record<string, Role[]> = {
  [APP_CODES.FLUX]: [
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
  [APP_CODES.OXIDE_PRO]: [
    {
      value: "Funder",
      label: "Funding Partner",
      description:
        "Full platform access. Onboard and manage your own customers",
      conditionalFields: [],
    },
    {
      value: "Supplier",
      label: "Supplier",
      description: "Review vendor invoices and early invoice repayments",
      conditionalFields: [],
    },
    {
      value: "Buyer",
      label: "Buyer",
      description: "Send invoices and request early invoice financing",
      conditionalFields: [],
    },
  ],
  [APP_CODES.ORBITAL]: [],
  [APP_CODES.POLYMER]: [],
  [APP_CODES.OXIDE]: [],
  [APP_CODES.MATTA]: [],
  [APP_CODES.MATTAPEDIA]: [],
};

export const useAppRoles = () => {
  const route = useRoute();
  const { state } = useOnboarding();

  // Get slug from URL query or state
  const slug = computed(() => (route.query.slug as string) || state.value.slug);

  /**
   * Get available roles for an app, filtered by context (e.g., slug)
   */
  const getAvailableRoles = (
    appCode: string,
    accountSlug: string | null = slug.value,
  ): Role[] => {
    const roles = appRolesMap[appCode] || [];

    // For Oxide Pro, filter roles based on slug presence
    if (appCode === APP_CODES.OXIDE_PRO) {
      if (accountSlug) {
        // With slug: only show Buyer or Supplier
        return roles.filter(
          (role) => role.value === "Buyer" || role.value === "Supplier",
        );
      } else {
        // Without slug: only show Funder
        return roles.filter((role) => role.value === "Funder");
      }
    }

    return roles;
  };

  /**
   * Check if an app requires user input for role selection
   * Returns true if the app has 2 or more role options
   */
  const requiresUserRoleSelection = (appCode: string): boolean => {
    const availableRoles = getAvailableRoles(appCode);
    // Require user input if there are 2 or more role options to choose from
    return availableRoles.length >= 2;
  };

  /**
   * Get the default role for an app (first available role)
   */
  const getDefaultRole = (appCode: string): string | null => {
    const availableRoles = getAvailableRoles(appCode);
    return availableRoles.length > 0 ? availableRoles[0].value : null;
  };

  return {
    appRolesMap,
    vehicleOptions,
    truckSizeOptions,
    slug,
    getAvailableRoles,
    requiresUserRoleSelection,
    getDefaultRole,
  };
};
