<template>
  <div :class="[inputWrapperStyle, 'w-full flex flex-col font-onest']">
    <div v-if="label" class="flex items-start">
      <span
        class="mb-2 text-base text-[#344054] font-medium leading-[1.25rem]"
      >
        {{ label }}
      </span>
      <span
        v-if="showAsterisk"
        :class="[
          asteriskClassName,
          'text-[#7F56D9] text-base font-[500] mx-1',
        ]"
      >
        *
      </span>
    </div>
    <div
      :class="[
        containerStyle,
        'flex h-12 items-center px-4 border rounded-lg shadow-sm shadow-[#1018280D]',
        disabled
          ? 'bg-[#FAFAFA] border-[#D5D7DA]'
          : 'bg-white border-[#D0D5DD]',
      ]"
    >
      <div
        v-if="hasLeftSection"
        :class="[
          sectionStyle,
          'border-r border-[#D5D7DA] px-3.5 h-full flex items-center justify-center gap-1',
        ]"
        @click="$emit('sectionClick')"
      >
        <img v-if="leftSectionIcon" :src="leftSectionIcon" alt="" />
        <p class="text-base text-[#475467] font-normal">
          {{ leftSectionText }}
        </p>
      </div>
      <div v-if="hasLeftIcon" class="">
        <slot name="leftIcon" />
      </div>
      <input
        :name="name"
        :placeholder="placeholder"
        :class="[
          className,
          'w-full bg-transparent border-0 focus:outline-none py-2 px-2 text-base font-normal placeholder:text-[#667085]',
          disabled ? 'text-[#717680]' : 'text-[#101828]',
        ]"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @input="handleInput"
        @keydown="$emit('keydown', $event)"
      />
      <div v-if="hasRightIcon" class="">
        <slot name="rightIcon" />
      </div>
      <div
        v-if="hasRightSection"
        :class="[
          sectionStyle,
          'bg-white cursor-pointer border-l border-[#D5D7DA] px-4.5 h-full flex items-center justify-center gap-1.5',
        ]"
        @click="$emit('sectionClick')"
      >
        <img v-if="rightSectionIcon" :src="rightSectionIcon" alt="" />
        <p class="text-base text-[#344054] font-medium">
          {{ rightSectionText }}
        </p>
      </div>
      <div
        v-if="isPasswordField"
        class="cursor-pointer z-20"
        @click="$emit('togglePassword')"
      >
        <AppIcon
          v-if="type === 'password'"
          icon="la:eye-slash"
          iconClass="text-[#2F2F2F] text-[22px] font-bold"
        />
        <AppIcon v-else icon="la:eye" iconClass="text-[#2F2F2F] text-[22px] font-bold" />
      </div>
    </div>
    <span
      v-if="hintText"
      class="mt-2 text-base text-[#475467] font-[400] leading-[1.25rem]"
    >
      {{ hintText }}
    </span>
    <span v-if="error" class="mt-2 text-sm text-[#F04438] font-[400]">
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
