<template>
  <div>
    <form
      @submit.prevent="handleSubmit"
      class="min-w-[300px] max-w-[422px] mx-auto px-6 py-6 text-center"
    >
      <div class="mb-8 h-[40px] flex justify-center items-center">
        <AuthSMSStarIcon v-if="isVerified" />
        <AuthSmsNotificationIcon v-else />
      </div>
      <h2 class="text-center font-medium text-[#344054] mb-[6px] text-3xl">
        {{ title }}
      </h2>
      <p class="block text-sm text-center mb-8 text-[#475467]">
        {{ subtext }}
      </p>

      <div class="flex gap-x-2 justify-center mb-8" v-if="!isVerified">
        <v-otp-input
          ref="otpInput"
          v-model:value="form.otp"
          :input-classes="`otp-input w-14 h-14 flex items-center border border-[#D0D5DD] font-normal focus:border-[#4A5578] outline-none mx-1 rounded-md text-center text-2xl placeholder:text-[#D0D5DD]`"
          separator=" "
          :num-inputs="numInput"
          :should-auto-focus="true"
          input-type="letter-numeric"
          :placeholder="['-', '-', '-', '-', '-', '-']"
        />
      </div>
      <div class="flex gap-x-4 mb-1">
        <NuxtLink
          v-if="isVerified"
          :to="continueLink"
          class="border text-[13px] mb-4 border-primary-500 font-medium text-white lg:min-w-[120px] w-full bg-primary-500 rounded-lg px-6 py-2 hover:bg-primary/80 h-11 disabled:opacity-60"
        >
          <span>
            <span>Continue</span>
          </span>
        </NuxtLink>
        <button
          v-else
          type="submit"
          :disabled="isLoading || !form.otp"
          class="border mb-4 border-primary-500 font-medium text-white lg:min-w-[120px] w-full bg-primary-500 rounded-lg px-6 py-3 hover:bg-primary/80 disabled:opacity-60 disabled:bg-[#F2F4F7] disabled:border-[#E4E7EC] disabled:text-[#98A2B3] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
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
      <div class="text-sm mb-8 font-normal" v-if="!isVerified">
        <span>
          Didn't receive the Email,
          <button
            v-if="!isResending"
            class="font-semibold pl-1 text-primary-500"
            @click.prevent="resendOTP"
            :disabled="isResending || countdown > 0"
          >
            Click to resend
          </button>
          <span v-if="countdown > 0" class="ml-2"
            >Resend available in {{ countdown }}s</span
          >
        </span>
      </div>
      <div>
        <button
          class="flex items-center gap-x-2 justify-center mx-auto font-semibold text-sm"
          @click="emit('close')"
        >
          <AppIcon icon="eva:arrow-back-fill" />
          <span class="font-normal"> Back </span>
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import VOtpInput from "vue3-otp-input";
import { resend2FA } from "~/services/authservices";
import { toast } from "vue3-toastify";

const props = defineProps({
  title: {
    default: "Enter your transaction PIN",
  },
  numInput: {
    default: 6,
  },

  isLoading: {
    default: false,
  },
  email: {
    default: "",
  },
  subtext: {
    default:
      "We have sent an OTP to your email address and your registered mobile number",
  },
  isVerified: {
    default: false,
  },
  buttonText: {
    default: "Verify Email",
  },
  continueLink: {
    default: "/",
  },
});
const emit = defineEmits(["handleSubmit", "close"]);

const form = reactive({
  otp: "",
});

const countdown = ref(0);
const isResending = ref(false);

async function handleSubmit() {
  emit("handleSubmit", form.otp);
}
function resendOTP() {
  if (countdown.value === 0) {
    resend2FA({ email: props.email })
      .then((res) => {
        if (res.status === 200) {
          // Start the countdown
          countdown.value = 60;
          isResending.value = true;

          const interval = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
              clearInterval(interval);
              isResending.value = false;
            }
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.Message);
      });

    // Logic to actually resend the OTP can go here
  }
}
</script>
