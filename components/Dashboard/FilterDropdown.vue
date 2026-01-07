<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors min-w-[100px]"
      @click="isOpen = !isOpen"
    >
      <span :class="modelValue ? 'text-[#2F2F2F]' : 'text-[#9CA3AF]'">
        {{ displayText }}
      </span>
      <svg
        class="w-4 h-4 text-[#9CA3AF] ml-auto transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
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
        class="absolute top-full left-0 mt-1 w-full min-w-[150px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 py-1"
      >
        <!-- Clear option -->
        <button
          v-if="modelValue && clearable"
          type="button"
          class="w-full px-3 py-2 text-sm text-left text-[#9CA3AF] hover:bg-[#F9FAFB] transition-colors"
          @click="selectOption(null)"
        >
          Clear
        </button>

        <!-- Options -->
        <button
          v-for="option in normalizedOptions"
          :key="option.value"
          type="button"
          class="w-full px-3 py-2 text-sm text-left hover:bg-[#F9FAFB] transition-colors"
          :class="
            modelValue === option.value
              ? 'text-[#1570EF] bg-[#EFF6FF]'
              : 'text-[#2F2F2F]'
          "
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
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
