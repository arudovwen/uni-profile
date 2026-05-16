<template>
  <div :class="[inputWrapperStyle, 'w-full flex flex-col gap-1 font-Avenir']">
    <div v-if="label" class="flex items-center">
      <span class="text-sm font-medium text-[#2F2F2F] leading-5">
        {{ label }}
      </span>
      <span
        v-if="isOptional"
        class="text-xs text-[#667085] font-normal ml-1"
      >
        (Optional)
      </span>
      <span
        v-if="showAsterisk"
        :class="[asteriskClassName, 'text-[#7F56D9] text-sm font-medium ml-0.5']"
      >
        *
      </span>
    </div>
    <div
      :class="[
        containerStyle,
        'flex h-[41px] items-center px-[17px] py-[11px] border rounded-[5px]',
        disabled
          ? 'bg-[#FAFAFA] border-[#D5D7DA]'
          : 'bg-white border-[#E2E2E2]',
        error ? 'border-[#F04438]' : '',
      ]"
    >
      <div
        v-if="hasLeftSection"
        :class="[
          sectionStyle,
          'border-r border-[#E2E2E2] pr-3 mr-3 h-full flex items-center justify-center gap-1',
        ]"
        @click="$emit('sectionClick')"
      >
        <img v-if="leftSectionIcon" :src="leftSectionIcon" alt="" />
        <p class="text-sm text-[#475467] font-normal">
          {{ leftSectionText }}
        </p>
      </div>
      <div v-if="hasLeftIcon" class="mr-2">
        <slot name="leftIcon" />
      </div>
      <input
        :name="name"
        :placeholder="placeholder"
        :class="[
          className,
          'w-full bg-transparent border-0 focus:outline-none text-sm font-normal placeholder:text-[#667085]',
          disabled ? 'text-[#717680]' : 'text-[#475467]',
        ]"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @input="handleInput"
        @keydown="$emit('keydown', $event)"
      />
      <div v-if="hasRightIcon" class="ml-2">
        <slot name="rightIcon" />
      </div>
      <div
        v-if="hasRightSection"
        :class="[
          sectionStyle,
          'bg-white cursor-pointer border-l border-[#E2E2E2] pl-3 ml-3 h-full flex items-center justify-center gap-1.5',
        ]"
        @click="$emit('sectionClick')"
      >
        <img v-if="rightSectionIcon" :src="rightSectionIcon" alt="" />
        <p class="text-sm text-[#344054] font-medium">
          {{ rightSectionText }}
        </p>
      </div>
      <div
        v-if="isPasswordField"
        class="cursor-pointer z-20 ml-2"
        @click="$emit('togglePassword')"
      >
        <AppIcon
          v-if="type === 'password'"
          icon="la:eye-slash"
          iconClass="text-[#667085] text-[20px]"
        />
        <AppIcon
          v-else
          icon="la:eye"
          iconClass="text-[#667085] text-[20px]"
        />
      </div>
    </div>
    <span
      v-if="hintText"
      class="text-sm text-[#475467] font-normal leading-5"
    >
      {{ hintText }}
    </span>
    <span v-if="error" class="text-xs text-[#F04438] font-normal">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  placeholder: string;
  label?: string;
  modelValue?: string;
  type?: string;
  className?: string;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
  hintText?: string;
  containerStyle?: string;
  name: string;
  required?: boolean;
  error?: string | null;
  inputWrapperStyle?: string;
  disabled?: boolean;
  showAsterisk?: boolean;
  isOptional?: boolean;
  asteriskClassName?: string;
  hasRightSection?: boolean;
  rightSectionText?: string;
  rightSectionIcon?: string;
  hasLeftSection?: boolean;
  leftSectionText?: string;
  leftSectionIcon?: string;
  sectionStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  className: "",
  hasLeftIcon: false,
  hasRightIcon: false,
  disabled: false,
  showAsterisk: false,
  isOptional: false,
  hasRightSection: false,
  hasLeftSection: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "keydown", event: KeyboardEvent): void;
  (e: "contentChange"): void;
  (e: "togglePassword"): void;
  (e: "sectionClick"): void;
}>();

const passwordNames = [
  "password",
  "newPassword",
  "confirmPassword",
  "currentPassword",
];

const isPasswordField = computed(() => passwordNames.includes(props.name));

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
  emit("contentChange");
};
</script>
