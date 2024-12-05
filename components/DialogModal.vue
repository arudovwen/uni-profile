<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="fixed z-[999] inset-0 overflow-y-auto">
      <div
        class="flex items-center md:items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-[#0C111D]/60 transition-opacity backdrop-blur-sm"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
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
            class="inline-block relative align-bottom bg-white min-w-[300px] rounded-lg text-left invisible-scrollbar shadow-xl transform transition-all sm:my-8 sm:align-middle"
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
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
} from "@headlessui/vue";

defineProps({
  canClose: {
    default: true,
  },
  isOpen: {
    default: false,
  },
});

const emit = defineEmits(["togglePopup"]);
function togglePopup() {
  emit("togglePopup");
}
</script>
