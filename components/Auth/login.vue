<template>
  <NuxtLayout v-if="step === 1" name="auth">
    <div v-if="step === 1" class="pt-10 lg:pt-0 w-full lg:w-[450px] mx-auto ">
      <h1
        class="text-[#182230] darks:text-white mb-4 text-3xl font-medium w-full"
      >
        Log In {{ AppsObject[app]?.label ?? "" }}
      </h1>
      <p class="mb-8 text-base text-[#475467] darks:text-white/80">
        Welcome Back! Please enter your details
      </p>
      <form @submit.prevent="onSubmit">
        <div class="mb-5">
          <TextinputTwo
            iconType="email"
            placeholder=""
            label="Email address"
            type="email"
            name="email"
            icon-position="left"
            v-bind="emailAtt"
            v-model="email"
            :error="errors.email"
          />
        </div>

        <div class="mb-5">
          <TextinputTwo
            placeholder=""
            iconType="password"
            label="Password"
            type="password"
            types="password"
            name="password"
            v-model="password"
            icon-position="left"
            v-bind="passwordAtt"
            :error="errors.password"
          />
        </div>
        <span class="block text-sm text-primary-500 darks:text-white/80 mb-10">
          <NuxtLink
            :to="handleRouting(route, '/auth/forgot-password')"
            class="font-medium"
            >Forgot password?</NuxtLink
          >
        </span>
        <div class="grid gap-y-[22px] mb-9">
          <AppButton
            type="submit"
            :isLoading="isLoading"
            :isDisabled="isLoading || !meta.valid"
            text="Sign In"
            btnClass="btn-primary !py-3"
          />
        </div>
        <span
          v-if="app !== 5"
          class="flex items-center text-center text-sm text-[#182230] darks:text-white/80 gap-x-1 justify-center"
        >
          Don’t have an account?
          <NuxtLink
            :to="handleRouting(route, `/auth/register/${app || 0}`)"
            class="font-medium text-primary-500"
            >Sign Up</NuxtLink
          >
        </span>
      </form>
    </div>
  </NuxtLayout>
  <NuxtLayout name="empty" v-if="step === 2">
    <AuthOtp
      v-if="step === 2"
      :title="isVerified ? 'Email Verified' : 'Email Verification'"
      :isVerifyPin="isVerifyPin"
      :isVerified="isVerified"
      @close="
        step = 1;
        isLoading = false;
        resetForm();
      "
      :subtext="
        isVerified
          ? 'Your email has been verified. You will be automatically redirected to the dashboard'
          : 'We have sent an OTP to your email address and your registered mobile number'
      "
      buttonText="Verify Email"
      @handleSubmit="handleFinalSubmit"
      :isLoading="isLoading"
      :email="formValues.email"
      continue-link="/vendor/dashboard"
    />
  </NuxtLayout>
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { loginUser, loginUser2FA } from "~/services/authservices";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { app } = route.params;
const step = ref(1);
const isVerified = ref(false);
const isVerifyPin = ref(false);
const isLoading = ref(false);
const formValues = {
  email: "",
  password: "",
  appCode: app
};

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
const [email, emailAtt] = defineField("email");
const [password, passwordAtt] = defineField("password");

const onSubmit = handleSubmit((values) => {
  formValues.email = values.email;
  formValues.password = values.password;
  isLoading.value = true;
  loginUser(values)
    .then((res) => {
      if (res.status === 200) {
        if (route.query.continue && app == 5) {
          handleRedirect(route, res.data.data.jwToken);
          return;
        }
        isVerifyPin.value = true;
        step.value = 2;
        isLoading.value = false;
      }
    })

    .catch((err) => {
      isLoading.value = false;
      if (!err.response.data) return;
      const { data } = err.response;
      if (data.message || data.Message) {
        toast.error(data.message || data.Message);
      }
      if (
        (data.message || data.Message).includes("Email has not verified yet")
      ) {
        router.push(
          `/auth/${app ? `/${app}` : ""}?email=${encodeURIComponent(
            values.email
          )}&step=2`
        );
      }
    });
});
const onboardUser = async (data) => {
  if (data?.subApps.includes(parseInt(app))) {
    return true;
  }
  try {
    const resp = await AppsObject[app]?.onboarding({
      email: data.email,
      accessToken: data.jwToken,
    });
    if (resp?.status === 200) {
      return true;
    }
  } catch (err) {
    console.log("🚀 ~ onboardUser ~ err:", err);
    return true;
  }
};
const handleFinalSubmit = async (token) => {
  isLoading.value = true;
  loginUser2FA({ token, email: formValues.email, appCode:app })
    .then(async (res) => {
      if (res.status === 200) {
        authStore.setLoggedUser(res.data.data);

        if (app && ![0, 1].includes(app)) {
          await onboardUser(res.data.data);
        }

        if (route.query.continue) {
          handleRedirect(route, res.data.data.jwToken);
          return;
        }

        if (
          route.query.redirected_from &&
          route.query.redirected_from !== "/"
        ) {
          isLoading.value = false;
          window.location.replace(route.query.redirected_from);
          return;
        }
        toast.success("Login successful");

        isLoading.value = false;
        window.location.replace(`/`);
      }
    }).catch((err) => {
      isLoading.value = false;

      if (!err?.response?.data) return;
      const { data } = err.response;
      if (data?.message || data?.Message) {
        toast.error(data?.message || data?.Message);
      }
      if (
        (data?.message || data?.Message).includes("Email has not verified yet")
      ) {
        router.push(
          `/auth/register?email=${encodeURIComponent(formValues.email)}`
        );
      }
    });
};
</script>
