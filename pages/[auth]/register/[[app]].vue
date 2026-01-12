<template>
  <!-- Step 1: Sign Up Form -->
  <NuxtLayout name="auth" v-if="step === 1">
    <div class="w-full max-w-[440px] mx-auto">
      <AuthSignUpForm @registered="handleSignUpSuccess" />
    </div>
  </NuxtLayout>

  <!-- Step 2: Email Verification (OTP) -->
  <NuxtLayout name="auth" v-else-if="step === 2">
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
import { confirmEmail } from "~/services/authservices";
import { saveAuthProfile } from "~/utils/saveAuthProfile";
import { useToast } from "~/composables/useToast";
import { useOnboarding } from "~/composables/useOnboarding";

definePageMeta({
  middleware: "auth",
});

// Toast
const toast = useToast();

const route = useRoute();
const router = useRouter();
const { auth, app } = route.params;
const authStore = useAuthStore();
const newEmail = useCookie("email", defaultOptions);
const { setSlug } = useOnboarding();

// Get slug from URL params
const slug = computed(() => (route.query.slug as string) || null);

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
    const res = await confirmEmail(registeredEmail.value, code);

    if (res.status === 200) {
      const userData = res.data?.data || res.data;

      // Save user data to store if available
      if (userData) {
        authStore.setLoggedUser(userData);
        authStore.setHasPin(userData.hasTransactionPIN);
        saveAuthProfile(userData);
      }

      // Clear cookies
      newEmail.value = null;

      // Store slug in onboarding state
      setSlug(slug.value);

      // Navigate to onboarding with slug param immediately
      const query = slug.value ? { slug: slug.value } : {};
      router.push({ path: `/${auth}/onboarding/select-apps`, query });
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
  newEmail.value = null;
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
