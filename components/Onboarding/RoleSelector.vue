<template>
  <div class="w-full font-Avenir">
    <div class="max-w-[406px] mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-6">
        <div
          class="inline-flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2"
        >
          <UserTick class="w-4 h-4 text-[#6B7280]" />
          <span class="text-sm font-medium text-[#4B5563]">Step 2 of 3</span>
        </div>
        <h1 class="text-2xl font-semibold text-[#2F2F2F] !mt-8 mb-3">
          Select your function for {{ appName }}
        </h1>
        <p class="text-base text-[#475467] font-[350]">
          Choose your function for this application. This<br />determines your
          permissions and available features.
        </p>
      </div>

      <div
        class="font-Avenir font-extrabold text-sm leading-5 text-center align-middle !mb-5 text-[#475467]"
      >
        Application {{ currentAppNumber }} of {{ totalAppsWithRoles }}
      </div>

      <!-- Role Selection -->
      <div class="mb-8">
        <div class="space-y-3">
          <div
            v-for="role in roles"
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
                modelValue === role.value
                  ? 'border-[#1570EF] bg-[#1570EF]'
                  : 'border-[#D0D5DD] bg-white',
              ]"
            >
              <div
                v-if="modelValue === role.value"
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
        <div v-for="field in selectedRoleConditionalFields" :key="field.name">
          <OnboardingCustomDropdown
            v-if="field.type === 'select' || field.type === 'select-search'"
            :label="field.label"
            containerStyles="w-full"
            buttonClass="!w-full !rounded-[5px]"
            :showSearchFilter="field.type === 'select-search'"
            :modelValue="getDropdownValue(field.name)"
            :options="transformOptions(field.options || [], field.optionValues)"
            :placeholder="field.placeholder || `Select ${field.label}`"
            @update:modelValue="
              (val) =>
                val &&
                updateConditionalField(
                  field.name,
                  field.optionValues ? val.value : val.name
                )
            "
          />
          <label
            v-else-if="field.type === 'checkbox'"
            class="flex items-center gap-3 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-[#D0D5DD] accent-[#1570EF] cursor-pointer"
              :checked="Boolean(conditionalFieldValues[field.name])"
              @change="
                updateConditionalField(
                  field.name,
                  ($event.target as HTMLInputElement).checked
                )
              "
            />
            <span class="text-sm text-[#344054]">{{ field.label }}</span>
          </label>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between gap-4 mt-12">
        <button
          type="button"
          class="px-6 py-3 text-base font-medium text-[#475467] hover:text-[#1570EF] transition-colors"
          @click="$emit('back')"
        >
          Go Back
        </button>

        <button
          type="button"
          class="px-8 py-3 text-base font-semibold text-white bg-[#1570EF] hover:bg-[#0F5BD3] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasRoleSelection || isSubmitting"
          @click="handleNext"
        >
          {{
            isSubmitting
              ? "Processing..."
              : isLastApp
              ? "Continue"
              : "Next Application"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import UserTick from "@/assets/images/icon/UserTick.vue";

interface ConditionalField {
  name: string;
  label: string;
  type: "select" | "select-search" | "checkbox" | "text" | "radio";
  options?: string[];
  optionValues?: Array<{ label: string; value: number | string }>;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
}

interface Role {
  value: string | number;
  label: string;
  description: string;
  conditionalFields?: ConditionalField[];
}

interface Props {
  appName: string;
  appIcon?: string;
  roles: Role[];
  modelValue?: string | number | null;
  isLastApp?: boolean;
  isSubmitting?: boolean;
  currentAppNumber: number;
  totalAppsWithRoles: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  isLastApp: false,
  isSubmitting: false,
  currentAppNumber: 1,
  totalAppsWithRoles: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "update:conditionalFields", value: Record<string, any>): void;
  (e: "next"): void;
  (e: "back"): void;
}>();

const hasRoleSelection = computed(
  () =>
    props.modelValue !== null &&
    props.modelValue !== undefined &&
    props.modelValue !== "",
);

const conditionalFieldValues = ref<Record<string, any>>({});

const selectedRole = computed(() =>
  props.roles.find((role) => role.value === props.modelValue)
);

const selectedRoleConditionalFields = computed(
  () => selectedRole.value?.conditionalFields || []
);

// Transform options to dropdown format { code, name, value }
const transformOptions = (
  options: string[],
  optionValues?: Array<{ label: string; value: number | string }>
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
    (f) => f.name === fieldName
  );
  return field?.optionValues;
};

// Get dropdown value object from stored value
const getDropdownValue = (fieldName: string) => {
  const storedValue = conditionalFieldValues.value[fieldName];
  if (storedValue === undefined || storedValue === null) return null;

  const optionValues = getFieldOptionValues(fieldName);
  if (optionValues) {
    const found = optionValues.find((opt) => opt.value === storedValue);
    if (found) {
      return { code: found.value, name: found.label, value: found.value };
    }
  }
  return { code: storedValue, name: storedValue, value: storedValue };
};

const selectRole = (roleValue: string | number) => {
  emit("update:modelValue", roleValue);
  // Reset conditional fields and seed defaults for the new role
  conditionalFieldValues.value = {};
  const role = props.roles.find((r) => r.value === roleValue);
  role?.conditionalFields?.forEach((f) => {
    if (f.defaultValue !== undefined) {
      conditionalFieldValues.value[f.name] = f.defaultValue;
    }
  });
};

const updateConditionalField = (fieldName: string, value: any) => {
  conditionalFieldValues.value[fieldName] = value;
  emit("update:conditionalFields", conditionalFieldValues.value);
};

const handleNext = () => {
  if (hasRoleSelection.value) {
    emit("next");
  }
};

// Watch for role changes to reset conditional field values and seed defaults
watch(
  () => props.modelValue,
  (roleValue) => {
    conditionalFieldValues.value = {};
    const role = props.roles.find((r) => r.value === roleValue);
    role?.conditionalFields?.forEach((f) => {
      if (f.defaultValue !== undefined) {
        conditionalFieldValues.value[f.name] = f.defaultValue;
      }
    });
  }
);
</script>
