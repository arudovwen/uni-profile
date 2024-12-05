<template>
  <div class="fixed top-16 w-[600px]">
    <Combobox v-model="selectedOptions" multiple>
      <div
        class="relative mb-5 w-full cursor-default rounded-lg min-h-[44px] border border-[#D0D5DD] bg-white py-2 pl-3 pr-10 text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-sm"
      >
        <ul v-if="selectedOptions.length > 0" class="flex flex-wrap gap-3">
          <li
            class="px-3 py-1 border rounded-full text-XS"
            v-for="option in selectedOptions"
            :key="option.id"
          >
            {{ option.name }}
          </li>
        </ul>
      </div>
      <div class="shadow p-3 rounded-lg">
        <ComboboxInput
          :placeholder="placeholder"
          :displayValue="(option) => option.name"
          class="relative w-full mb-3 cursor-default outline-0 rounded-lg min-h-[44px] border border-[#D0D5DD] bg-white py-2 pl-3 pr-10 text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-sm"
        />
        <ComboboxOptions>
          <ComboboxOption
            v-for="option in options"
            :key="option"
            :value="option"
            :class="[
              selectedOptions.map((i) => i.name).includes(option.name)
                ? 'bg-gray-50'
                : '',
              'relative cursor-default select-none py-2 pl-10 pr-4 text-loft-black hover:bg-gray-50 mb-2 rounded',
            ]"
          >
            <span
              :class="[
                selectedOptions.map((i) => i.name).includes(option.name)
                  ? 'font-medium'
                  : 'font-normal',
                'block truncate',
              ]"
              >{{ option.name }}</span
            >
            <span
              v-if="selectedOptions.map((i) => i.name).includes(option.name)"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/solid";

const emits = defineEmits(["onGetData"]);
const props = defineProps({
  options: {
    type: Array,
  },
  placeholder: {
    default: "Select option",
  },
});

const selectedOptions = ref([props.options[0], props.options[1]]);
// let query = ref("");

// let filteredOptions = computed(() =>
//   query.value === ""
//     ? options
//     : options.filter((option) =>
//         option.name
//           .toLowerCase()
//           .replace(/\s+/g, "")
//           .includes(query.value.toLowerCase().replace(/\s+/g, ""))
//       )
// );

watch(selectedOptions, () => {
  emits("onGetData", selectedOptions.value);
});
</script>
