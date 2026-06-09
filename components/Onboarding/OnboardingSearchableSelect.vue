<template>
  <div :class="containerStyles">
    <!-- Label Section -->
    <div v-if="label" class="flex items-start font-Avenir mb-2">
      <span class="text-[#344054] font-medium text-sm">
        {{ label }}
      </span>
      <span
        v-if="required"
        class="text-[#F97066] text-base font-medium mx-1"
      >
        *
      </span>
    </div>

    <div class="relative">
      <!-- Search Select Input -->
      <SearchSelect
        :model-value="displayLabel"
        :options="items"
        :placeholder="placeholder"
        @update:model-value="handleModelUpdate"
      />

      <!-- Non-blocking loading indicator to avoid losing input focus -->
      <div
        v-if="isLoading"
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      >
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-[#E5E7EB] border-t-[#1570EF]"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="mt-2 py-2 px-3 border border-[#F04438] rounded-lg text-sm text-[#F04438] bg-[#FEE4E2]"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';
import SearchSelect from '~/components/Select/SearchSelect.vue';
import { useSearchableData, type SearchQueryOptions } from '~/composables/useSearchableData';

interface Props {
  modelValue?: any;
  service: (query: SearchQueryOptions) => Promise<any>;
  mapResponse: (data: any[]) => Array<{ label: string; value: any }>;
  initialQuery?: SearchQueryOptions;
  label?: string;
  placeholder?: string;
  required?: boolean;
  containerStyles?: string;
  debounceMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  required: false,
  containerStyles: 'w-full',
  debounceMs: 300,
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'search': [query: string];
  'error': [error: string];
}>();

// Use the searchable data composable
const { items, isLoading, error, updateQuery } = useSearchableData({
  service: props.service,
  initialQuery: props.initialQuery,
  mapResponse: props.mapResponse,
  debounceMs: props.debounceMs,
});

// Track the display label for the selected value
const displayLabel = computed(() => {
  if (!props.modelValue) return '';
  return items.value.find((item) => item.value === props.modelValue)?.label || '';
});

const handleModelUpdate = (value: any) => {
  // If the value is a label from the dropdown, find the corresponding value
  const selectedItem = items.value.find((item) => item.label === value);
  const actualValue = selectedItem ? selectedItem.value : value;
  
  emit('update:modelValue', actualValue);
  handleSearch(String(value ?? ''));
};

/**
 * Handle search input changes
 */
const handleSearch = (searchValue: string) => {
  updateQuery('search', searchValue);
  emit('search', searchValue);
};

// Watch for errors and emit them
watch(
  () => error.value,
  (newError) => {
    if (newError) {
      emit('error', newError);
    }
  }
);
</script>
