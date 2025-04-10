<template>
  <label
    v-if="label"
    :class="`${classLabel} ${
      horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
    }  flex items-center gap-x-1 input-label text-sm !text-[#1B2B41B8]`"
    :for="name"
    :data-testid="label"
  >
    {{ label }} <RedDot v-if="isRequired" />
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
  <div class="flex items-center border rounded-lg w-full">
    <Listbox class="flex items-center text-[#101828]" v-model="code">
      <div class="relative h-11">
        <ListboxButton
          :class="classStyles"
          class="relative cursor-pointer h-full text-left flex items-center rounded-l-lg pl-3 gap-x-2 py-[10px] r placeholder:text-[#B6B7B9] focus:outline-matta-black/20 text-sm"
        >
          <span class="text-sm" v-if="code">
            <div class="text-[#3A3745] flex items-center gap-x-1">
              <span v-if="code">{{ code }}</span>
            </div></span
          >
          <span class="block text-sm text-[#8F8C9A] whitespace-nowrap" v-else>{{
            placeholder
          }}</span>
          <AppIcon icon="uil:angle-down" />
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute top-11 mt-1 w-full min-w-[320px] border border-gray-100 z-40 rounded-lg bg-white py-6 text-xs shadow-lg outline-0 sm:text-[13px] text-[#101828]"
          >
            <div class="relative flex items-center mb-3 mt-3 px-4">
              <input
                v-model="query"
                placeholder="Search"
                class="text-xs rounded-lg px-3 py-1 h-10 w-full border placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
              />
            </div>
            <div class="max-h-11 overflow-y-auto py-1">
              <ListboxOption
                v-slot="{ selected }"
                v-for="z in filteredCodes"
                :key="z"
                :value="z.dial_code"
                as="template"
              >
                <span
                  :class="[
                     selected ? 'bg-gray-50' : '',
                    'relative cursor-pointer select-none py-[10px] px-[20px] text-loft-black hover:bg-gray-100  flex items-center justify-between',
                  ]"
                >
                  <p class="text-sm text-[#101828] capitalize">
                    {{ z.dial_code }} - &nbsp; {{ z.name }}
                  </p>
                  <i class="uil uil-check text-[#101828]" v-show="selected"></i>
                </span>
              </ListboxOption>
            </div>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <input
      v-model="phone"
      placeholder="0816*******"
      type="tel"
      class="flex-1 px-4 outline-none h-full py-2 text-sm !shadow-none"
    />
  </div>
</template>
<script setup>
import {
  Listbox,
  // ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import CountryList from "country-list-with-dial-code-and-flag";

const props = defineProps({
  iconType: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search",
  },
  label: {
    type: String,
  },
  classLabel: {
    type: String,
    default: " ",
  },
  classInput: {
    type: String,
    default: "classinput",
  },
  type: {
    type: String,
    default: "text",
    //required: true,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isOptional: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  error: {
    type: String,
  },
  hasicon: {
    type: Boolean,
    default: false,
  },
  isReadonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
  validate: {
    type: String,
  },
  msgTooltip: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
  iconPosition: {
    type: String,
  },
  isMask: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({
      creditCard: true,
      delimiter: "-",
    }),
  },
  infoTitle: {
    type: String,
  },
  info: {
    type: Boolean,
  },
  suffix: {
    default: "",
  },
  classStyles:{
    default:""
  }
});

const emits = defineEmits(["update:modelValue"]);
const selectedOption = computed(() => `${code.value}-${phone.value}`);

const code = ref("+234");
const phone = ref("");
onMounted(() => {
  if (!props.modelValue) return {};
  if (props.modelValue.includes("-")) {
    code.value = props.modelValue.split("-")[0] || "+234";
    phone.value = props.modelValue.split("-")[1];
  } else {
    phone.value = props.modelValue;
  }
});
const query = ref("");
const filteredCodes = computed(() => {
  if (!query.value.length) return CountryList;
  return CountryList?.filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase())
  );
});

watch(selectedOption, () => {
  if (!selectedOption.value) return;

  emits("update:modelValue", selectedOption.value);
});
watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) return {};
    if (props.modelValue.includes("-")) {
      code.value = props.modelValue.split("-")[0] || "+234";
      phone.value = props.modelValue.split("-")[1];
    } else {
      phone.value = props.modelValue;
    }
  }
);
</script>
<style lang="scss" scoped>
input::placeholder {
  color: #667085;
}
input {
  color: #101828;
  box-sizing: border-box;

  box-shadow: 0px 1px 2px #1018280d;
  border-radius: 8px;
}
</style>
