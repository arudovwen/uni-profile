<template>
  <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
    <!-- Sidebar Navigation -->
    <nav :class="['w-fit', sidebarWidth, 'flex-shrink-0']">
      <ul :class="[
        'grid',
        mobileGridCols,
        'sm:grid-cols-1 gap-1 sm:gap-0 pb-2 sm:pb-0 border-b sm:border-b-0 border-[#E4E7EC]'
      ]">
        <li v-for="tab in tabs" :key="tab.id">
          <button
            type="button"
            :class="getButtonClass(tab.id)"
            @click="handleTabClick(tab.id)"
          >
            <span :class="getIndicatorClass(tab.id)">
              <component
                :is="tab.icon"
                class="w-5 h-5 sm:w-6 sm:h-6"
                :color="isActive(tab.id) ? activeColor : inactiveColor"
              />
              <span
                class="text-sm sm:text-base font-medium leading-6"
                :class="isActive(tab.id) ? activeTextColor : inactiveTextColor"
              >
                {{ tab.label }}
              </span>
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Content Area -->
    <div class="flex-1 min-w-0">
      <div v-for="tab in tabs" :key="`content-${tab.id}`">
        <div v-show="isActive(tab.id)">
          <slot :name="`tab-${tab.id}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Tab {
  id: string;
  label: string;
  icon: any; // Vue component (use with markRaw)
}

interface Props {
  tabs: Tab[];
  modelValue: string;
  sidebarWidth?: string;
  activeColor?: string;
  inactiveColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  mobileGridCols?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sidebarWidth: "",
  activeColor: "#1570EF",
  inactiveColor: "#667085",
  activeTextColor: "text-[#1570EF]",
  inactiveTextColor: "text-[#344054]",
  mobileGridCols: "grid-cols-2",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "tab-change", tabId: string): void;
}>();

const isActive = (tabId: string): boolean => props.modelValue === tabId;

const handleTabClick = (tabId: string): void => {
  emit("update:modelValue", tabId);
  emit("tab-change", tabId);
};

const getButtonClass = computed(() => (tabId: string): string => {
  return [
    "w-full flex items-center justify-center sm:justify-start gap-2",
    "py-2 sm:py-2.5 px-2 sm:px-0 sm:pr-4",
    "transition-colors rounded-lg sm:rounded-none",
    isActive(tabId) ? "bg-[#EFF8FF] sm:bg-transparent" : "",
  ].filter(Boolean).join(" ");
});

const getIndicatorClass = computed(() => (tabId: string): string => {
  return [
    "flex flex-row items-center gap-2",
    "sm:pl-[7px] sm:border-l-2",
    isActive(tabId) ? "sm:border-[#1570EF]" : "sm:border-transparent",
  ].filter(Boolean).join(" ");
});
</script>
