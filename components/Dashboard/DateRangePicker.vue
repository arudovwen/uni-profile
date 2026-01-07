<template>
  <div class="relative" ref="pickerRef">
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors min-w-[140px]"
      @click="isOpen = !isOpen"
    >
      <!-- Calendar Icon -->
      <svg
        class="w-4 h-4 text-[#9CA3AF]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span :class="hasValue ? 'text-[#2F2F2F]' : 'text-[#9CA3AF]'">
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

    <!-- Dropdown Menu with Preset Options -->
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
        class="absolute top-full right-0 mt-1 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 py-1"
      >
        <!-- Clear option -->
        <button
          v-if="hasValue"
          type="button"
          class="w-full px-3 py-2 text-sm text-left text-[#9CA3AF] hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
          @click="clearSelection"
        >
          Clear
        </button>

        <!-- Preset Options -->
        <button
          v-for="preset in presets"
          :key="preset.value"
          type="button"
          class="w-full px-3 py-2 text-sm text-left hover:bg-[#F9FAFB] transition-colors"
          :class="
            selectedPreset === preset.value
              ? 'text-[#1570EF] bg-[#EFF6FF]'
              : 'text-[#2F2F2F]'
          "
          @click="selectPreset(preset)"
        >
          {{ preset.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface Preset {
  label: string;
  value: string;
  getRange: () => DateRange;
}

interface Props {
  modelValue: DateRange | null;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Date Range",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: DateRange | null): void;
  (e: "change", value: DateRange | null): void;
}>();

const isOpen = ref(false);
const selectedPreset = ref<string | null>(null);
const pickerRef = ref<HTMLElement | null>(null);

// Preset date ranges
const presets: Preset[] = [
  {
    label: "Today",
    value: "today",
    getRange: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { start: today, end };
    },
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getRange: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const end = new Date(yesterday);
      end.setHours(23, 59, 59, 999);
      return { start: yesterday, end };
    },
  },
  {
    label: "Last 7 days",
    value: "last7days",
    getRange: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
  },
  {
    label: "Last 30 days",
    value: "last30days",
    getRange: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
  },
  {
    label: "This month",
    value: "thisMonth",
    getRange: () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
  {
    label: "Last month",
    value: "lastMonth",
    getRange: () => {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
];

const hasValue = computed(() => {
  return props.modelValue?.start && props.modelValue?.end;
});

const displayText = computed(() => {
  if (!hasValue.value) return props.placeholder;
  const preset = presets.find((p) => p.value === selectedPreset.value);
  return preset?.label || props.placeholder;
});

const selectPreset = (preset: Preset) => {
  selectedPreset.value = preset.value;
  const range = preset.getRange();
  emit("update:modelValue", range);
  emit("change", range);
  isOpen.value = false;
};

const clearSelection = () => {
  selectedPreset.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  isOpen.value = false;
};

// Close picker when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
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
