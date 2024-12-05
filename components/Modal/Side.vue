<template>
  <TransitionRoot as="template" :show="isSideOpen">
    <Dialog
      as="div"
      class="fixed z-[999] inset-0 overflow-y-auto"
      @close="togglePopup"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
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
            class="fixed inset-0 bg-[#0C111D]/60 transition-opacity"
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
            class="absolute w-full bg-white lg:w-auto lg:min-w-[480px] h-screen top-0 py-6 right-0 align-bottom text-left shadow-xl transform transition-all sm:align-middle"
          >
            <slot name="content"> </slot>
            <span class="cursor-pointer" v-if="canClose" @click="togglePopup"
              ><XMarkIcon
                class="w-6 h-6 absolute top-3 text-gray-600 left-3 z-40"
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
  isSideOpen: {
    default: false,
  },
});
const emit = defineEmits(["togglePopup"]);
function togglePopup() {
  emit("togglePopup");
}
</script>
