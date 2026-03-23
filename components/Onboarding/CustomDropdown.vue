<template>
  <div :class="[containerStyles, 'w-full font-Avenir']">
    <!-- Label Section -->
    <div v-if="label" class="flex items-start font-Avenir mb-2">
      <span class="text-[#344054] font-medium text-sm">
        {{ label }}
      </span>
      <span
        v-if="showAsterisk"
        class="text-[#F97066] text-base font-medium mx-1"
      >
        *
      </span>
      <span v-if="helperText" class="text-xs text-[#667085] ml-1">
        {{ helperText }}
      </span>
    </div>

    <!-- Sublabel Section -->
    <p v-if="subLabel" class="text-xs text-[#667085] mb-3">
      {{ subLabel }}
    </p>

    <div class="relative">
      <!-- Dropdown Trigger -->
      <button
        ref="triggerRef"
        type="button"
        :disabled="disabled || isLoading"
        :class="[
          buttonClass,
          getSizeClasses,
          'flex w-fit items-center justify-between border transition-all duration-200',
          borderClasses,
          disabled || isLoading
            ? 'bg-[#F2F4F7] cursor-not-allowed'
            : 'bg-white hover:border-[#B5BAC1]',
          isOpen ? 'ring-2 ring-primary-600 ring-offset-0' : '',
        ]"
        @click="toggleDropdown"
        @keydown="handleKeydown"
      >
        <span
          class="flex-1 text-left truncate"
          :class="[
            modelValue?.code ? 'text-gray-900' : 'text-gray-500',
            sizeTextClasses,
          ]"
        >
          {{ modelValue?.name || placeholder }}
        </span>

        <!-- Clear Button -->
        <button
          v-if="clearable && modelValue && !disabled && !isLoading"
          type="button"
          class="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          @click.stop="clearSelection"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="ml-2 animate-spin">
          <svg
            class="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 2a10 10 0 0110 10v1H2v-1a10 10 0 0110-10z"
            />
          </svg>
        </div>

        <!-- Chevron Icon -->
        <svg
          v-if="!isLoading && showIcon"
          :width="iconSize"
          :height="iconSize"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="[
            'transition-transform flex-shrink-0 ml-2',
            isOpen ? 'rotate-180' : '',
          ]"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            :stroke="iconColor"
            stroke-width="1.67"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <Teleport to="body">
        <transition
          name="dropdown"
          @enter="onDropdownEnter"
          @leave="onDropdownLeave"
        >
          <div
            v-if="isOpen"
            ref="dropdownRef"
            :class="[
              dropdownStyles,
              'absolute z-[9999] bg-white border border-[#E4E7EC] rounded-lg shadow-lg',
            ]"
            :style="{ ...dropdownStyle, maxHeight: maxDropdownHeight }"
          >
            <!-- Search Input -->
            <div v-if="showSearchFilter" class="p-4 border-b border-[#E4E7EC]">
              <div
                class="flex h-10 items-center px-3 border border-[#D0D5DD] bg-white rounded-lg shadow-sm shadow-[#1018280D]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                    stroke="#667085"
                    stroke-width="1.67"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  ref="searchInputRef"
                  v-model="searchTerm"
                  type="text"
                  :placeholder="dropdownSearchText || 'Search...'"
                  class="w-full bg-transparent border-0 focus:outline-none px-3 text-sm text-[#101828] font-normal placeholder:text-[#667085]"
                />
              </div>
            </div>

            <!-- Dropdown Items Container -->
            <div
              class="overflow-y-auto"
              :style="{ maxHeight: searchContainerHeight }"
            >
              <!-- Items List -->
              <template v-if="filteredItems.length > 0">
                <button
                  v-for="(item, index) in filteredItems"
                  :key="`${item.code}-${index}`"
                  type="button"
                  class="w-full px-4 py-3 text-left hover:bg-[#F2F4F7] focus:bg-[#F2F4F7] focus:outline-none transition-colors cursor-pointer border-b border-[#F0F0F0] last:border-0"
                  :class="{ 'bg-[#EFF8FF]': modelValue?.code === item.code }"
                  @click="handleItemSelect(item)"
                >
                  <!-- Slot for custom item rendering -->
                  <slot name="item" :item="item">
                    <span class="text-sm font-medium text-[#344054]">
                      {{ item.name }}
                    </span>
                  </slot>
                </button>
              </template>

              <!-- No Results State -->
              <div v-else class="px-4 py-6 text-[#667085] text-center text-sm">
                {{ noResultsText }}
              </div>
            </div>

            <!-- Footer Slot -->
            <slot v-if="showDropdownFooter" name="footer" />
          </div>
        </transition>
      </Teleport>
    </div>

    <!-- Error Message -->
    <span v-if="error" class="mt-2 text-sm text-[#F04438] font-normal block">
      {{ error }}
    </span>

    <!-- Helper Text -->
    <span v-if="helperText && !error" class="mt-2 text-xs text-[#667085] block">
      {{ helperText }}
    </span>
  </div>
</template>

<!-- Dropdown Transition Styles -->
<style scoped>
.dropdown-enter-active {
  animation: slideDown 0.2s ease-out;
}

.dropdown-leave-active {
  animation: slideUp 0.15s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";

interface DropdownOption {
  code: string;
  name: string;
  [key: string]: any;
}

type SizeType = "sm" | "md" | "lg";

interface Props {
  modelValue?: DropdownOption | null;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  subLabel?: string;
  helperText?: string;
  dropdownStyles?: string;
  containerStyles?: string;
  buttonClass?: string;
  error?: string;
  showAsterisk?: boolean;
  dropdownSearchText?: string;
  showSearchFilter?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
  size?: SizeType;
  maxDropdownHeight?: string;
  noResultsText?: string;
  showIcon?: boolean;
  iconColor?: string;
  iconSize?: number;
  showDropdownFooter?: boolean;
  borderColor?: string;
  focusColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "Select an option",
  disabled: false,
  label: "",
  subLabel: "",
  helperText: "",
  dropdownStyles: "",
  containerStyles: "",
  buttonClass: "",
  error: "",
  showAsterisk: false,
  dropdownSearchText: "",
  showSearchFilter: true,
  clearable: false,
  isLoading: false,
  size: "md",
  maxDropdownHeight: "320px",
  noResultsText: "No results found",
  showIcon: true,
  iconColor: "#667085",
  iconSize: 20,
  showDropdownFooter: false,
  borderColor: "#D0D5DD",
  focusColor: "#1570EF",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: DropdownOption | null): void;
  (e: "open"): void;
  (e: "close"): void;
  (e: "search", value: string): void;
}>();

const isOpen = ref(false);
const searchTerm = ref("");
const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const dropdownPosition = ref({ top: 0, left: 0, width: 0 });

// Computed Properties
const getSizeClasses = computed(() => {
  const sizes = {
    sm: "h-10 text-sm px-3 py-2",
    md: "h-12 text-base px-3 py-2",
    lg: "h-14 text-lg px-4 py-3",
  };
  return sizes[props.size];
});

const sizeTextClasses = computed(() => {
  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  return sizes[props.size];
});

const borderClasses = computed(() => {
  if (props.error) {
    return "border-[#F04438]";
  }
  return `border-[${props.borderColor}]`;
});

const filteredItems = computed(() => {
  return props.options.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const searchContainerHeight = computed(() => {
  return props.showSearchFilter
    ? `calc(${props.maxDropdownHeight} - 70px)`
    : props.maxDropdownHeight;
});

const dropdownStyle = computed(() => ({
  position: "absolute" as const,
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  width: `${dropdownPosition.value.width}px`,
  minWidth: "200px",
  maxWidth: "100vw",
}));

// Methods
const updatePosition = () => {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect();
    dropdownPosition.value = {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  }
};

const toggleDropdown = () => {
  if (props.disabled || props.isLoading) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updatePosition();
    emit("open");
  } else {
    emit("close");
  }
};

const handleItemSelect = (item: DropdownOption) => {
  emit("update:modelValue", item);
  isOpen.value = false;
  searchTerm.value = "";
  emit("close");
};

const clearSelection = () => {
  emit("update:modelValue", null);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) {
    isOpen.value = false;
    emit("close");
  } else if (
    event.key === "Enter" &&
    !isOpen.value &&
    !props.disabled &&
    !props.isLoading
  ) {
    toggleDropdown();
  }
};

const onDropdownEnter = (el: Element) => {
  (el as HTMLElement).style.opacity = "0";
  (el as HTMLElement).style.transform = "translateY(-8px)";
  nextTick(() => {
    (el as HTMLElement).style.opacity = "1";
    (el as HTMLElement).style.transform = "translateY(0)";
  });
};

const onDropdownLeave = (el: Element) => {
  (el as HTMLElement).style.opacity = "0";
  (el as HTMLElement).style.transform = "translateY(-8px)";
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    triggerRef.value &&
    !triggerRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
    searchTerm.value = "";
    emit("close");
  }
};

// Watchers
watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("scroll", updatePosition, true);
    window.removeEventListener("resize", updatePosition);
  }
});

watch(searchTerm, (newValue) => {
  emit("search", newValue);
});

onMounted(() => {
  updatePosition();
  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("scroll", updatePosition, true);
  window.addEventListener("resize", updatePosition);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("scroll", updatePosition, true);
  window.removeEventListener("resize", updatePosition);
});
</script>
