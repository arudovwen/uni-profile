<template>
  <NuxtLayout name="auth" v-if="step == 1">
    <div class="w-full lg:w-[600px] mx-auto">
      <div>
        <h1
          class="text-[#021242] darks:text-white mb-[4px] text-[30px] font-medium"
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
                v-bind="emailAtt"
                v-model="email"
                :error="errors.email"
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
            <div class="">
              <Textinput
                placeholder="Company Name"
                label="Company name"
                type="text"
                name="companyName"
                v-bind="companyNameAtt"
                v-model="companyName"
                :error="errors.companyName"
              />
            </div>
            <FormGroup label="Country" :error="errors.country" name="sector">
              <SelectVueSelect
                :options="allcountries"
                v-model="country"
                :reduce="(country) => country"
                :clearable="false"
                :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
                  errors.country ? 'border-red-500' : 'border-[#D0D5DD]'
                }`"
              />
            </FormGroup>
            <div class="">
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
            <div class="">
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
                text="Sign Up"
                btnClass="normal-case btn-primary !py-3"
                :isDisabled="isLoading || !meta.valid"
                :style="{
                  background: isLoading || !meta.valid ? '' : color,
                }"
              />
            </div>
            <span
              class="lg:col-span-2 flex items-center text-center text-sm text-[#475467] darks:text-white/80 gap-x-1 justify-center"
            >
              Already have an account?
              <NuxtLink
                :to="
                  handleRouting(route, `/${auth}/login${app ? `/${app}` : ''}`)
                "
                 :style="{ color: color }"
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
  <noscript v-if="app === 'MAT678'">
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-M7KP6CJG"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
    ></iframe>
  </noscript>
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { registerUser, confirmRegister } from "~/services/authservices";
import { saveAuthProfile } from "~/utils/saveAuthProfile";
import countries from "~/utils/countries.json";

const props = defineProps({
  main: {
    default: true,
  },
});

const emits = defineEmits(["close", "toggleAuth"]);
const route = useRoute();
const { app, auth } = route.params;
const color = appCodeColorMap[app] || "#1570EF";
const authStore = useAuthStore();
const isVerifyPin = ref(false);
const isLoading = ref(false);
const isVerified = ref(false);
if (app === "MAT678") {
  useHead({
    script: [
      {
        id: "gtm-init", // this ID must match the key in __dangerouslyDisableSanitizersByTagID
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M7KP6CJG');`,
        type: "text/javascript",
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      "gtm-init": ["innerHTML"],
    },
  });
}

const formValues = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  AgentReferralCode: "",
  appCode: app,
  country: getCountryFromBrowserRegion(),
};

const allcountries = computed(() => {
  return countries.map((item) => item.name);
});

const step = ref(1);
const schema = yup.object({
  appCode: yup.string().nullable(),
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
  country: yup.string().required(),
});

const { handleSubmit, defineField, errors, meta, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

const [email, emailAtt] = defineField("email");
const [password, passwordAtt] = defineField("password");
const [firstName, firstNameAtt] = defineField("firstName");
const [lastName, lastNameAtt] = defineField("lastName");
const [phoneNumber, phoneNumberAtt] = defineField("phoneNumber");
const [companyName, companyNameAtt] = defineField("companyName");
const [country] = defineField("country");
const [AgentReferralCode, AgentReferralCodeAtt] =
  defineField("AgentReferralCode");

const router = useRouter();

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  registerUser({
    ...values,
    confirmPassword: values.password,
    phoneNumber: values.phoneNumber,
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
  confirmRegister({
    code,
    otpCode: code,
    email: email.value || route.query.email,
  })
    .then((res) => {
      if (res.status === 200) {
        isVerified.value = true;
        const data = res.data.data;
        authStore.setLoggedUser(data);
        authStore.setHasPin(data.hasTransactionPIN);
        saveAuthProfile(data);

        if (route.query.continue || app) {
          handleRedirect(route, data, app);
          return;
        }
        toast.success("Sign up successful");

        isLoading.value = false;
        window.location.replace(intialRoute[data?.userCategory]);
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
  getCountryFromBrowserRegion();
  if (route.query.email) {
    step.value = 2;
  }
});
</script>
