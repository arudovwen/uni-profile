<template>
  <TransitionRoot as="template" :show="authOpen">
    <Dialog as="div" class="fixed z-[999] inset-0 overflow-y-auto">
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
            class="fixed inset-0 bg-[#222222]/90 transition-opacity"
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
            :class="className"
            class="inline-block relative align-bottom bg-white rounded-lg text-left invisible-scrollbar shadow-xl transform transition-all sm:my-8 sm:align-middle min-w-[500px] p-6 w-full max-w-max max-h-[95vh]"
          >
            <AuthLogin
              @close="
                () => {
                  authOpen = false;
                  cartStore.getMyCart(action, loadData);
                }
              "
              @toggleAuth="(val) => (type = val)"
              :main="false"
              v-if="type === 'login'"
            />
            <AuthVendorSignUp
              :main="false"
              @toggleAuth="(val) => (type = val)"
              v-if="type === 'register'"
              @close="
                () => {
                  authOpen = false;
                  cartStore.getMyCart(action, loadData);
                }
              "
            />

            <span
              v-if="canClose"
              class="cursor-pointer hover:border w-8 h-8 absolute top-[20px] right-[20px] rounded-full bg-[#F5F5F5] flex items-center justify-center z-[999]"
              @click="
                () => {
                  authOpen = false;
                  type = 'login';
                }
              "
            >
              <AppIcon
                icon="heroicons-solid:x"
                class="text-lg text-[#8C8C8C]"
                aria-hidden="true"
              />
            </span>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
} from "@headlessui/vue";

const authOpen = inject("authOpen");
const step = ref(1);
const action = inject("action");
const handleProceed = inject("handleProceed");
const handleOrderRequest = inject("handleOrderRequest");
const type = ref("login");
defineProps({
  canClose: {
    default: true,
  },
  className: {
    default: "",
  },
});

function loadData() {
  action.value === "call" ? handleOrderRequest() : handleProceed();
}
provide("type", type);
provide("step", step);
</script>
