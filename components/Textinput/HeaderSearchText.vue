<template>
  <div
    class="formGroup relative w-full lg:w-auto bg-green"
    :class="`${error ? 'has-error' : ''}  ${horizontal ? 'flex' : ''}  ${
      validate ? 'is-valid' : ''
    } `"
  >
    <label
      v-if="label"
      :class="`${classLabel} ${
        horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
      }  flex items-center gap-x-1 input-label text-sm !text-[#1B2B41B8]`"
      :for="name"
      :data-testid="label"
    >
      {{ label }} <RedDot v-if="isCumpulsory" />
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
    <div
      class="relative lg:bg-[#F2F4F7] flex items-center"
      :class="horizontal ? 'flex-1' : ''"
    >
      <input
        :type="types"
        :name="name"
        :data-testid="name"
        :placeholder="placeholder"
        :class="`${classInput} lg:bg-gray-600 input-control  w-[20px] block focus:outline-none h-[44px] ${
          hasicon ? 'pr-10' : ''
        } ${iconPosition === 'left' ? '!pl-10' : 'pr-10'} `"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :error="error"
        :id="name"
        :readonly="isReadonly"
        :disabled="disabled"
        :validate="validate"
        v-if="!isMask"
      />
      <cleave
        :class="`${classInput} cleave !border-none input-control block w-full  focus:outline-none h-[44px] `"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :error="error"
        :id="name"
        :readonly="isReadonly"
        :disabled="disabled"
        :validate="validate"
        :options="options"
        v-if="isMask"
        modelValue="modelValue"
      />

      <div
        :class="`flex text-xl absolute  ${
          iconPosition === 'left' ? 'left-[14px]' : 'right-[14px]'
        } top-1/2 -translate-y-1/2`"
      >
        <span v-if="validate" class="text-success-500">
          <AppIcon icon="bi:check-lg" />
        </span>
        <span class="text-[#98A2B3]">
          <img :src="searchIcon" class="text-green h-[20px] w-[20px]" />
        </span>
        <span class="text-sm"> <slot name="suffix"></slot></span>
      </div>
      <span class="flex absolute right-0">
        <span v-if="error && types !== 'date'" class="text-danger-500 mr-2">
          <AppIcon icon="heroicons-outline:information-circle" />
        </span>
        <span
          v-if="hasicon"
          @click="toggleType"
          iconClass="cursor-pointer text-secondary-500"
          class="mr-2"
        >
          <AppIcon
            icon="la:eye"
            iconClass="text-[#667085]"
            v-if="types === 'password'"
          />
          <AppIcon icon="la:eye-slash" iconClass="text-[#667085]" v-else />
        </span>
      </span>
      <slot name="content"></slot>
    </div>

    <span
      v-if="error"
      class=""
      :class="
        msgTooltip
          ? ' inline-block placeholder-[#f9bb64] bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
          : ' text-danger-500 block placeholder-[#f9bb64] text-sm'
      "
      >{{ error }}</span
    >
    <span
      v-if="validate"
      class=""
      :class="
        msgTooltip
          ? ' inline-block placeholder-[#f9bb64] bg-success-500 text-white text-[10px] px-2 py-1 rounded'
          : ' text-success-500 block placeholder-[#f9bb64] text-sm'
      "
      >{{ validate }}</span
    >
    <span
      class="block placeholder-[#f9bb64] text-[#475467] font-light leading-4 text-xs mt-2"
      v-if="description"
      >{{ description }}</span
    >
  </div>
</template>
<script setup>
import Cleave from "vue-cleave-component";
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
  isCumpulsory: {
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
});
const types = ref(props.type);
import emailIcon from "@/assets/images/svgs/mail-01.svg";
import passwordIcon from "@/assets/images/svgs/lock-01.svg";
import searchIcon from "@/assets/images/svgs/search-lg.png";
const iconTypes = {
  email: { icon: emailIcon },
  password: { icon: passwordIcon },
};

const toggleType = () => {
  // toggle the type of the input field
  types.value = types.value === "text" ? "password" : "text";
};
</script>
<style lang="scss">
input::placeholder {
  color: #98a2b3;
}
.input-control {
  color: #101828;
  box-sizing: border-box;
  box-shadow: 0px 1px 2px #1018280d;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
}

@media (max-width: 600px) {
  .input-control {
  }
  input::placeholder {
    color: #e4e7ec;
  }
}
</style>
