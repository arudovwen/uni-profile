<template>
  <NuxtLayout name="auth">
    <div v-if="isVerified" class="w-full font-Avenir">
      <!-- Icon -->
      <div class="flex justify-center mb-8">
        <img
          v-if="!isResetSuccess"
          src="@/assets/images/set-password.png"
          alt="Set Password"
          class="w-[115px] h-[115px]"
        />
        <CircleTick v-else />
      </div>

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[#2F2F2F] mb-2">
          {{ isResetSuccess ? "Password Reset" : "Set password" }}
        </h1>
        <p class="text-base font-[350] !text-[#475467]">
          {{
            isResetSuccess
              ? "Your password has been successfully reset. You will be automatically redirected to the login page"
              : "Set a new password for your account"
          }}
        </p>
        <p class="text-base font-[350] !text-[#475467] mt-2">
          {{
            isResetSuccess
              ? ""
              : "Password should be at least 8 characters long with at least a uppercase, lower case, number and special character"
          }}
        </p>
      </div>

      <!-- Form -->
      <form v-if="!isResetSuccess" @submit.prevent="onSubmit" class="space-y-5">
        <TextinputInputField
          v-model="password"
          name="password"
          :type="passwordType"
          label="New Password"
          placeholder="Enter your new password"
          :error="errors.password"
          @toggle-password="togglePasswordVisibility"
        />

        <TextinputInputField
          v-model="confirmPassword"
          name="confirmPassword"
          :type="confirmPasswordType"
          label="Confirm Password"
          placeholder="Confirm your new password"
          :error="errors.confirmPassword"
          @toggle-password="toggleConfirmPasswordVisibility"
        />

        <!-- Resend OTP -->
        <!-- <div class="text-sm text-[#475467] font-normal">
          <span>Didn't receive code. </span>
          <button
            v-if="!isResending"
            type="button"
            class="font-semibold text-[#1570EF] hover:underline disabled:opacity-50"
            @click.prevent="resendOtp"
            :disabled="isResending || countdown > 0"
          >
            Resend code
          </button>
          <span v-if="countdown > 0" class="font-semibold text-[#1570EF]">
            Resend available in {{ countdown }}s
          </span>
        </div> -->

        <AppButton
          type="submit"
          text="Set Password"
          :isLoading="isLoading"
          :isDisabled="isLoading || !meta.valid"
          btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
        />
      </form>

      <!-- Success State -->
      <div v-else class="space-y-4">
        <AppButton
          text="Continue"
          :isLoading="isLoading"
          :isDisabled="isLoading"
          btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
        />
      </div>

      <!-- Back Link -->
      <div class="text-center mt-6">
        <NuxtLink
          :to="`/auth/login${app ? `/${app}` : ''}`"
          class="text-base font-medium text-[#475467] hover:text-[#1570EF]"
        >
          Go Back
        </NuxtLink>
      </div>
    </div>
    <AuthOtp
      v-else
      :title="isVerified ? 'Email Verified' : 'Email Verification'"
      :isVerifyPin="isVerifyPin"
      :isVerified="isVerified"
      @close="() => {}"
      :subtext="
        isVerified
          ? 'Your OTP has been verified. You will be automatically redirected to the dashboard'
          : 'Enter the  6-Digit verification code has been sent to your registered email address. Check your inbox.'
      "
      buttonText="Verify OTP"
      @handleSubmit="verifyOtp"
      :isLoading="isLoading"
      :email="formValues.email"
    />
  </NuxtLayout>
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import {
  loginUser2FA,
  resend2FA,
  resetPassword,
} from "~/services/authservices";
import TickCircle from "@/assets/images/svgs/tick-circle.svg";
import SecuritySafeIcon from "~/components/Auth/SecuritySafeIcon.vue";
import CircleTick from "~/components/Auth/CircleTick.vue";

definePageMeta({
  middleware: "auth",
});
useHead({
  title: "Reset password | MATTA",
});

const isVerifyPin = ref(false);
const isLoading = ref(false);
const isResetSuccess = ref(false);
const isVerified = ref(true);
const route = useRoute();
const router = useRouter();
const countdown = ref(0);
const isResending = ref(false);
const passwordType = ref("password");
const confirmPasswordType = ref("password");

const formValues = {
  confirmPassword: "",
  password: "",
  token: route.query.code,
  email: route.query.email,
};
const { app } = route.params;
const { appCode, usercategory } = route.query;
const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const { handleSubmit, defineField, errors, meta } = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

const [password, passwordAtt] = defineField("password");
const [confirmPassword, confirmPasswordAtt] = defineField("confirmPassword");

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordType.value =
    confirmPasswordType.value === "password" ? "text" : "password";
};

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  resetPassword(values)
    .then((res) => {
      if (res.status === 200) {
        isResetSuccess.value = true;

        toast.success("Password Reset successful");
        !appCode
          ? router.push(`/auth/login`)
          : handleResetRedirect(usercategory, appCode);
      }
    })

    .catch((err) => {
      isLoading.value = false;
      if (err?.response?.data?.message || err?.response?.data?.Message) {
        toast.error(
          err?.response?.data?.message || err?.response?.data?.Message
        );
      }
    });
});

const verifyOtp = (token) => {
  isLoading.value = true;

  loginUser2FA({ token, email: formValues.email })
    .then((res) => {
      isLoading.value = false;
      if (res.status === 200) {
        isVerified.value = true;
      }
    })

    .catch((err) => {
      isLoading.value = false;

      if (!err?.response?.data) return;
      const { data } = err.response;
      if (data?.message || data?.Message) {
        toast.error(data?.message || data?.Message);
      }
    });
};

function resendOtp() {
  if (countdown.value === 0) {
    resend2FA({ email: route.query.email })
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
