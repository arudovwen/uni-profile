<template>
  <!-- Step 1: Login Form -->
  <NuxtLayout v-if="step === 1" name="auth">
    <div class="w-full max-w-[400px] mx-auto font-Avenir">
      <!-- Header -->
      <div class="text-center mb-[41px]">
        <h1 class="text-2xl font-semibold text-[#2F2F2F] mb-2">
          Welcome back! 👋
        </h1>
        <p class="text-base text-[#475467]">
          Login to your account to continue
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-5">
        <TextinputInputField
          v-model="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          :error="errors.email"
        />

        <TextinputInputField
          v-model="password"
          name="password"
          :type="passwordType"
          label="Password"
          placeholder="Enter your password"
          :error="errors.password"
          @toggle-password="togglePassword"
        />

        <NuxtLink
          :to="forgotPasswordLink"
          class="block text-sm font-medium text-[#344054] !mt-4"
        >
          Forgot Password?
        </NuxtLink>

        <AppButton
          type="submit"
          text="Login"
          :isLoading="isLoading"
          :isDisabled="isLoading || !meta.valid"
          btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
        />

        <p class="text-center text-sm text-[#475467] !mt-8">
          Don't have an account?
          <NuxtLink :to="signUpLink" class="font-semibold text-[#0058E5]">
            Sign Up
          </NuxtLink>
        </p>
      </form>
    </div>
  </NuxtLayout>

  <!-- Step 2: OTP Verification -->
  <NuxtLayout v-else-if="step === 2" name="auth">
    <AuthOtp
      :title="isVerified ? 'OTP Verified' : 'OTP Verification'"
      :subtext="otpSubtext"
      :imgSrc="otpImg"
      :isVerifyPin="isVerifyPin"
      :isVerified="false"
      :isLoading="isLoading"
      :email="formValues.email"
      buttonText="Verify Email"
      continue-link="/vendor/dashboard"
      @close="resetToStep1"
      @handleSubmit="handleOtpSubmit"
    />
  </NuxtLayout>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { saveAuthProfile } from "~/utils/saveAuthProfile";
import { loginUser, loginUser2FA } from "~/services/authservices";
import { useEncryption } from "~/composables/useEncryption";
import { useToast } from "~/composables/useToast";
import otpImg from "@/assets/images/otp.png";

// Encryption
const { encrypt } = useEncryption();

// Toast
const toast = useToast();

// Stores & Router
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Route params
const { app, auth } = route.params;

// State
const step = ref(1);
const isLoading = ref(false);
const isVerified = ref(false);
const isVerifyPin = ref(false);
const passwordType = ref("password");
const formValues = reactive({
  email: "",
  password: "",
  appCode: app,
});

// Computed
const forgotPasswordLink = computed(() =>
  handleRouting(route, `/${auth}/forgot-password${app ? `/${app}` : ""}`)
);

const signUpLink = computed(() =>
  handleRouting(route, `/${auth}/register${app ? `/${app}` : ""}`)
);

const otpSubtext = computed(() =>
  isVerified.value
    ? "Your email has been verified. You will be automatically redirected to the dashboard"
    : "Enter the 6-digit code sent to your registered email address. Check your inbox."
);

// Validation
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup.string().required("Password is required"),
});

const { handleSubmit, defineField, errors, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: formValues,
  mode: "onBlur",
});

const [email] = defineField("email");
const [password] = defineField("password");

// Methods
const togglePassword = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

const resetToStep1 = () => {
  step.value = 1;
  isLoading.value = false;
  resetForm();
};

const handleFinalRedirect = (data) => {
  if (route.query.continue || app) {
    handleRedirect(route, data, app);
    return;
  }
  toast.success("Login successful");
  isLoading.value = false;
  window.location.replace(intialRoute[data?.userCategory]);
};

const handleLoginError = (err, email) => {
  isLoading.value = false;
  const data = err?.response?.data;
  if (!data) return;

  const message = data.message || data.Message;
  if (message) {
    toast.error(message);
    if (message.includes("Email has not verified yet")) {
      router.push(
        `/auth/${app ? `/${app}` : ""}?email=${encodeURIComponent(
          email
        )}&step=2`
      );
    }
  }
};

const onSubmit = handleSubmit(async (values) => {
  formValues.email = values.email;
  formValues.password = values.password;
  isLoading.value = true;

  try {
    // Encrypt sensitive fields
    const encryptedEmail = encrypt(values.email);
    const encryptedPassword = encrypt(values.password);

    const res = await loginUser({
      email: encryptedEmail,
      password: encryptedPassword,
      appCode: app,
    });
    if (res.status === 200) {
      const userData = res.data.data;
      if (!userData.is2FA && app) {
        authStore.setLoggedUser(userData);
        saveAuthProfile(userData);
        handleFinalRedirect(userData);
      } else {
        isVerifyPin.value = true;
        step.value = 2;
        isLoading.value = false;
      }
    }
  } catch (err) {
    handleLoginError(err, values.email);
  }
});

const handleOtpSubmit = async (token) => {
  isLoading.value = true;

  try {
    const encryptedEmail = encrypt(formValues.email);

    const res = await loginUser2FA({
      token,
      email: encryptedEmail,
      appCode: app,
    });
    if (res.status === 200) {
      const userData = res.data.data;
      authStore.setLoggedUser(userData);
      saveAuthProfile(userData);
      handleFinalRedirect(userData);
    }
  } catch (err) {
    isLoading.value = false;
    const data = err?.response?.data;
    const message = data?.message || data?.Message;
    if (message) {
      toast.error(message);
      if (message.includes("Email has not verified yet")) {
        router.push(
          `/auth/register?email=${encodeURIComponent(formValues.email)}`
        );
      }
    }
  }
};
</script>
