<template>
  <NuxtLayout name="auth">
    <div class="w-full max-w-[400px] mx-auto !font-Avenir">
      <!-- Reset Password Form -->
      <div v-if="!isSent" class="w-full">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <img
            src="@/assets/images/reset-password.png"
            alt="Reset Password"
            class="w-[115px] h-[115px]"
          />
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-semibold text-[#2F2F2F] mb-2">
            {{ title1 }}
          </h1>
          <p class="text-base text-[#5E5E5E] font-[350] max-w-[406px] mx-auto">
            {{ text1 }}
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

          <AppButton
            type="submit"
            text="Continue"
            :isLoading="isLoading"
            :isDisabled="isLoading || !meta.valid"
            btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
          />

          <div class="text-center">
            <NuxtLink
              :to="
                handleRouting(route, `/${auth}/login${app ? `/${app}` : ''}`)
              "
              class="`font-medium text-base !mt-8 block` text-[#475467]"
            >
              Go Back
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Success State -->
      <div v-else class="w-full text-center">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <img
            src="@/assets/images/reset-password.png"
            alt="Reset Password"
            class="w-[115px] h-[115px]"
          />
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-[#2F2F2F] mb-2">
            {{ title2 }}
          </h1>
          <p class="text-base text-[#475467]">
            {{ text2 }}
          </p>
        </div>

        <!-- Return Button -->
        <NuxtLink
          :to="handleRouting(route, `/${auth}/login${app ? `/${app}` : ''}`)"
          class="block"
        >
          <AppButton
            text="Return to Login"
            btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
          />
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
definePageMeta({
  layout: "auth",
  middleware: "auth",
});
import { useForm } from "vee-validate";
import * as yup from "yup";
import { forgotPassword } from "~/services/authservices";
import { useEncryption } from "~/composables/useEncryption";
import { useToast } from "~/composables/useToast";
import SmsNotificationIcon from "~/components/Auth/SmsNotificationIcon.vue";

// Encryption
const { encrypt } = useEncryption();

// Toast
const toast = useToast();

const { app, auth } = useRoute().params;
const title1 = "Reset Password";
const title2 = "Check your email";
const text1 =
  "Provide your registered email address and we would send you a verification code to reset your password";
const text2 =
  "We have sent a password reset link to your email address. Click on the link to reset your password";
const isSent = ref(false);

const isLoading = ref(false);

const formValues = {
  email: "",
};

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

const { handleSubmit, defineField, errors, meta } = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

const [email, emailAtt] = defineField("email");
const route = useRoute();
const router = useRouter();

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;

  // Encrypt email before sending
  const encryptedEmail = encrypt(values.email);

  forgotPassword({ email: encryptedEmail, subApp: app })
    .then((res) => {
      if (res.status === 200) {
        isSent.value = true;
      }
    })
    .catch((err) => {
      isLoading.value = false;
      const message =
        err?.response?.data?.message || err?.response?.data?.Message;
      if (message) {
        toast.error(message);
      }
    });
});
</script>
