<template>
  <div class="w-full">
    <Combobox v-model="selectedOption">
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-[#EAECF0] input sm:text-sm"
        >
          <ComboboxInput
            :class="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer px-3 outline-none focus:outline-none`"
            :displayValue="(option) => (option ? option.label : '')"
            @change="handleSearch"
            :placeholder="placeholder"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions
            v-if="showOptions"
            class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-gray-100 ring-opacity-5 focus:outline-none sm:text-sm z-50"
          >
            <div
              v-if="isLoading"
              class="relative px-4 py-2 text-gray-500 cursor-default select-none"
            >
              Loading...
            </div>
            <div
              v-else-if="filteredOptions.length === 0"
              class="relative px-4 py-2 text-gray-600 cursor-default select-none"
            >
              No results found.
            </div>
            <ComboboxOption
              v-for="option in filteredOptions"
              :key="option.value"
              v-slot="{ selected, active }"
              :value="option"
            >
              <li
                :class="[
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                  active ? 'bg-primary-300 text-white' : 'text-secondary-500',
                ]"
              >
                <span
                  :class="[
                    'block truncate',
                    selected ? 'font-medium' : 'font-normal',
                  ]"
                >
                  {{ option.label }}
                </span>
                <span
                  v-if="selected"
                  :class="[
                    'absolute inset-y-0 left-0 flex items-center pl-3',
                    active ? 'text-white' : 'text-teal-600',
                  ]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import { TransitionRoot } from "@headlessui/vue";
import { getAllUsers, getCentralAdminUsers } from "~/services/userservices";

const props = defineProps({
  // Initial options that can be provided
  initialOptions: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: null,
  },
  minSearchLength: {
    type: Number,
    default: 2,
  },
  // API endpoint for searching
  apiEndpoint: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Search name...",
  },
});
const authStore = useAuthStore();
const emit = defineEmits(["update:modelValue", "option-selected"]);

// State
const selectedOption = ref(null);
const filteredOptions = ref([...props.initialOptions]);
const isLoading = ref(false);
const showOptions = ref(false);
const searchQuery = ref("");
const searchTimeout = ref(null);

const GetUsersMapper = {
  0: getAllUsers,
  3: getAllUsers,
  4: getAllUsers,
};

// Debounced search handler to prevent too many API calls
const handleSearch = (event) => {
  searchQuery.value = event.target.value;
  showOptions.value = true;

  // Clear previous timeout
  if (searchTimeout.value) clearTimeout(searchTimeout.value);

  // Don't search if query is too short
  if (searchQuery.value.length < props.minSearchLength) {
    filteredOptions.value = [...props.initialOptions];
    return;
  }

  // Set loading state
  isLoading.value = true;

  // Debounce API call (300ms)
  searchTimeout.value = setTimeout(() => {
    fetchSearchResults();
  }, 300);
};
const userParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 15,
  userCategories: authStore?.userInfo?.userCategory === 3 ? [0, 1, 2, 3] : null,
  total: 0,
});
// Fetch results from API
const fetchSearchResults = async () => {
  try {
    const response = await GetUsersMapper[authStore?.userInfo?.userCategory]({
      ...userParams,
      Search: searchQuery.value,
    });
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    // Assuming the API returns an array of { label, value } objects
    filteredOptions.value = response.data.data.map((i) => ({
      label: `${i.firstName} ${i.lastName}`,
      value: i.id,
      email: i.email || i.contactEmail || "",
      firstName: i.firstName,
      lastName: i.lastName,
    }));
  } catch (error) {
    console.error("Error fetching search results:", error);
    filteredOptions.value = []; // Clear options on error
  } finally {
    isLoading.value = false;
  }
};

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedOption.value = newVal;
  }
}, { immediate: true });

// Watch for selection changes
watch(selectedOption, (newVal) => {
  if (newVal) {
    emit("update:modelValue", newVal.value);
    emit("option-selected", newVal);
  }
});
</script>
