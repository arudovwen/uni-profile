<template>
  <div
    class="relative formGroup"
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
      } flex items-center gap-x-1 input-label text-sm !text-[#1B2B41B8]`"
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
    <div
      class="relative !flex items-center input-control text-[#667085] z-[99]"
    >
      <span class="text-[#667085]"><AppIcon icon="lucide:phone-call" /></span>

      <!-- Country Code Dropdown -->
      <Combobox v-model="selectedCountry">
        <Float placement="bottom-end" :offset="4" :flip="true">
          <div class="relative">
            <ComboboxInput
              class="pl-3 pr-2 bg-white border-r z-[2] whitespace-nowrap outline-none max-w-16 mr-1"
              :displayValue="(country) => country?.phone || '+234'"
              placeholder="+234"
              @change="query = $event.target.value"
            />
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <AppIcon icon="lucide:chevron-down" aria-hidden="true" />
            </ComboboxButton>
          </div>

          <ComboboxOptions
            class="w-full bg-white border rounded-md shadow-lg max-h-[400px] overflow-y-auto"
          >
            <ComboboxOption
              v-for="country in filteredCountryList"
              :key="country.code"
              :value="country"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 z-[2]"
            >
              {{ country.phone }} - {{ country.label }}
            </ComboboxOption>
          </ComboboxOptions>
        </Float>
      </Combobox>

      <!-- Phone Input -->
      <div class="relative flex items-center flex-1 z-[1]">
        <input
          v-model="phoneData.number"
          type="tel"
          inputmode="numeric"
          class="w-full px-3 outline-none"
          :placeholder="placeholder"
          :readonly="isReadonly"
          :disabled="disabled"
          @input="phoneData.number = phoneData.number.slice(0, max)"
        />

        <!-- Icons -->
        <div class="absolute flex text-xl -translate-y-1/2 top-1/2 right-4">
          <span
            v-if="!phoneError && phoneData.number.length > 0"
            class="text-success-500"
          >
            <AppIcon icon="bi:check-lg" />
          </span>
          <div v-if="icon || iconType" class="text-[#667085]">
            <AppIcon v-if="icon" :icon="icon" />
          </div>
          <span class="text-sm"><slot name="suffix"></slot></span>
        </div>
      </div>
    </div>

    <!-- Error / Success -->
    <span v-if="phoneError" class="block mt-1 text-sm text-danger-500">
      {{ phoneError }}
    </span>
    <span
      v-else-if="!phoneError && phoneData.number.length > 0"
      class="block mt-1 text-sm text-success-500"
    >
      {{ validate }}
    </span>

    <!-- Description -->
    <span
      v-if="description"
      class="block text-[#475467] font-light leading-4 text-xs mt-2"
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
const emit = defineEmits(["update:modelValue", "error"]);

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
const max = computed(() => selectedCountry.value?.max || 10);

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
  if (len === 0 && props.isRequired) return "Phone number is required";
  if (len < min.value) return `Minimum length is ${min.value}`;
  if (len > max.value) return `Maximum length is ${max.value}`;
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
    emit("error", phoneError.value || null);
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

<style scoped>
.input-control {
  color: #101828;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 8px;
  border: 1px solid #d0d5dd;
}
.has-error .input-control { border-color: #e74c3c; }
.is-valid .input-control { border-color: #2ecc71; }
.text-danger-500 { color: #e74c3c; }
.text-success-500 { color: #2ecc71; }

input[type='tel']::-webkit-outer-spin-button,
input[type='tel']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='tel'] { -moz-appearance: textfield; }
</style>
