<template>
  <Listbox v-model="selectedOption">
    <div class="relative w-full">
      <ListboxButton
        :class="classStyles"
        class="relative w-full cursor-default min-h-[40px] min-w-[100px] bg-white text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-[14px] flex items-center"
      >
        <span class="block text-sm" v-if="selectedOption">
          <div class="text-[#3A3745] flex items-center gap-x-1">
            <span v-if="selectedOption.text1">{{ selectedOption.text1 }}</span
            ><span v-if="selectedOption.text2">-</span>
            <span v-if="selectedOption.text2">{{ selectedOption.text2 }}</span>
          </div></span
        >
        <span class="block text-base text-[#8F8C9A] whitespace-nowrap" v-else>{{
          placeholder
        }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronDownIcon class="h-4 w-4 text-[#3A3745]" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute max-h-60 w-full mt-[.5rem] min-w-[12rem] z-[999] overflow-auto rounded-lg bg-white text-sm shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),_0px_4px_6px_-2px_rgba(16,24,40,0.03)] ring-1 ring-black ring-opacity-5 border-b-2 outline-0 sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="option in options"
            :key="option.name"
            :value="option"
            as="template"
          >
            <li
              :class="[
                active || selected ? '' : '',
                'relative cursor-pointer select-none py-[11px] px-[13px] text-loft-black hover:bg-gray-100',
              ]"
            >
              <p class="text-sm text-[#101828]" v-if="option.text1">
                {{ option.text1 }}
              </p>

              <div class="flex items-center gap-x-1">
                <span class="text-[#667085]" v-if="option.text2">{{
                  option.text2
                }}</span>
                <span class="text-[#667085]" v-if="option.text3">-</span>
                <span class="text-[#667085]" v-if="option.text3">{{
                  option.text3
                }}</span>
              </div>
            </li>
          </ListboxOption>
          <div
            v-if="!options.length"
            class="relative cursor-pointer select-none py-[11px] px-[13px] text-loft-black text-sm text-[#667085]"
          >
            No option
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
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";

const props = defineProps([
  "label",
  "options",
  "id",
  "modelValue",
  "placeholder",
  "classStyles",
]);
const emits = defineEmits(["onGetData", "update:modelValue"]);
const selectedOption = ref(null);
onMounted(() => {
  if (!props.modelValue) return {};
  selectedOption.value = props.options.find((i) => i.id == props.modelValue);
});

watch(selectedOption, () => {
  if (selectedOption.value?.id == null) return;
  emits("onGetData", selectedOption.value, props.id);
  emits("update:modelValue", selectedOption.value.id);
});
watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) return {};
    selectedOption.value = props.options.find((i) => i.id == props.modelValue);
  }
);
watch(
  () => [...props.options],
  () => {
    if (!props.modelValue) return {};
    selectedOption.value = props.options.find((i) => i.id == props.modelValue);
  }
);
</script>
