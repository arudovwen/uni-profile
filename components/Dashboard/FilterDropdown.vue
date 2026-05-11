<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      class="flex items-center justify-between px-3 py-[9px] h-9 text-sm font-medium border border-[#E4E7EC] rounded-md bg-white hover:bg-[#F9FAFB] transition-colors min-w-[91px] gap-2.5"
      @click="isOpen = !isOpen"
    >
      <span :class="modelValue ? 'text-[#344054]' : 'text-[#9CA3AF]'">
        {{ displayText }}
      </span>
      <svg
        class="w-[13px] h-2 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 13 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1.5L6.5 7L12 1.5"
          stroke="#D0D5DD"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-1 min-w-[132px] bg-white border border-black/[0.08] rounded-lg z-50 py-1 shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]"
      >
        <!-- Clear option -->
        <div v-if="modelValue && clearable" class="px-1.5 py-[1px]">
          <button
            type="button"
            class="w-full px-2 py-2.5 text-sm font-medium text-left text-[#9CA3AF] hover:bg-[#E4E7EC] rounded-md transition-colors"
            @click="selectOption(null)"
          >
            Clear
          </button>
        </div>

        <!-- Options -->
        <div
          v-for="option in normalizedOptions"
          :key="option.value"
          class="px-1.5 py-[1px]"
        >
          <button
            type="button"
            class="w-full px-2 py-2.5 text-sm font-medium text-left text-[#535862] rounded-md transition-colors"
            :class="modelValue === option.value ? 'bg-[#E4E7EC]' : 'hover:bg-[#F9FAFB]'"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue: string | null;
  options: (string | Option)[];
  placeholder?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select",
  clearable: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
  (e: "change", value: string | null): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const normalizedOptions = computed((): Option[] => {
  return props.options.map((opt) => {
    if (typeof opt === "string") {
      return { label: opt, value: opt };
    }
    return opt;
  });
});

const displayText = computed(() => {
  if (!props.modelValue) return props.placeholder;
  const selected = normalizedOptions.value.find(
    (opt) => opt.value === props.modelValue
  );
  return selected?.label || props.modelValue;
});

const selectOption = (value: string | null) => {
  emit("update:modelValue", value);
  emit("change", value);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
