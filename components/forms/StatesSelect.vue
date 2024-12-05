<template>
  <Listbox v-model="selectedOption">
    <div class="relative w-full">
      <ListboxButton
        :class="classStyles"
        class="rounded-lg px-[14px] py-[10px] h-11 w-full border  placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
      >
        <span class="text-sm" v-if="selectedOption">
          <div class="text-[#3A3745] flex items-center gap-x-1">
            <span class="truncate ..." v-if="selectedOption">{{
              selectedOption.name
            }}</span>
          </div></span
        >
        <span
          class="block text-base text-[#8F8C9A] whitespace-nowrap truncate ..."
          v-else
          >{{ placeholder }}</span
        >
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 w-full min-w-[320px] border border-gray-200 z-40 rounded-lg bg-white py-6 text-xs shadow-lg ring-1 ring-black ring-opacity-5 outline-0 sm:text-[13px]"
        >
          <div class="relative flex items-center mb-3 mt-3 px-4">
            <input
              v-model="query"
              placeholder="Search"
              class="text-xs rounded-lg px-3 py-1 h-10 w-full border  placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
            />
          </div>
          <div class="max-h-60 overflow-y-auto py-2">
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="z in filteredStates"
              :key="z"
              :value="z"
              as="template"
            >
              <span
                :class="[
                  active || selected ? 'bg-gray-50' : '',
                  'relative cursor-pointer select-none py-[11px] px-[20px] text-loft-black hover:bg-gray-100 flex items-center justify-between',
                ]"
              >
                <p class="text-sm text-[#101828] capitalize">
                  {{ z.name }}
                </p>
                <i class="uil uil-check text-[#101828]" v-show="selected"></i>
              </span>
            </ListboxOption>
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
<script setup>
import {
  Listbox,
  // ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ref, defineProps, defineEmits, watch, onMounted, computed } from "vue";

const props = defineProps([
  "label",
  "id",
  "modelValue",
  "placeholder",
  "classStyles",
  "states",
]);
const emits = defineEmits(["update:modelValue"]);
const selectedOption = ref(null);

onMounted(() => {
  if (!props.modelValue) return {};
  selectedOption.value = props.states.find((i) => i.name == props.modelValue);
});
const query = ref("");
const filteredStates = computed(() => {
  if (!query.value.length) return props.states;
  return props.states.filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase())
  );
});
watch(selectedOption, () => {
  if (selectedOption.value?.name == null) return;

  emits("update:modelValue", selectedOption.value.name);
});
watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) return {};
    selectedOption.value = props.states.find((i) => i.name == props.modelValue);
  }
);
watch(
  () => [...props.states],
  () => {
    if (!props.modelValue) return {};
    selectedOption.value = props.states.find((i) => i.name == props.modelValue);
  }
);
</script>
