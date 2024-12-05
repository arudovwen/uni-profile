<template>
  <Listbox as="div" v-model="selectedoption" class="relative">
    <ListboxButton
      class="border border-[#D0D5DD] bg-white rounded-lg px-[14px] py-[11px] text-sm capitalize min-w-[100px] flex gap-x-2 items-center"
    >
    <AppIcon icon="fluent:filter-28-filled" iconClass="text-xl"  />   <span v-if="selectedoption?.label" class="text-sm"> {{ selectedoption?.label }}</span>
      <span class="flex gap-x-1 items-center whitespace-nowrap text-sm" v-else
        >
        {{ title }}</span
      >
    </ListboxButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ListboxOptions
        class="absolute z-[999] bg-white shadow-[5px_12px_35px_rgba(44,44,44,0.12)] py-2 right-0 min-w-[180px] rounded-xl overflow-hidden flex flex-col mt-1"
      >
        <ListboxOption
          v-for="option in options"
          :key="option.key"
          :value="option"
          class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap capitalize"
        >
          {{ option.label }}
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup>
import AppIcon from "~/components/AppIcon";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ref, defineEmits, defineProps, watch, onMounted } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    default: "",
  },
  title: {
    default: "Filters",
  },
});

const selectedoption = ref("");
onMounted(() => {
  if (props.modelValue) {
    selectedoption.value = props.options.find(
      (i) => i.value === props.modelValue
    );
  }
});
watch(selectedoption, () => {
  emit("update:modelValue", selectedoption.value?.value);
});
</script>
