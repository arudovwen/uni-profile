<template>
  <Listbox v-model="selectedoption">
    <div class="relative w-full" :class="containerStyle">
      <ListboxButton
        :class="classStyles"
        class="relative w-full cursor-default rounded-full min-h-[40px] border border-[#D0D5DD] bg-white p-6 pr-8 text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-[14px] flex items-center"
      >
        <span class="block text-[#101828] text-[14px]" v-if="selectedoption">{{
          selectedoption.name
        }}</span>

        <span class="block text-[#8F8C9A] text-[14px]" v-else>{{
          placeholder
        }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <i class="uil uil-angle-down absolute right-2 appearance-none"></i>
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div>
          <ListboxOptions
            class="absolute mt-1 w-full border border-gray-200 z-40 rounded-lg bg-white py-4 text-xs shadow-lg ring-1 ring-black ring-opacity-5 outline-0 sm:text-[13px]"
          >
            <div
              class="relative flex items-center mb-2 mt-3 px-4"
              v-if="showSearch"
            >
              <input
                v-model="query"
                placeholder="Search"
                class="text-xs rounded-lg px-3 py-1 h-10 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
              />
            </div>
            <div class="max-h-60 overflow-y-auto py-2 px-3">
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="option in filteredOption"
                :key="option.name"
                :value="option"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-gray-100' : '',
                    'relative select-none py-2 px-2 rounded text-loft-black hover:bg-gray-100 cursor-pointer',
                  ]"
                >
                  <span
                    :class="[selected ? 'font-medium' : 'font-normal', 'block']"
                    class="sm:text-[13px] leading-normal"
                    >{{ option.name }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-700"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
              <div
                class="text-sm text-center text-gray-400"
                v-if="!filteredOption.length"
              >
                No options available
              </div>
            </div>
          </ListboxOptions>
        </div>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, computed, onMounted } from "vue";
import {
  Listbox,
  // ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/solid";

onMounted(() => {
  if (props.value) {
    selectedoption.value = props.options.find((item) => {
      return item.value == props.value;
    });
  }
});
const emits = defineEmits(["onGetData"]);
const props = defineProps({
  options: {
    type: Array,
  },
  placeholder: {
    default: "Select",
  },
  classStyles: {
    type: String,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  value: {
    default: "",
  },
  containerStyle: {
    type: String,
  },
});
const selectedoption = ref(null);
const query = ref("");
const filteredOption = computed(() => {
  if (!query.value) return props.options;

  return props.options.filter((item) => {
    return item.name.toLowerCase().includes(query.value.toLowerCase());
  });
});
watch(
  () => props.value,

  () => {
    if (props.value) {
      selectedoption.value = props.options.find((item) => {
        return item.value.toLowerCase() == props.value.toLowerCase();
      });
    }
  }
);
watch(selectedoption, () => {
  if (selectedoption.value) {
    emits("onGetData", selectedoption.value);
  }
});
</script>
