<template>
  <div>
    <label
      v-if="label"
      :class="`${classLabel} ${
        horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
      } flex items-center gap-x-1 input-label text-sm !text-[#1B2B41B8]`"
      :for="name"
    >
      {{ label }} <RedDot v-if="isRequired" />
      <span v-if="isOptional" class="text-[#98A2B3]">(Optional)</span>
    </label>

    <Listbox v-model="selectedOption">
      <div class="relative w-full">
        <!-- BUTTON -->
        <ListboxButton
          :class="`${className} ${
            error
              ? 'border-danger-500 ring-danger-500 ring-opacity-90 ring-1'
              : ''
          }`"
          class="relative w-full border border-[#D0D5DD] cursor-default min-h-[42px] bg-white text-left shadow-sm sm:text-[14px] flex items-center rounded-lg"
        >
          <span
            v-if="selectedOption"
            class="px-3 truncate w-[150px] block text-[#101828]"
          >
            {{ selectedOption.name }}
          </span>
          <span v-else class="px-3 text-[#8F8C9A] truncate w-[150px] block">
            {{ placeholder }}
          </span>

          <span class="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon class="h-4 w-4 text-[#3A3745]" />
          </span>
        </ListboxButton>

        <!-- OPTIONS DROPDOWN -->
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute w-full mt-2 z-[999] rounded-lg bg-white text-sm shadow-lg border-b-2 outline-none overflow-hidden"
          >
            <!-- SEARCH BAR -->
            <div class="pb-4 ">
              <input
                class="text-sm  px-3 py-1 h-10 w-full  bg-gray-50 placeholder:text-[#B6B7B9]"
                v-model="search"
                placeholder="Search department"
                type="text"
                autofocus
              />
            </div>

            <!-- OPTIONS -->
            <div
              v-if="!isLoading && options.length"
              class="overflow-auto max-h-60"
            >
              <ListboxOption
                v-for="option in options"
                :key="option.id"
                :value="option"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    active ? 'bg-gray-100' : '',
                    'select-none py-2 px-4 cursor-pointer flex items-center justify-between text-sm',
                  ]"
                >
                  <span :class="selected ? 'font-medium' : 'font-normal'">
                    {{ option.name }}
                  </span>

                  <span v-if="selected" class="pr-4 ">
                    <CheckIcon class="w-4 h-4" />
                  </span>
                </li>
              </ListboxOption>
            </div>

            <!-- EMPTY RESULT -->
            <div
              v-if="!isLoading && !options.length"
              class="py-4 text-center text-sm text-[#667085]"
            >
              Not found
            </div>

            <!-- ADD NEW WHEN NO RESULTS -->
            <span
              v-if="!isLoading && !options.length"
              @click="isOpen = true"
              class="text-[#1570EF] block text-center pb-4 cursor-pointer"
            >
              + Add department
            </span>

            <!-- LOADING -->
            <div
              v-if="isLoading"
              class="py-4 text-center text-sm text-[#667085]"
            >
              Searching...
            </div>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <div v-if="selectedOption" class="flex mt-1 gap-x-4">
      <button @click="isOpen = true" class="text-sm font-medium text-primary-500" type="button">
        Edit
      </button>
      <button
        @click="deleteOpen = true"
        class="text-sm font-medium text-red-500"
        type="button"
      >
        Delete
      </button>
    </div>
    <span v-if="error" class="text-sm text-danger-500">{{ error }}</span>

    <PagesModalsCreateDept
      v-if="isOpen"
      :is-open="isOpen"
      :detail="selectedOption"
      @close="
        () => {
          isOpen = false;
          getData();
        }
      "
    />
  </div>
  <!-- Delete Modal -->
  <DeleteModal
    @deleteItem="handleDelete"
    @close="deleteOpen = false"
    title="Delete department"
    text="Are you sure you want to delete this department? This action cannot be undone."
    :open="deleteOpen"
    btnText="Yes, Delete"
    :loading="deleteloading"
  />
</template>
<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/24/solid";
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
import debounce from "lodash/debounce";
import { deleteDepartment, getDepartments } from "~/services/userservices";

// states
const search = ref("");
const options = ref([]);
const selectedOption = ref(null);
const isOpen = ref(false);
const isLoading = ref(false);
const deleteOpen = ref(false);
const deleteloading = ref(false);
// props
const props = defineProps([
  "label",
  "modelValue",
  "placeholder",
  "className",
  "error",
  "classLabel",
  "isOptional",
  "isRequired",
  "name",
  "horizontal",
]);

// emits
const emits = defineEmits(["update:modelValue", "selectDepartment"]);

// API CALL
const getData = () => {
  isLoading.value = true;
  getDepartments({
    Search: search.value,
    PageNumber: 1,
    PageSize: 100,
  })
    .then((res) => {
      options.value = res.data.data;

      // auto-select matching value
      if (props.modelValue) {
        selectedOption.value = options.value.find(
          (o) => o.name === props.modelValue
        );
      }
    })
    .finally(() => (isLoading.value = false));
};
const handleDelete = async () => {
  // Handle delete logic here

  try {
    deleteloading.value = true;
    await deleteDepartment(selectedOption.value.id).then((res) => {
      if (res.status === 200) {
        toast.success("Department deleted successfully");

        getData();
      }
    });
  } catch (err) {
    toast.error(err.response.data.Message || err.res.data.message);
  } finally {
    deleteloading.value = false;
    deleteOpen.value = false;
  }
};
// DEBOUNCE API SEARCH
const debounceSearch = debounce(() => {
  getData();
}, 500);

watch(search, () => debounceSearch());

// sync external v-model
watch(
  () => props.modelValue,
  (val) => {
    selectedOption.value = options.value.find((o) => o.name === val) || null;
  }
);

// emit selected value
watch(selectedOption, (val) => {
  if (!val) return;
  emits("update:modelValue", val.name);
  emits("selectDepartment", val);
});

// initial fetch
onMounted(() => {
  getData();
});
</script>
