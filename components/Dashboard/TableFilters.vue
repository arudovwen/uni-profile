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
        class="w-full pl-10 pr-4 py-[7px] text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1570EF] focus:border-transparent placeholder:text-[#9CA3AF]"
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
      class="w-9 h-9 flex items-center justify-center border border-[#E4E7EC] rounded-md bg-white hover:bg-[#F9FAFB] transition-colors"
      @click="$emit('download')"
    >
      <download-svg />
    </button>
  </div>
</template>

<script setup lang="ts">
import DownloadSvg from "~/assets/images/icon/DownloadSvg.vue";

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
