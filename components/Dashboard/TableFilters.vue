<template>
  <div class="flex flex-col gap-3 mb-4 sm:mb-6">
    <!-- Search Bar Row -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <!-- Search Bar -->
      <div class="relative flex-1 min-w-0">
        <div
          class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
        >
          <search-icon />
        </div>
        <input
          type="text"
          :value="modelValue"
          :placeholder="searchPlaceholder"
          class="w-full pl-10 pr-4 py-[7px] text-sm border border-[#E5E7EB] rounded-lg focus:outline-none placeholder:text-[#9CA3AF]"
          @input="
            $emit('update:modelValue', ($event.target as HTMLInputElement).value)
          "
          @keyup.enter="$emit('search', modelValue)"
        />
      </div>

      <!-- Filters & Download Row -->
      <div class="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <!-- Filters Slot -->
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap flex-1 sm:flex-none">
          <slot name="filters" />
        </div>

        <!-- Download Button -->
        <button
          v-if="showDownload"
          type="button"
          class="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-[#E4E7EC] rounded-md bg-white hover:bg-[#F9FAFB] transition-colors"
          @click="$emit('download')"
        >
          <download-svg />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DownloadSvg from "~/assets/images/icon/DownloadSvg.vue";
import SearchIcon from "~/assets/images/icon/SearchIcon.vue";

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
