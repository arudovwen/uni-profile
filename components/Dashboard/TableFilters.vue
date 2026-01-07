<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
    <!-- Search Bar -->
    <div class="relative flex-1">
      <div
        class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-[#9CA3AF]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        :value="modelValue"
        :placeholder="searchPlaceholder"
        class="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1570EF] focus:border-transparent placeholder:text-[#9CA3AF]"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @keyup.enter="$emit('search', modelValue)"
      />
    </div>

    <!-- Filters Slot -->
    <div class="flex items-center gap-3">
      <slot name="filters" />
    </div>

    <!-- Download Button -->
    <button
      v-if="showDownload"
      type="button"
      class="p-2.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
      @click="$emit('download')"
    >
      <svg
        class="w-5 h-5 text-[#475467]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  searchPlaceholder?: string;
  showDownload?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: "",
  searchPlaceholder: "Search...",
  showDownload: true,
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search", value: string): void;
  (e: "download"): void;
}>();
</script>
