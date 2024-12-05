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
                class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full"
              >
                <div class="bgc px-6 py-6">
                  <div class="flex justify-between mb-5 items-center">
                    <div class="">
                      <SvgsSuccessSvg v-if="type !== 'reject'" />
                      <SvgsRejectSvg v-if="type === 'reject'" />
                    </div>

                    <span
                      v-if="canClose"
                      @click="handleclose"
                      class="absolute top-3 right-4"
                    >
                      <i
                        class="uil uil-times cursor-pointer text-xl text-[#98A2B3]"
                      ></i>
                    </span>
                  </div>

                  <h4
                    class="font-semibold text-[#101828] text-lg mb-[6px]"
                    v-if="title"
                  >
                    {{ title }}
                  </h4>

                  <p class="text-sm text-[#475467]" v-if="text">
                    {{ text }}
                  </p>

                  <!-- <div class="mt-4" v-if="type === 'reject'">
                    <Textarea v-model="reason" placeholder="Provide a reason" />
                  </div> -->
                  <div class="flex gap-x-4 items-center mt-6">
                    <button
                      v-if="isCancel"
                      type="button"
                      @click="handleclose"
                      class="h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-matta-black hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] font-medium justify-center flex items-center"
                    >
                      Cancel
                    </button>
                    <button
                      v-if="isAnother"
                      type="button"
                      @click="emits('anotherAction')"
                      class="gap-x-2 h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-matta-black hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] font-medium justify-center flex items-center"
                    >
                      {{ anotherText }}
                      <svg
                        v-if="loading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </button>

                    <button
                      v-if="!isOkay"
                      :disabled="loading"
                      type="button"
                      @click="actionItem"
                      class="gap-x-2 h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-white text-sm w-full border font-mediumdisabled:opacity-80 disabled:bg-[#F2F4F7] disabled:border-[#E4E7EC] disabled:text-[#98A2B3] disabled:cursor-not-allowed flex items-center justify-center"
                      :class="
                        type === 'approve'
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-[#D92D20] border-[#D92D20]'
                      "
                    >
                      {{ btnText }}
                      <svg
                        v-if="loading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      v-if="isOkay"
                      :disabled="loading"
                      type="button"
                      @click="actionItem"
                      class="gap-x-2 h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-white text-sm w-full border border-primary-500 font-medium disabled:opacity-50 flex items-center justify-center bg-primary-500"
                    >
                      {{ btnText }}
                      <svg
                        v-if="loading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
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
import Loader from "@/assets/images/loading.svg";

defineProps({
  title: {
    default: "",
  },
  text: { default: "" },
  open: { default: false },
  btnText: { default: "" },
  loading: { default: false },
  type: { default: "" },
  detail: { default: null },
  isCancel: { default: true },
  isOkay: { default: false },
  canClose: { default: true },
  isAnother: { default: false },
  anotherText: {
    default: "Add another",
  },
});
const emits = defineEmits([
  "actionItem",
  "close",
  "anotherAction",
  "getReason",
]);
const reason = ref("");
function actionItem() {
  emits("actionItem");
}
function handleclose() {
  emits("close");
}

const bankOptions = [
  {
    title: "Bank Name",
    key: "bankName",
  },
  {
    title: "Account Name",
    key: "accountName",
  },
  {
    title: "Account Number",
    key: "accountNumber",
  },
  {
    title: "Amount",
    key: "amount",
  },
];
</script>
<style>
.bgc {
  background-image: url("./pattern.png");
  background-repeat: no-repeat;
}
</style>
