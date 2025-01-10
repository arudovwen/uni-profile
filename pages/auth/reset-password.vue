<template>
  <NuxtLayout name="empty">
    <div
      v-if="isVerified"
      class="min-w-[300px] px-6 py-6 text-center flex flex-row justify-center items-center"
    >
      <div class="min-w-[320px] lg:w-[40vw] max-w-[424px]">
        <div class="w-full flex justify-center items-center">
          <CircleTick v-if="isResetSuccess" />
          <SecuritySafeIcon v-else />
        </div>
        <h1
          class="text-[#182230] darks:text-white mb-[10px] mt-4 text-[30px] font-bold text-center"
        >
          Reset Password
        </h1>
        <p
          class="mb-[40px] text-[14px] w-full text-[#666] darks:text-white/80 text-center"
        >
          {{
            isResetSuccess
              ? "Your password has been successfully reset. You will be automatically redirected to the login page"
              : "Set your new password"
          }}
        </p>
        <form v-if="!isResetSuccess" @submit.prevent="onSubmit">
          <div class="mb-5">
            <Textinput
              hasicon
              placeholder=""
              label="New Password"
              type="password"
              v-model="password"
              v-bind="passwordAtt"
              :error="errors.password"
              icon-position="left"
              iconType="password"
            />
          </div>
          <div class="mb-6">
            <Textinput
              hasicon
              placeholder=""
              label="Confirm Password"
              type="password"
              v-model="confirmPassword"
              v-bind="confirmPasswordAtt"
              :error="errors.confirmPassword"
              icon-position="left"
              iconType="password"
            />
          </div>

          <div class="grid gap-y-[22px] mb-9">
            <AppButton
              type="submit"
              :isLoading="isLoading"
              :isDisabled="isLoading || !meta.valid"
              text="Set Password"
              btnClass="btn-primary !py-3"
            />
          </div>
        </form>
        <div v-else class="grid gap-y-[22px] mb-9">
          <AppButton
            type="submit"
            :isLoading="isLoading"
            :isDisabled="isLoading"
            text="Continue"
            btnClass="btn-primary !py-3"
          />
        </div>
        <NuxtLink
          :to="`/auth/login${app ? `/${app}`:''}`"
          class="flex items-center gap-x-2 justify-center mx-auto font-semibold text-sm"
          @click="emit('close')"
        >
          <AppIcon icon="eva:arrow-back-fill" />
          <span class="font-normal"> Back to Login </span>
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
  title: "Reset password | Deltalog",
});

const isVerifyPin = ref(false);
const isLoading = ref(false);
const isResetSuccess = ref(false);
const isVerified = ref(false);
const route = useRoute();
const router = useRouter();
const formValues = {
  confirmPassword: "",
  password: "",
  token: route.query.code,
  email: route.query.email,
};
const { app } = route.params;
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

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  resetPassword(values)
    .then((res) => {
      if (res.status === 200) {
        isResetSuccess.value = true;

        setTimeout(() => {
          toast.success("Password Reset successful");
          router.push(`/auth/login${app ? `/${app}`:''}`);
        }, 2000);
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

onMounted(() => {
  console.log("Ypp");

  resend2FA({ email: route.query.email }).then((res) => {
    if (res.status === 200) {
    }
  });
});
</script>
