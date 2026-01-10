<template>
  <div :class="`flex items-center justify-between w-1/2 px-6 py-5 ${className}`">
    <div class="text-sm text-[#344054] font-medium">
      {{ 1 }} - {{ pageSize }}
    </div>

    <div class="flex items-center space-x-3">
      <button
        @click="handleLoadMore"
        :disabled="isLoadMoreDisabled"
        :class="[
          'px-4 py-2 font-semibold text-sm rounded-lg border transition-colors',
          isLoadMoreDisabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-gray-50 hover:border-gray-400 shadow-xs shadow-[#1018280D] cursor-pointer'
        ]"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface PaginationProps {
  pageSize: number;
  totalRecords: number;
  className?: string;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  className: '',
});

const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();

const handleLoadMore = () => {
  if (!isLoadMoreDisabled.value) {
    emit('loadMore');
  }
};

const isLoadMoreDisabled = computed(() => props.pageSize >= props.totalRecords);
</script>
