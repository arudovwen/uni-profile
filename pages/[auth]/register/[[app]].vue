<template>
  <!-- Step 1: Sign Up Form -->
  <NuxtLayout name="auth" v-if="step === 1">
    <div class="w-full max-w-[440px] mx-auto">
      <AuthSignUpForm
        @registered="handleSignUpSuccess"
      />
    </div>
  </NuxtLayout>

  <!-- Step 2: Email Verification (OTP) -->
  <NuxtLayout name="empty" v-else-if="step === 2">
    <AuthOtp
      title="Account Verification"
      buttonText="Verify Code"
      :isLoading="isLoading"
      :isVerified="isVerified"
      :email="registeredEmail"
      continueLink="/"
      @handleSubmit="handleOtpSubmit"
      @close="goBackToSignUp"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { toast } from "vue3-toastify";
import { confirmRegister } from "~/services/authservices";
import { saveAuthProfile } from "~/utils/saveAuthProfile";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const { auth, app } = route.params;
const authStore = useAuthStore();
const newEmail = useCookie("email", defaultOptions);

const step = ref(1);
const isLoading = ref(false);
const isVerified = ref(false);
const registeredEmail = ref("");

const handleSignUpSuccess = async (data: {
  email: string;
  firstName: string;
}) => {
  registeredEmail.value = data.email;
  newEmail.value = data.email;
  step.value = 2;
};

const handleOtpSubmit = async (code: string) => {
  isLoading.value = true;

  try {
    const res = await confirmRegister({
      code,
      otpCode: code,
      email: registeredEmail.value,
    });

    if (res.status === 200) {
      const userData = res.data.data;
      isVerified.value = true;

      // Save user data to store
      authStore.setLoggedUser(userData);
      authStore.setHasPin(userData.hasTransactionPIN);
      saveAuthProfile(userData);
      newEmail.value = null;

      // Navigate to onboarding
      setTimeout(() => {
        router.push(`/${auth}/onboarding/select-apps`);
      }, 1000);
    }
  } catch (err) {
    isLoading.value = false;
    const message =
      err?.response?.data?.message || err?.response?.data?.Message;
    if (message) {
      toast.error(message);
    }
  }
};

const goBackToSignUp = () => {
  step.value = 1;
  registeredEmail.value = "";
};

onMounted(() => {
  if (route.query.step) {
    step.value = Number(route.query.step);
  }

  // If returning with email cookie, show OTP screen
  if (newEmail.value) {
    registeredEmail.value = newEmail.value;
    step.value = 2;
  }
});
</script>
