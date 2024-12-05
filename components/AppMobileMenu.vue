<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[999]" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-y-full"
              enter-to="translate-y-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-y-0"
              leave-to="translate-y-full"
            >
              <DialogPanel
                class="pointer-events-auto relative w-screen max-w-md"
              >
                <div
                  class="flex h-full flex-col overflow-y-scroll bg-[#E7EBEE] gap-y-2 p-2 shadow-xl no-scrollbar"
                >
                  <div
                    class="text-center bg-white rounded-lg flex items-center h-[56px] justify-center relative"
                  >
                    <button
                      type="button"
                      class="text-matta-black outline-none h-auto absolute left-4"
                      @click="
                        () => {
                          open = false
                        }
                      "
                    >
                      <span class="sr-only">Close</span>
                      <AppIcon icon="ph:x" class="h-6 w-6" aria-hidden="true" />
                    </button>

                    <span class="font-medium text-base capitalize">
                    
                         <img
                          src=""
                          width="100"
                          height="26"
                          alt="Matta"
                          class="w-[100px] h-auto mx-auto"
                        />

                    </span>
                  </div>
                  <div class="flex-1"></div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { inject } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

defineProps(["title"]);
const open = inject("open");
</script>
