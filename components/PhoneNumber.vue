<template>
  <div
    class="relative formGroup font-Avenir"
    :class="{
      'has-error': phoneError,
      flex: horizontal,
      'is-valid': !phoneError && phoneData.number.length > 0,
    }"
  >
    <!-- Label -->
    <label
      v-if="label"
      :class="`${classLabel} ${
        horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
      } flex items-center gap-x-1 text-sm font-medium text-[#2F2F2F] leading-5 mb-1`"
      :for="name"
      :data-testid="label"
    >
      {{ label }} <RedDot v-if="isRequired" />
      <span v-if="isOptional" class="text-[#98A2B3]">(Optional)</span>
      <span
        v-if="info"
        :title="infoTitle"
        class="flex items-center justify-center w-4 h-4 cursor-pointer"
      >
        <AppIcon icon="quill:info" iconClass="text-gray-600" />
      </span>
    </label>

    <!-- Input Group -->
    <div class="flex items-center gap-3">
      <!-- Country Code Dropdown -->
      <Combobox v-model="selectedCountry">
        <Float placement="bottom-start" :offset="4" :flip="true">
          <div class="relative">
            <div
              class="flex items-center h-[41px] w-[104px] px-[17px] py-[11px] bg-white border border-[#E2E2E2] rounded-[5px]"
              :class="{ 'border-[#F04438]': phoneError }"
            >
              <ComboboxInput
                class="w-full bg-transparent outline-none text-sm font-normal text-[#475467]"
                :displayValue="(country) => country?.phone || '+234'"
                placeholder="+234"
                @change="query = $event.target.value"
              />
              <ComboboxButton class="flex items-center">
                <svg
                  class="w-[13px] h-2"
                  viewBox="0 0 13 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6.5 7L12 1.5"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </ComboboxButton>
            </div>

            <ComboboxOptions
              class="absolute top-full left-0 mt-1 w-[250px] bg-white border border-[#E2E2E2] rounded-[5px] shadow-lg max-h-[200px] overflow-y-auto z-50"
            >
              <ComboboxOption
                v-for="country in filteredCountryList"
                :key="country.code"
                :value="country"
                class="px-4 py-2 cursor-pointer hover:bg-[#F9FAFB] text-sm text-[#475467]"
              >
                {{ country.phone }} - {{ country.label }}
              </ComboboxOption>
            </ComboboxOptions>
          </div>
        </Float>
      </Combobox>

      <!-- Phone Input -->
      <div class="relative flex-1">
        <input
          v-model="phoneData.number"
          type="tel"
          inputmode="numeric"
          class="w-full h-[41px] px-[17px] py-[11px] bg-white border border-[#E2E2E2] rounded-[5px] outline-none text-sm font-normal text-[#475467] placeholder:text-[#667085]"
          :class="{ 'border-[#F04438]': phoneError }"
          :placeholder="placeholder || '0816*******'"
          :readonly="isReadonly"
          :disabled="disabled"
          @input="phoneData.number = phoneData.number.slice(0, max)"
        />

        <!-- Success Icon -->
        <div
          v-if="!phoneError && phoneData.number.length > 0"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[#2ecc71]"
        >
          <AppIcon icon="bi:check-lg" />
        </div>
      </div>
    </div>

    <!-- Error / Success -->
    <span v-if="phoneError" class="block mt-1 text-xs text-[#F04438]">
      {{ phoneError }}
    </span>
    <span
      v-else-if="!phoneError && phoneData.number.length > 0 && validate"
      class="block mt-1 text-xs text-[#2ecc71]"
    >
      {{ validate }}
    </span>

    <!-- Description -->
    <span
      v-if="description"
      class="block text-[#475467] font-normal leading-4 text-xs mt-1"
    >
      {{ description }}
    </span>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  defineProps,
  defineEmits,
  watch,
  onMounted,
  computed,
} from "vue";
import { Float } from "@headlessui-float/vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/vue";
import AppIcon from "@/components/AppIcon.vue";
import RedDot from "@/components/RedDot.vue";
import countries from "~/utils/countrycodes.js";

// Props
const props = defineProps({
  iconType: String,
  placeholder: String,
  label: String,
  classLabel: String,
  classInput: String,
  type: { type: String, default: "text" },
  isRequired: Boolean,
  isOptional: Boolean,
  name: String,
  modelValue: { type: String, default: "" },
  error: String,
  hasIcon: Boolean,
  isReadonly: Boolean,
  disabled: Boolean,
  horizontal: Boolean,
  validate: String,
  msgTooltip: Boolean,
  description: String,
  icon: String,
  iconPosition: String,
  isMask: Boolean,
  infoTitle: String,
  info: Boolean,
  suffix: String,
});

// Emits
const emit = defineEmits(["update:modelValue", "setError"]);

// Reactive state
const phoneData = reactive({ number: "" });
const selectedCountry = ref(null);
const query = ref("");

// Country list
const countryList = computed(() =>
  countries.map((c) => ({ ...c, phone: `+${c.phone}` }))
);

// Filtered list for Combobox
const filteredCountryList = computed(() => {
  if (!query.value) return countryList.value;
  return countryList.value.filter((c) =>
    `${c.label} ${c.phone}`.toLowerCase().includes(query.value.toLowerCase())
  );
});

// Min / Max lengths
const min = computed(() => selectedCountry.value?.min || 10);
const max = computed(() => selectedCountry.value?.max || 11);

// Format phone output
const formatPhoneOutput = () => {
  const number = phoneData.number;
  const code = selectedCountry.value?.phone || "+234";
  return number ? `${code}-${number}` : "";
};

// Parse phone value
const parsePhoneValue = (value) => {
  if (!value) return { code: "+234", number: "" };
  const parts = value.split(/[-\s]/);
  const code = parts[0];
  const number = parts.slice(1).join(" ");
  return { code, number };
};

// Computed error
const phoneError = computed(() => {
  const len = phoneData.number.length;
  if (props.error) return props.error;
  if (len === 0 && props.isRequired) return "Phone number is required";
  if (len > 0 && len < min.value) return `Minimum length is ${min.value}`;
  if (len > 0 && len > max.value) return `Maximum length is ${max.value}`;
  return "";
});

// Initialize value
onMounted(() => {
  if (props.modelValue) {
    const { code, number } = parsePhoneValue(props.modelValue);
    selectedCountry.value =
      countryList.value.find((c) => c.phone === code) || null;
    phoneData.number = number;
  }
});

// Sync modelValue and emit error
watch(
  phoneData,
  () => {
    emit("update:modelValue", formatPhoneOutput());
    emit("setError", phoneError.value || null);
  },
  { deep: true }
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== formatPhoneOutput()) {
      const { code, number } = parsePhoneValue(newValue);
      selectedCountry.value =
        countryList.value.find((c) => c.phone === code) || null;
      phoneData.number = number;
    }
  }
);
</script>
