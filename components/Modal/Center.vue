<template>
<div v-if="isOpen">
  <TransitionRoot as="template" :show="isOpen">
    <div
      as="div"
      class="fixed z-[999] inset-0 overflow-y-auto"
     
    >
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
          <div
            class="fixed inset-0 bg-[#0C111D]/60 transition-opacity backdrop-blur-sm"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
    
          <div  :class="className"
            class="inline-block relative align-bottom bg-white rounded-lg text-left invisible-scrollbar shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-max max-h-[95vh] mt-[64px] lg:mt-0"
         
            >
            <slot> </slot>
            <span
              v-if="canClose"
              class="cursor-pointer hover:border w-8 h-8 absolute top-[16px] right-[16px] rounded-full bg-[#F5F5F5] flex items-center justify-center z-[999]"
              @click="isOpen = false"
            >
              <AppIcon icon="heroicons-solid:x" class="text-lg text-[#8C8C8C]" aria-hidden="true" />
            </span>
          </div>
        
      </div>
    </div>
  </TransitionRoot>
</div>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
} from "@headlessui/vue";

const isOpen = inject("isOpen");

defineProps({
  canClose: {
    default: true,
  },
  className:{
    default:""
  }
});
</script>
