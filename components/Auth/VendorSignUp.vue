<template>
  <NuxtLayout name="auth" v-if="step == 1">
    <div class="w-full max-w-[563px] py-2 mt-28 mx-auto">
      <div>
        <h1
          class="text-[#101828] darks:text-white mb-[4px] text-[30px] font-medium"
        >
          Get Started
        </h1>
        <p class="mb-8 text-base darks:text-white/80">Create an Account</p>
      </div>
      <div class="mb-8 flex gap-x-1 items-center w-full">
        <div class="w-full">
          <form
            v-if="step === 1"
            @submit.prevent="onSubmit"
            class="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-[18px] gap-y-5"
          >
            <div
              v-if="!app || app == 0"
              class="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <AuthMattaTypeCard
                :active="business_UserType === 0"
                @click="setFieldValue('business_UserType', 0)"
                icon="ri:user-3-line"
                title="Buyer Account"
                description="Search, buy and place orders for products"
              />
              <AuthMattaTypeCard
                :active="business_UserType === 1"
                @click="setFieldValue('business_UserType', 1)"
                icon="solar:shop-linear"
                title="Vendor Account"
                description="For merchants who wants to sell their products"
              />
            </div>
            <div
              v-if="app == 1"
              class="lg:col-span-2 flex flex-col gap-4 lg:flex-row justify-between"
            >
              <user-type-card
                :active="userType === 0"
                @click="setFieldValue('userType', 0)"
                icon-active="AuthClientIconActive"
                icon-inactive="AuthClientIcon"
                title="Clients"
                description="Need a logistics and fulfillment partner"
              />
              <user-type-card
                :active="userType === 1"
                @click="setFieldValue('userType', 1)"
                icon-active="AuthVendorIconActive"
                icon-inactive="AuthVendorIcon"
                title="Vendors"
                description="Become a fulfillment service provider"
              />
            </div>

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
            <div class="lg:col-span-2">
              <Textinput
                placeholder="Email address"
                label="Email Address"
                type="email"
                name="email"
                iconType="email"
                icon-position="left"
                isCumpulsory
                v-bind="emailAtt"
                v-model="email"
                :error="errors.email"
              />
            </div>
            <div class="lg:col-span-2">
              <LazyPhoneNumber
                label="Phone number"
                type="tel"
                name="phone"
                v-bind="phoneAtt"
                v-model="phone"
                :error="errors.phone"
                isCumpulsory
              />
            </div>
            <div class="lg:col-span-2">
              <Textinput
                placeholder="Company Name"
                label="Company name"
                type="text"
                name="companyName"
                v-bind="companyNameAtt"
                v-model="companyName"
                :error="errors.companyName"
                :isCumpulsory="type !== 'register' && main"
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
            <div class="lg:col-span-2">
              <Textinput
                placeholder=""
                label="Referral Code (Optional)"
                type="text"
                name="AgentReferralCode"
                v-bind="AgentReferralCodeAtt"
                v-model="AgentReferralCode"
                :error="errors.AgentReferralCode"
                :isCumpulsory="false"
              />
            </div>
            <div class="lg:col-span-2 grid gap-y-[22px] mb-[13px] mt-4">
              <AppButton
                type="submit"
                :isLoading="isLoading"
                text="Get Started"
                btnClass="normal-case btn-primary !py-3"
                :isDisabled="isLoading || !meta.valid"
              />
            </div>
            <span
              class="lg:col-span-2 flex items-center text-center text-sm text-[#475467] darks:text-white/80 gap-x-1 justify-center"
            >
              Already have an account?
              <NuxtLink
                :to="handleRouting(route, `/auth/login${app ? `/${app}` : ''}`)"
                class="font-medium text-primary-500"
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
      :email="email || route.query.email"
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
import { getUserInfo } from "~/services/userservices";
import UserTypeCard from "./UserTypeCard.vue";

const props = defineProps({
  main: {
    default: true,
  },
});
const emits = defineEmits(["close", "toggleAuth"]);
const route = useRoute();
const { type, app } = route.params;
const { redirected_from, query_step } = route.query;
const authStore = useAuthStore();
const isVerifyPin = ref(false);
const isLoading = ref(false);
const isVerified = ref(false);
const formValues = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  userType: 0,
  business_UserType: 0,
  AgentReferralCode: "",
};
const step = ref(1);
const schema = yup.object({
  userType: yup.mixed(),
  business_UserType: yup.mixed(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  firstName: yup.string().required("First name is required"),
  companyName: yup.string().when("business_UserType", {
    is: (val) => val == 0,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required("Company name is required"),
  }),
  lastName: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone number is required"),
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

const [email, emailAtt] = defineField("email");
const [password, passwordAtt] = defineField("password");
const [firstName, firstNameAtt] = defineField("firstName");
const [lastName, lastNameAtt] = defineField("lastName");
const [phone, phoneAtt] = defineField("phone");
const [userType] = defineField("userType");
const [business_UserType] = defineField("business_UserType");
const [companyName, companyNameAtt] = defineField("companyName");
const [AgentReferralCode, AgentReferralCodeAtt] =
  defineField("AgentReferralCode");

const router = useRouter();

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  AppsObject[app]
    .registerUrl({
      ...values,
      confirmPassword: values.password,
      phoneNumber: values.phone,
    })
    .then((res) => {
      if (res.status === 200) {
        isVerifyPin.value = true;
        step.value = 2;
        isLoading.value = false;
        setQuery(router, route.path, { email: values.email, ...route.query });
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
  AppsObject[app]
    .confirmRegisterUrl({
      code,
      otpCode: code,
      email: email.value || route.query.email,
    })
    .then((res) => {
      if (res.status === 200) {
        isVerified.value = true;
        authStore.setLoggedUser(res.data.data);
        authStore.setHasPin(res.data.data.hasTransactionPIN);
        if (app == 1) {
          getUserInfo().then((res) => {
            authStore.setLoggedUser({
              ...authStore.loggedUser,
              accountType: res.data.data?.userType,
            });
          });
        }
        if (route.query.continue) {
          handleRedirect(route, res.data.data.jwToken);
          return;
        }
        toast.success("Sign up successful");

        isLoading.value = false;
        window.location.replace(redirected_from);
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
  if (route.query.email) {
    step.value = 2;
  }
});
</script>
