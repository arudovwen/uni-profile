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
import { confirmEmail } from "~/services/authservices";
import { saveAuthProfile } from "~/utils/saveAuthProfile";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const { auth, app } = route.params;
const authStore = useAuthStore();
const newEmail = useCookie("email", defaultOptions);
const newUserId = useCookie("userId", defaultOptions);

const step = ref(1);
const isLoading = ref(false);
const isVerified = ref(false);
const registeredEmail = ref("");
const registeredUserId = ref("");

const handleSignUpSuccess = async (data: {
  email: string;
  firstName: string;
  userId: string;
}) => {
  registeredEmail.value = data.email;
  registeredUserId.value = data.userId;
  newEmail.value = data.email;
  newUserId.value = data.userId;
  step.value = 2;
};

const handleOtpSubmit = async (code: string) => {
  isLoading.value = true;

  try {
    const res = await confirmEmail(registeredUserId.value, code);

    if (res.status === 200) {
      const userData = res.data?.data || res.data;
      isVerified.value = true;

      // Save user data to store if available
      if (userData) {
        authStore.setLoggedUser(userData);
        authStore.setHasPin(userData.hasTransactionPIN);
        saveAuthProfile(userData);
      }

      // Clear cookies
      newEmail.value = null;
      newUserId.value = null;

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
  registeredUserId.value = "";
};

onMounted(() => {
  if (route.query.step) {
    step.value = Number(route.query.step);
  }

  // If returning with email/userId cookies, show OTP screen
  if (newEmail.value && newUserId.value) {
    registeredEmail.value = newEmail.value;
    registeredUserId.value = newUserId.value;
    step.value = 2;
  }
});
</script>
