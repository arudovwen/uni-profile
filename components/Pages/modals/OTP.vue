<template>
  <ModalCenterProp :is-modal-open="isVerifyPin" @close="emit('close')">
    <form
      @submit.prevent="handleSubmit"
      class="min-w-[300px] mx-auto px-6 py-6"
    >
      <div class="mb-4">
        <img alt="check" src="/images/pin.svg" class="block mx-auto" />
      </div>
      <p class="block text-base font-semibold text-center mb-4">
        {{ title }}
      </p>

      <div class="flex gap-x-2 justify-center mb-7">
        <v-otp-input
          ref="otpInput"
          v-model:value="form.otp"
          :input-classes="`otp-input w-12 h-12 flex items-center border border-[#344054] focus:border-matta-black/50 outline-none mx-1 rounded-md text-center text-sm `"
          separator=" "
          :num-inputs="numInput"
          :should-auto-focus="true"
          input-type="letter-numeric"
          :conditionalClass="['one', 'two', 'three', 'four']"
          :placeholder="['', '', '', '']"
        />
      </div>
      <div class="flex gap-x-4">
        <button
          type="button"
          @click="emit('close')"
          class="h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-matta-black hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] font-medium justify-center flex items-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isLoading || !form.otp"
          class="border text-[13px] mb-4 border-primary- uppercase text-white lg:min-w-[120px] w-full bg-primary-500 rounded-lg px-6 py-2 hover:bg-primary/80 h-11 disabled:opacity-60"
        >
          <span>
            <span
              class="flex gap-x-4 justify-center items-center"
              v-if="isLoading"
              ><span> Processing...</span>
              <i
                v-if="isLoading"
                class="fa fa-spinner fa-spin text-white"
                aria-hidden="true"
              ></i
            ></span>
            <span v-else>{{ buttonText }}</span>
          </span>
        </button>
      </div>
    </form>
  </ModalCenterProp>
</template>
<script setup>
import VOtpInput from "vue3-otp-input";

defineProps({
  title: {
    default: "Enter your transaction PIN",
  },
  numInput: {
    default: 4,
  },
  isVerifyPin: {
    default: false,
  },
  buttonText: {
    default: "Verify Pin",
  },
  isLoading:{
    default:false
  }
});
const emit = defineEmits(["handleSubmit", "close"]);

const form = reactive({
  otp: "",
});

async function handleSubmit() {
  emit("handleSubmit", form.otp);
}
</script>
