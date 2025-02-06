<template>
  <NuxtLayout name="auth" v-if="step == 1">
    <div class="w-full lg:w-[600px] mx-auto">
      <div>
        <h1
          class="text-[#101828] darks:text-white mb-[4px] text-[30px] font-medium"
        >
          Sign Up
        </h1>
        <p class="mb-8 text-base darks:text-white/80">Create an Account</p>
      </div>
      <div class="flex gap-x-1 items-center w-full">
        <div class="w-full">
          <form
            v-if="step === 1"
            @submit.prevent="onSubmit"
            class="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-[18px] gap-y-5"
          >
            <div>
              <Textinput
                placeholder="First Name"
                label="First name"
                type="text"
                name="firstName"
                v-bind="firstNameAtt"
                v-model="firstName"
                :error="errors.firstName"
                isCumpulsory
              />
            </div>
            <div>
              <Textinput
                placeholder="Last Name"
                label="Last name"
                type="text"
                name="lastName"
                v-bind="lastNameAtt"
                v-model="lastName"
                :error="errors.lastName"
                isCumpulsory
              />
            </div>
            <div>
              <Textinput
                placeholder="Email address"
                label="Email Address"
                type="email"
                name="email"
                iconType="email"
                icon-position="left"
                isCumpulsory
                v-model="email"
                disabled
              />
            </div>
            <div>
              <LazyPhoneNumber
                label="Phone number"
                type="tel"
                name="phoneNumber"
                v-bind="phoneNumberAtt"
                v-model="phoneNumber"
                :error="errors.phoneNumber"
                isCumpulsory
              />
            </div>

            <div class="lg:col-span-2">
              <Textinput
                placeholder="Create a password"
                label="Password"
                type="password"
                name="password"
                iconType="password"
                v-bind="passwordAtt"
                v-model="password"
                :error="errors.password"
                icon-position="left"
                isCumpulsory
                hasicon
                description="Must be at least 8 characters."
              />
            </div>

            <div class="lg:col-span-2 grid gap-y-[22px] mb-[13px] mt-4">
              <AppButton
                type="submit"
                :isLoading="isLoading"
                text="Sign Up"
                btnClass="normal-case btn-primary !py-3"
                :isDisabled="isLoading || !meta.valid"
              />
            </div>
            <span
              class="lg:col-span-2 flex items-center text-center text-sm text-[#475467] darks:text-white/80 gap-x-1 justify-center"
            >
              Already have an account?
              <NuxtLink to="/auth/login" class="font-medium text-primary-500"
                >Log in</NuxtLink
              >
            </span>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <NuxtLayout name="empty" v-else>
    <AuthOtp
      title="Email Verification"
      :isVerifyPin="isVerifyPin"
      @close="step = 1"
      buttonText="Verify OTP"
      :is-loading="isLoading"
      @handleSubmit="handleFinalSubmit"
      :isLoading="isLoading"
      :email="email"
      :is-verified="isVerified"
      continue-link="/"
      subtext="Enter the  6-Digit verification code has been sent to your registered email address. Check your inbox."
    />
  </NuxtLayout>
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { getSingleInvite } from "~/services/userservices";
import { registerInvitedUser, confirmRegister } from "~/services/authservices";
import { saveAuthProfile } from "~/utils/saveAuthProfile";

const emits = defineEmits(["close", "toggleAuth"]);
const route = useRoute();
const { id } = route.params;

const authStore = useAuthStore();
const isVerifyPin = ref(false);
const isLoading = ref(false);
const isVerified = ref(false);
const formValues = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};
const step = ref(2);
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  email: yup.string().email().required(),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .required(
      "Password must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
});

const { handleSubmit, defineField, errors, meta, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: formValues,
});
const [email] = defineField("email");
const [password, passwordAtt] = defineField("password");
const [firstName, firstNameAtt] = defineField("firstName");
const [lastName, lastNameAtt] = defineField("lastName");
const [phoneNumber, phoneNumberAtt] = defineField("phoneNumber");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  registerInvitedUser({
    ...values,
    confirmPassword: values.password,
    phoneNumber: values.phoneNumber,
  })
    .then((res) => {
      if (res.status === 200) {
        isVerifyPin.value = true;
        step.value = 2;
        isLoading.value = false;
      }
    })
    .catch((err) => {
      isLoading.value = false;
      if (err?.response?.data?.message || err?.response?.data?.Message) {
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.Message ||
            "Something went wrong"
        );
      }
    });
});

const handleFinalSubmit = (code) => {
  isLoading.value = true;
  confirmRegister({
    code,
    otpCode: code,
    email: email.value,
  })
    .then((res) => {
      if (res.status === 200) {
        isVerified.value = true;
        authStore.setLoggedUser(res.data.data);

        saveAuthProfile(res.data.data);

        toast.success("Sign up successful");

        isLoading.value = false;
        window.location.replace("/");
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

  getSingleInvite(id).then((res) => {
    if (res.status === 200) {
      setFieldValue('email', res.data.data.email)
      console.log("🚀 ~ getSingleInvite ~ res.data.data.email:", res.data.data.email)
    }
     
  });
});
</script>
