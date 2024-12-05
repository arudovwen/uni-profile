<template>
  <Combobox v-model="selected">
    <div class="relative">
      <div
        class="relative w-full cursor-default overflow-hidden rounded-lg bg-white sm:text-sm"
      >
        <ComboboxInput
          placeholder="Search"
          :class="classStyles"
          class="bg-white outline-0 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] w-full rounded-lg py-2 !pl-[42px] placeholder:text-[#667085] border border-[#D0D5DD]"
          :displayValue="(option) => option.name"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          class="absolute inset-y-0 left-[16.5px] flex items-center"
        >
          <SearchIcon class="h-5 w-5 text-[#667085]" aria-hidden="true" />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute mt-1 max-h-60 z-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 outline-0 sm:text-sm"
        >
          <div
            v-if="filteredOptions.length === 0 && query !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
          >
            Nothing found.
          </div>

          <ComboboxOption
            v-for="option in filteredOptions"
            as="template"
            :key="option.id"
            :value="option"
            v-slot="{ selected, active }"
          >
            <span
              :class="[
                active ? 'bg-gray-100' : '',
                'relative cursor-default select-none py-2 pl-[15px] pr-4 text-loft-black hover:bg-gray-50',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
                >{{ option.name }}</span
              >
            </span>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { SearchIcon } from "@heroicons/vue/24/solid";

defineProps(["classStyles"]);
const options = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

let selected = ref("");
let query = ref("");

let filteredOptions = computed(() =>
  query.value === ""
    ? options
    : options.filter((option) =>
        option.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);
</script>
