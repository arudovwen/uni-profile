<template>
  <NuxtLayout name="auth">
    <div class="pt-0 lg:pt-0 max-w-[450px] mx-auto items-center grid flex-1">
      <div class="w-full">
        <div class="mb-6 justify-center items-center flex" v-if="isSent">
          <AuthSmsNotificationIcon />
        </div>
        <h1
          :class="`text-[#021242] darks:text-white mb-3 text-3xl font-medium ${
            isSent ? 'text-center' : ''
          }`"
        >
          {{ isSent ? title2 : title1 }}
        </h1>
        <p
          :class="`mb-[30px] text-base text-[#667085] darks:text-white/80 ${
            isSent ? 'text-center' : ''
          }`"
        >
          {{ isSent ? text2 : text1 }}
        </p>
        <form @submit.prevent="onSubmit" v-if="!isSent">
          <div class="mb-5">
            <Textinput
              iconPosition="left"
              iconType="email"
              placeholder=""
              label="Email address"
              type="email"
              v-bind="emailAtt"
              v-model="email"
              :error="errors.email"
            />
          </div>

          <div class="grid gap-y-[22px] mb-9">
            <AppButton
              type="submit"
              :isLoading="isLoading"
              :isDisabled="isLoading || !meta.valid"
              text="Reset Password"
              btnClass="btn-primary !py-3"
              :style="{
                background: isLoading || !meta.valid ? '' : color,
              }"
            />
          </div>
          <NuxtLink
            :to="handleRouting(route, `/auth/login`)"
            class="flex items-center gap-x-2 justify-center mx-auto font-semibold text-sm"
          >
            <AppIcon icon="eva:arrow-back-fill" />
            <span class="font-normal" :style="{ color: color }">
              Back to Login
            </span>
          </NuxtLink>
        </form>
        <div class="pt-5" v-if="isSent">
          <NuxtLink :to="handleRouting(route, `/auth/login`)" class="w-full">
            <AppButton
              text="Return to Login"
              btnClass="btn-primary !py-3 w-full !normal-case"
              :style="{
                background: isLoading || !meta.valid ? '' : color,
              }"
            />
          </NuxtLink>
        </div>
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

const { app } = useRoute().params;
const color = appCodeColorMap[app] || "#1570EF";
const title1 = "Forgot password";
const title2 = "Check your email";
const text1 =
  "Don't worry, it happens to the best of us. Provide your registered email address and we'll get you sorted out.";
const text2 =
  "We have sent an account activation link to your email address. Click on the link to activate your account.";
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

  forgotPassword({ email: encryptedEmail })
    .then((res) => {
      if (res.status === 200) {
        isSent.value = true;
      }
    })
    .catch((err) => {
      isLoading.value = false;
      const message = err?.response?.data?.message || err?.response?.data?.Message;
      if (message) {
        toast.error(message);
      }
    });
});
</script>
