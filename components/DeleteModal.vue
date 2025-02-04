<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="handleclose">
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
                class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full"
              >
                <div class="bg-white px-6 py-6">
                  <div class="flex justify-between mb-5 items-center">
                    <div>
                      <img alt="delete" :src="imgUrl" />
                    </div>
                    <span @click="handleclose" class="absolute top-3 right-3">
                      <i
                        class="uil uil-times cursor-pointer text-lg text-[#98A2B3]"
                      ></i>
                    </span>
                  </div>

                  <h4 class="font-semibold text-[#101828] text-lg" v-if="title">
                    {{ title }}
                  </h4>

                  <p class="text-sm text-[#475467]" v-if="text">
                    {{ text }}
                  </p>

                  <div class="flex gap-x-4 items-center mt-6">
                    <button
                      type="button"
                      @click="handleclose"
                      class="appearance-none leading-none px-4 py-[10px] rounded-lg text-matta-black hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] font-medium"
                    >
                      Cancel
                    </button>

                    <button
                      :disabled="loading"
                      type="button"
                      @click="deleteItem"
                      class="appearance-none leading-none px-4 py-[10px] rounded-lg text-white bg-[#D92D20] text-sm w-full border border-[#D92D20] font-medium disabled:opacity-50"
                    >
                      {{ btnText }}
                    </button>
                  </div>
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
  title: {
    default: "",
  },
  text: {
    default: "",
  },
  open: {
    default: false,
  },
  btnText: {
    default: "",
  },

  loading: {
    default: false,
  },
  imgUrl: {
    default: "/images/delete.svg",
  },
});
const emits = defineEmits(["deleteItem", "close"]);

function deleteItem() {
  emits("deleteItem");
}
function handleclose() {
  emits("close");
}
</script>
