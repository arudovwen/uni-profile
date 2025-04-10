<template>
  <div
    class="formGroup relative"
    :class="{
      'has-error': error,
      'flex': horizontal,
      'is-valid': validate
    }"
  >
    <!-- Label Section -->
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
        data-toggle="tooltip"
        data-placement="top"
        data-animation="false"
        :title="infoTitle"
        class="cursor-pointer h-4 w-4 flex items-center justify-center"
      >
        <AppIcon icon="quill:info" iconClass="text-gray-600" />
      </span>
    </label>

    <!-- Input Section -->
    <div class="relative !flex items-center input-control text-[#667085] z-[99]">
      <span class="text-[#667085]"><AppIcon icon="lucide:phone-call" /></span>
      
      <!-- Country Code Dropdown -->
      <Listbox v-model="phoneData.countryCode" class="z-[10]">
        <Float placement="bottom-end" :offset="4" :flip="true">
          <ListboxButton class="pl-3 pr-4 bg-white border-r z-[2] whitespace-nowrap">
            {{ phoneData.countryCode || "+234" }}
          </ListboxButton>
          <ListboxOptions
            class="w-full bg-white border rounded-md shadow-lg max-h-[400px] overflow-y-auto"
          >
            <ListboxOption
              v-for="(country, code) in countryCodes"
              :key="code"
              :value="code"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 z-[2]"
            >
              {{ code }} - {{ country }}
            </ListboxOption>
          </ListboxOptions>
        </Float>
      </Listbox>

      <!-- Phone Number Input -->
      <div class="relative flex items-center flex-1 z-[1]">
        <input
          v-model="phoneData.number"
          type="tel"
          inputmode="numeric"
          class="w-full px-3 outline-none"
          :placeholder="placeholder"
          :readonly="isReadonly"
          :disabled="disabled"
        />

        <!-- Validation/Success Icon -->
        <div class="flex absolute top-1/2 -translate-y-1/2 right-4 text-xl">
          <span v-if="validate" class="text-success-500">
            <AppIcon icon="bi:check-lg" />
          </span>
          <div v-if="icon || iconType" class="text-[#667085]">
            <AppIcon v-if="icon" :icon="icon" />
          </div>
          <span class="text-sm"><slot name="suffix"></slot></span>
        </div>

        <!-- Error Icon -->
        <span class="flex absolute right-0">
          <span v-if="error" class="text-danger-500 mr-2">
            <AppIcon icon="heroicons-outline:information-circle" />
          </span>
        </span>
      </div>
    </div>

    <!-- Validation Messages -->
    <span v-if="validate" class="text-success-500 text-sm block mt-1">
      {{ validate }}
    </span>
    <span v-else-if="error" class="text-danger-500 text-sm block mt-1">
      {{ error }}
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
import { reactive, defineProps, defineEmits, watch, onMounted } from "vue";
import { Float } from "@headlessui-float/vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { countryCodes } from "@/utils/constants";
import AppIcon from "@/components/AppIcon.vue";
import RedDot from "@/components/RedDot.vue";

const emit = defineEmits(["update:modelValue"]);

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

// Use reactive object for better syncing of related properties
const phoneData = reactive({
  countryCode: "+234",
  number: "",
});

// Parse the incoming value more robustly
const parsePhoneValue = (value) => {
  if (!value) return { countryCode: "+234", number: "" };
  
  // Handle different separator styles
  const separators = ['-', ' '];
  let countryCode = "+234";
  let number = "";
  
  for (const separator of separators) {
    if (value.includes(separator)) {
      const [code, ...rest] = value.split(separator);
      countryCode = code;
      number = rest.join(separator);
      return { countryCode, number };
    }
  }
  
  // If no separator found but starts with +, try to extract country code
  if (value.startsWith('+')) {
    // Look for first non-digit after +
    const match = value.match(/^\+(\d+)(.*)$/);
    if (match) {
      countryCode = `+${match[1]}`;
      number = match[2];
      return { countryCode, number };
    }
  }
  
  // Default fallback - assume the whole value is the number
  return { countryCode: "+234", number: value };
};

// Format the output in a consistent way
const formatPhoneOutput = () => {
  const { countryCode, number } = phoneData;
  if (!number) return "";
  return `${countryCode}-${number}`;
};

// Initialize from props
onMounted(() => {
  if (props.modelValue) {
    const { countryCode, number } = parsePhoneValue(props.modelValue);
    phoneData.countryCode = countryCode;
    phoneData.number = number;
  }
});

// Watch for changes and emit updated value
watch(
  phoneData,
  () => {
    emit("update:modelValue", formatPhoneOutput());
  },
  { deep: true }
);

// Also watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== formatPhoneOutput()) {
      const { countryCode, number } = parsePhoneValue(newValue);
      phoneData.countryCode = countryCode;
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

.has-error .input-control {
  border-color: #e74c3c;
}

.is-valid .input-control {
  border-color: #2ecc71;
}

.text-danger-500 {
  color: #e74c3c;
}

.text-success-500 {
  color: #2ecc71;
}

/* Remove spinners for number input */
input[type="tel"]::-webkit-outer-spin-button,
input[type="tel"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="tel"] {
  -moz-appearance: textfield;
}
</style>