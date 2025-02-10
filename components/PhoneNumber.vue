<template>
  <div
    class="formGroup relative"
    :class="`${error ? 'has-error' : ''} ${horizontal ? 'flex' : ''} ${
      validate ? 'is-valid' : ''
    }`"
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
      {{ label }} <RedDot v-if="isCumpulsory" />
      <span v-show="isOptional" class="text-[#98A2B3]">(Optional)</span>
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
    <div
      class="relative !flex items-center input-control text-[#667085] z-[99]"
      :class="disabled ? '!bg-[#f8fafc]' : ''"
    >
      <span class="text-[#667085]"><AppIcon icon="lucide:phone-call" /></span>
      <Listbox v-model="selectedCountryCode" class="z-[10]">
        <Float placement="bottom-end" :offset="4">
          <ListboxButton
            :disabled="disabled"
            class="pl-3 pr-4 bg-white border-r z-[2] disabled:bg-transparent"
          >
            {{ selectedCountryCode || "Select Country Code" }}
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
              {{ country }}
            </ListboxOption>
          </ListboxOptions>
        </Float>
      </Listbox>

      <!-- Phone Number Input -->
      <div class="relative flex items-center flex-1 z-[1]">
        <input
          v-model="phoneNumber"
          type="number"
          class="w-full px-3 outline-none disabled:bg-transparent py-[1px]"
          :placeholder="placeholder"
          :error="error"
          :readonly="isReadonly"
          :disabled="disabled"
          :validate="validate"
        />

        <!-- Validation/Success Icon -->
        <div class="flex absolute top-1/2 -translate-y-1/2 right-4 text-xl">
          <span v-if="validate" class="text-success-500">
            <AppIcon icon="bi:check-lg" />
          </span>
          <div v-show="icon || iconType" class="text-[#667085]">
            <AppIcon v-show="icon" :icon="icon" />
          </div>
          <span class="text-sm"><slot name="suffix"></slot></span>
        </div>

        <!-- Error Message or Tooltip -->
        <span class="flex absolute right-0">
          <span v-if="error" class="text-danger-500 mr-2">
            <AppIcon icon="heroicons-outline:information-circle" />
          </span>
        </span>
      </div>

      <!-- Error/Success Tooltip -->
      <span v-if="validate" class="text-success-500 text-sm block">
        {{ validate }}
      </span>

      <!-- Description -->
      <span
        v-if="description"
        class="block placeholder-[#f9bb64] text-[#475467] font-light leading-4 text-xs mt-2"
      >
        {{ description }}
      </span>
    </div>
    <span v-if="error" class="text-danger-500 text-sm block">
      {{ error }}
    </span>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { Float } from "@headlessui-float/vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue"; // Headless UI for the country code dropdown
import { countryCodes } from "~/utils/constants";

const emit = defineEmits(["update:modelValue"]);
// Define props
const props = defineProps({
  iconType: String,
  placeholder: {
    type: String,
    default: "081xxxxxxxx",
  },
  label: String,
  classLabel: String,
  classInput: String,
  type: { type: String, default: "text" },
  isCumpulsory: Boolean,
  isOptional: Boolean,
  name: String,
  modelValue: { type: [String, Number], default: "" },
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
  options: {
    type: Object,
    default: () => ({ creditCard: true, delimiter: "-" }),
  },
  infoTitle: String,
  info: Boolean,
  suffix: String,
});

// Reactive properties for selected country code and phone number
const selectedCountryCode = ref("+234");
const phoneNumber = ref(null);

onMounted(() => {
  if (props.modelValue) {
    const tempData = props.modelValue.split("-");
    selectedCountryCode.value = tempData[0];
    phoneNumber.value = tempData[1];
  }
});
watch(
  () => [selectedCountryCode.value, phoneNumber.value],
  () => {
    emit(
      "update:modelValue",
      `${selectedCountryCode.value}-${phoneNumber.value}`
    );
  }
);
watch(
  () => [props.modelValue],
  () => {
    if (props.modelValue) {
      const tempData = props.modelValue.split("-");
      selectedCountryCode.value = tempData[0];
      phoneNumber.value = tempData[1];
    }
  }
);
</script>

<style scoped>
.input-control {
  color: #101828;
  box-shadow: 0px 1px 2px #1018280d;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
}
.input-control:disabled {
  background: #f8fafc;
}
/* Hide the number input caret (spinner) in most browsers */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.has-error input {
  border-color: #e74c3c;
}

.is-valid input {
  border-color: #2ecc71;
}

.text-danger-500 {
  color: #e74c3c;
}

.text-success-500 {
  color: #2ecc71;
}
</style>
