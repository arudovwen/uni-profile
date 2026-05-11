<template>
  <IndexModal :isOpen="isOpen" @togglePopup="closeModal">
    <template #content>
      <template v-if="!isReady">
        <div
          class="p-6 max-w-md min-w-[400px] font-Avenir flex flex-col items-center gap-4 !py-10"
        >
          <div
            class="loader border-t-4 border-blue-500 border-solid rounded-full h-8 w-8 animate-spin"
            data-testid="table-loader"
          ></div>

          Loading...
        </div>
      </template>
      <template v-else>
        <div
          v-if="!isOnboarding"
          class="p-6 max-w-md min-w-[400px] font-Avenir"
        >
          <!-- Header Section -->
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-[#2F2F2F] mb-3">
              Select your function for {{ app?.name }}
            </h2>
            <p class="text-base text-[#475467] font-[350]">
              Choose your function for this application. This determines your
              permissions and available features.
            </p>
          </div>

          <!-- Role Selection -->
          <div class="mb-8">
            <div class="space-y-3">
              <div
                v-for="role in availableRoles"
                :key="role.value"
                :class="[
                  'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 border-[#E5E7EB] bg-[#F9FAFB]',
                ]"
                @click="selectRole(role.value)"
              >
                <!-- Radio Button -->
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 transition-colors',
                    selectedRoleValue === role.value
                      ? 'border-[#1570EF] bg-[#1570EF]'
                      : 'border-[#D0D5DD] bg-white',
                  ]"
                >
                  <div
                    v-if="selectedRoleValue === role.value"
                    class="w-2 h-2 bg-white rounded-full"
                  ></div>
                </div>

                <!-- Role Info -->
                <div class="flex-1">
                  <h4 class="text-base font-semibold text-[#2F2F2F]">
                    {{ role.label }}
                  </h4>
                  <p class="text-sm text-[#475467] mt-1">
                    {{ role.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Conditional Fields -->
          <div
            v-if="selectedRoleConditionalFields.length > 0"
            class="mb-8 space-y-4"
          >
            <div
              v-for="field in selectedRoleConditionalFields"
              :key="field.name"
            >
              <OnboardingCustomDropdown
                v-if="field.type === 'select'"
                :label="field.label"
                containerStyles="w-full"
                buttonClass="!w-full !rounded-[5px]"
                :showSearchFilter="false"
                :modelValue="getDropdownValue(field.name)"
                :options="
                  transformOptions(field.options || [], field.optionValues)
                "
                :placeholder="field.placeholder || `Select ${field.label}`"
                @update:modelValue="
                  (val) => {
                    if (val) {
                      updateConditionalField(
                        field.name,
                        field.optionValues ? val.value : val.name,
                      );
                    }
                  }
                "
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between gap-4 mt-8">
            <button
              type="button"
              class="px-6 py-3 text-base font-medium text-[#475467] hover:text-[#1570EF] transition-colors"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              type="button"
              class="px-8 py-3 text-base font-semibold text-white bg-[#1570EF] hover:bg-[#0F5BD3] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!selectedRoleValue || isOnboarding"
              @click="handleConfirm"
            >
              {{ isOnboarding ? "Processing..." : "Confirm" }}
            </button>
          </div>
        </div>
        <div
          v-else
          class="p-6 max-w-md min-w-[400px] font-Avenir flex flex-col items-center gap-4 !py-10"
        >
          <div
            class="loader border-t-4 border-blue-500 border-solid rounded-full h-8 w-8 animate-spin"
            data-testid="table-loader"
          ></div>

          Signing you up for {{ app?.name }}...
        </div>
      </template>
    </template>
  </IndexModal>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAppRoles } from "@/composables/useAppRoles";
import { useOnboarding } from "@/composables/useOnboarding";
import AppLoader from "./AppLoader.vue";
import auth from "~/middleware/auth";

interface ConditionalField {
  name: string;
  label: string;
  type: "select" | "text" | "radio";
  options?: string[];
  optionValues?: Array<{ label: string; value: number }>;
  placeholder?: string;
}

interface Role {
  value: string;
  label: string;
  description: string;
  conditionalFields?: ConditionalField[];
}

interface Props {
  isOpen: boolean;
  appCode: string;
  isOnboarding?: boolean;
  app: any;
}

interface Emits {
  (e: "close"): void;
  (e: "confirm", role: string, conditionalFields: Record<string, any>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const authStore = useAuthStore();
const toast = useToast();
const isReady = ref(false);

const categorySlug: Record<any, any> = {
  1: null,
  2:
    authStore?.loggedUser && "companyName" in authStore.loggedUser
      ? authStore.loggedUser.companyName?.toLowerCase()?.replace(" ", "-")
      : null,
  3: null,
};

const { getAvailableRoles } = useAppRoles();
const availableRoles = computed(() =>
  getAvailableRoles(
    props.appCode,
    categorySlug[authStore.loggedUser?.userCategory],
  ),
);

// Role selection state
const selectedRoleValue = ref("");
const conditionalFieldValues = ref<Record<string, any>>({});

// Get selected role from available roles
const selectedRole = computed(() =>
  availableRoles.value.find((role) => role.value === selectedRoleValue.value),
);

// Get conditional fields for the selected role
const selectedRoleConditionalFields = computed(
  () => selectedRole.value?.conditionalFields || [],
);

// Auto-signup when modal opens if 0 or 1 roles available
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      // Reset state
      selectedRoleValue.value = "";
      conditionalFieldValues.value = {};
      // Check if we should auto-signup
      if (availableRoles.value.length <= 1) {
        // props.isOnboarding = true;

        // Auto-select role if available
        if (availableRoles.value.length === 1) {
          selectedRoleValue.value = availableRoles.value[0].value;
        }

        // Trigger signup with default values
        await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay for UX
        emit("confirm", selectedRoleValue.value, conditionalFieldValues.value);
        // props.isOnboarding = false;
      } else {
        isReady.value = true;
        selectedRoleValue.value = "";
        conditionalFieldValues.value = {};
      }
    } else {
      selectedRoleValue.value = "";
      conditionalFieldValues.value = {};
    }
  },
  { immediate: true },
);

// Transform options to dropdown format { code, name, value }
const transformOptions = (
  options: string[],
  optionValues?: Array<{ label: string; value: number }>,
) => {
  if (optionValues && optionValues.length > 0) {
    return optionValues.map((opt) => ({
      code: String(opt.value),
      name: opt.label,
      value: opt.value,
    }));
  }
  return options.map((option) => ({
    code: option,
    name: option,
    value: option,
  }));
};

// Get the optionValues for a given field
const getFieldOptionValues = (fieldName: string) => {
  const field = selectedRoleConditionalFields.value.find(
    (f) => f.name === fieldName,
  );
  return field?.optionValues;
};

// Get dropdown value object from stored value
const getDropdownValue = (fieldName: string) => {
  const storedValue = conditionalFieldValues.value[fieldName];
  if (storedValue === undefined || storedValue === null) return null;

  const optionValues = getFieldOptionValues(fieldName);
  if (optionValues) {
    const found = optionValues.find(
      (opt: { label: string; value: number }) => opt.value === storedValue,
    );
    if (found) {
      return { code: found.value, name: found.label, value: found.value };
    }
  }
  return { code: storedValue, name: storedValue, value: storedValue };
};

const selectRole = (roleValue: string) => {
  selectedRoleValue.value = roleValue;
  // Reset conditional fields when role changes
  conditionalFieldValues.value = {};
};

const updateConditionalField = (fieldName: string, value: any) => {
  conditionalFieldValues.value[fieldName] = value;
};

const handleConfirm = () => {
  if (selectedRoleValue.value) {
    emit("confirm", selectedRoleValue.value, conditionalFieldValues.value);
  }
};

const closeModal = () => {
  // Reset state when closing
  selectedRoleValue.value = "";
  conditionalFieldValues.value = {};
  emit("close");
};

// Watch for modal open/close to reset state
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      selectedRoleValue.value = "";
      conditionalFieldValues.value = {};
    }
  },
);

// Watch for app code changes
watch(
  () => props.appCode,
  () => {
    selectedRoleValue.value = "";
    conditionalFieldValues.value = {};
  },
);
</script>
