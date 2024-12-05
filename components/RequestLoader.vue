<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-[999]" @close="handleclose">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-[#222222]/60 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div
            class="flex items-center justify-center min-h-full p-4 text-center sm:p-0"
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
                class="relative bg-white rounded-lg shadow-xl transform transition-all sm:my-8 h-[180px] w-40 flex items-center justify-center"
              >
                <div class="bg-white px-6 py-6">
                  <div class="loader-container mb-10">
                    <div
                      class="loader border-t-8 border-blue-500 border-solid rounded-full h-16 w-16 animate-spin"
                    ></div>
                  </div>

                  <p class="text-sm text-[#475467] text-center font-semibold">
                    {{ loaderText }}
                  </p>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

defineProps({
  loaderText: { default: "Loading" },
  open: { default: false },
});
const emits = defineEmits(["actionItem", "close"]);

function actionItem() {
  emits("actionItem");
}
function handleclose() {
  emits("close");
}
</script>
