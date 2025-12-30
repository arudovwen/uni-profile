<template>
  <div :class="[containerStyles, 'w-full font-Avenir']">
    <div v-if="label" class="flex items-start font-Avenir">
      <span class="mb-2 text-base text-[#344054] font-medium leading-5">
        {{ label }}
      </span>
      <span v-if="showAsterisk" class="text-[#F97066] text-base font-medium mx-1"
        >*</span
      >
    </div>
    <div class="relative mb-2">
      <!-- Dropdown Trigger -->
      <button
        ref="triggerRef"
        type="button"
        :disabled="disabled"
        :class="[
          'flex w-full h-12 items-center px-2 border border-[#D0D5DD] rounded-lg shadow-sm shadow-[#1018280D]',
          disabled ? 'bg-[#F2F4F7]' : 'bg-white',
        ]"
        @click="toggleDropdown"
      >
        <div
          class="flex items-center justify-between w-full px-2 cursor-pointer"
        >
          <span
            :class="[
              modelValue?.code ? 'text-gray-900' : 'text-gray-500',
              'text-base',
            ]"
          >
            {{ modelValue?.name || placeholder }}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="['transition-transform', isOpen ? 'rotate-180' : '']"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#667085"
              stroke-width="1.67"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>

      <!-- Dropdown Menu -->
      <Teleport to="body">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          :class="[
            dropdownStyles,
            'absolute z-[9999] bg-white border border-[#E4E7EC] rounded-lg shadow-lg px-4 py-5',
          ]"
          :style="dropdownStyle"
        >
          <!-- Search Input -->
          <div v-if="showSearchFilter" class="mb-5">
            <div
              class="flex h-12 items-center px-2 border border-[#D0D5DD] bg-white rounded-lg shadow-sm shadow-[#1018280D]"
            >
              <svg
                width="20"
                height="20"
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
                class="w-full bg-transparent border-0 focus:outline-none px-2 text-base text-[#101828] font-normal placeholder:text-[#667085]"
              />
            </div>
          </div>

          <!-- Dropdown Items -->
          <div class="max-h-64 overflow-y-auto">
            <template v-if="filteredItems.length > 0">
              <button
                v-for="(item, index) in filteredItems"
                :key="index"
                type="button"
                class="w-full p-2 text-left hover:bg-[#F2F4F7] hover:rounded-md focus:bg-[#F2F4F7] focus:outline-none transition-colors cursor-pointer"
                @click="handleItemSelect(item)"
              >
                <span class="text-base font-medium text-[#535862]">
                  {{ item.name }}
                </span>
              </button>
            </template>
            <div v-else class="px-4 py-3 text-[#535862] text-center">
              No results found
            </div>
          </div>
        </div>
      </Teleport>
    </div>
    <span v-if="error" class="mt-2 text-sm text-[#F04438] font-normal">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";

interface DropdownOption {
  code: string;
  name: string;
  [key: string]: any;
}

interface Props {
  modelValue?: DropdownOption | null;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  dropdownStyles?: string;
  containerStyles?: string;
  error?: string;
  showAsterisk?: boolean;
  dropdownSearchText?: string;
  showSearchFilter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "Select an option",
  disabled: false,
  label: "",
  dropdownStyles: "",
  containerStyles: "",
  error: "",
  showAsterisk: false,
  dropdownSearchText: "",
  showSearchFilter: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: DropdownOption): void;
}>();

const isOpen = ref(false);
const searchTerm = ref("");
const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const dropdownPosition = ref({ top: 0, left: 0, width: 0 });

const filteredItems = computed(() => {
  return props.options.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const dropdownStyle = computed(() => ({
  position: "absolute" as const,
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  width: `${dropdownPosition.value.width}px`,
  minWidth: "200px",
  maxWidth: "100vw",
}));

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
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updatePosition();
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
};

const handleItemSelect = (item: DropdownOption) => {
  emit("update:modelValue", item);
  isOpen.value = false;
  searchTerm.value = "";
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
  }
};

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

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("scroll", updatePosition, true);
  window.removeEventListener("resize", updatePosition);
});
</script>
