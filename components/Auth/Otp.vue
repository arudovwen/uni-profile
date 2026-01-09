<template>
  <div class="w-full font-Avenir flex flex-col items-center">
    <form
      @submit.prevent="handleSubmit"
      class="w-full text-center max-w-[400px]"
    >
      <!-- Icon -->
      <div class="mb-8 flex justify-center items-center">
        <AuthSMSStarIcon v-if="isVerified" class="w-20 h-20" />
        <img
          v-else
          :src="iconSrc"
          alt="Verification"
          class="w-[115px] h-[115px]"
        />
      </div>

      <!-- Header -->
      <h2 class="text-2xl font-semibold text-[#2F2F2F] mb-2">
        {{ title }}
      </h2>
      <p class="text-base text-[#5E5E5E] font-[350] mb-8 max-w-[406px] mx-auto">
        {{ subtext }}
      </p>

      <!-- OTP Input -->
      <div class="flex justify-center mb-8 gap-x-2" v-if="!isVerified">
        <v-otp-input
          ref="otpInput"
          v-model:value="form.otp"
          :input-classes="`otp-input w-14 h-14 flex items-center border border-[#D0D5DD] font-normal focus:border-[#1570EF] outline-none mx-1 rounded-md text-center text-2xl placeholder:text-[#D0D5DD]`"
          separator=" "
          :num-inputs="numInput"
          :should-auto-focus="true"
          input-type="letter-numeric"
          :placeholder="['-', '-', '-', '-', '-', '-']"
        />
      </div>

      <!-- Resend Code -->
      <div class="mb-6 text-sm text-[#475467] font-normal" v-if="!isVerified">
        <span
          >Didn't receive code.
          {{ `${isResending || countdown > 0 ? "Resend in " : ""}` }}</span
        >
        <button
          v-if="!isResending"
          type="button"
          class="font-semibold text-[#1570EF] hover:underline disabled:opacity-50"
          @click.prevent="resendOTP"
          :disabled="isResending || countdown > 0"
        >
          Resend code
        </button>
        <span v-if="countdown > 0" class="font-semibold text-[#1570EF]">
          {{ countdown }}s
        </span>
      </div>

      <!-- Buttons -->
      <div class="mb-4">
        <NuxtLink v-if="isVerified" :to="continueLink" class="block">
          <AppButton
            text="Continue"
            btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
          />
        </NuxtLink>
        <AppButton
          v-else
          type="submit"
          :text="buttonText"
          :isLoading="isLoading"
          :isDisabled="isLoading || !form.otp"
          btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
        />
      </div>

      <!-- Back Link -->
      <button
        type="button"
        class="text-base font-medium text-[#475467] hover:text-[#1570EF]"
        @click="emit('close')"
      >
        Go Back
      </button>
    </form>
  </div>
</template>

<script setup>
import VOtpInput from "vue3-otp-input";
import { resendEmailVerification } from "~/services/authservices";
import { useToast } from "~/composables/useToast";
import defaultEmailVerifyImg from "@/assets/images/email-verify.png";

// Toast
const toast = useToast();

const props = defineProps({
  title: {
    default: "Account Verification",
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
      "Enter the 6-Digit verification code that has been sent to your registered email address. Check your Inbox.",
  },
  isVerified: {
    default: false,
  },
  buttonText: {
    default: "Verify Code",
  },
  continueLink: {
    default: "/",
  },
  imgSrc: {
    type: String,
    default: "",
  },
});

// Computed icon source - use custom image or default
const iconSrc = computed(() => props.imgSrc || defaultEmailVerifyImg);
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
    resendEmailVerification(props.email)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Verification code sent successfully");
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
        toast.error(
          err?.response?.data?.Message || err?.response?.data?.message
        );
      });
  }
}
</script>
