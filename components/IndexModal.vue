<template>
  <TransitionRoot as="template" :show="isOpen">
    <div class="fixed z-[999] inset-0 overflow-y-auto">
      <div class="flex justify-center pt-[108px] px-4 pb-20">
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-[#0C111D]/60 transition-opacity backdrop-blur-sm"
          />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="relative bg-white rounded-lg text-left invisible-scrollbar shadow-xl transform transition-all"
          >
            <slot name="content"> </slot>
            <span
              v-if="canClose"
              class="cursor-pointer border w-6 h-6 absolute top-4 right-3 rounded-full flex items-center justify-center"
              @click="togglePopup"
              ><XMarkIcon class="w-4 h-4"
            /></span>
          </div>
        </TransitionChild>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";

defineProps({
  canClose: { default: true },
  isOpen: { default: false },
});

const emit = defineEmits(["togglePopup"]);
const togglePopup = () => emit("togglePopup");
</script>
