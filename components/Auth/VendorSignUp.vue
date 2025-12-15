<template>
  <NuxtLayout name="auth" v-if="step == 1">
    <div class="w-full lg:w-[600px] mx-auto">
      <div>
        <h1 class="text-[#021242] mb-1 text-2xl lg:text-3xl font-medium">
          Sign Up
        </h1>
        <p class="mb-8 text-base darks:text-white/80">Create an Account</p>
      </div>
      <div class="flex items-center w-full gap-x-1">
        <div class="w-full">
          <form
            v-if="step === 1"
            @submit.prevent="onSubmit"
            class="grid w-full grid-cols-1 gap-x-[18px] gap-y-5"
          >
            <div class="grid grid-cols-2 gap-x-4 gap-y-5">
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
              <div class="col-span-2 lg:col-span-1">
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
              <div class="col-span-2 lg:col-span-1">
                <PhoneNumber
                  label="Phone number"
                  type="tel"
                  name="phoneNumber"
                  v-bind="phoneNumberAtt"
                  v-model="phoneNumber"
                  :error="errors.phoneNumber"
                  @setError="
                    (val) => {
                      phoneError = val;
                    }
                  "
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
              <div class="col-span-2 lg:col-span-1">
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
              <div class="col-span-2 lg:col-span-1">
                <Textinput
                  placeholder=""
                  label="Referral Code (Optional)"
                  type="text"
                  name="referral_code"
                  v-bind="referral_codeAtt"
                  v-model="referral_code"
                  :error="errors.referral_code"
                  :isCumpulsory="false"
                  :disabled="!!route.query?.referral_code"
                />
              </div>
            </div>
            <div
              v-if="app === 'MAT678'"
              class="lg:col-span-2 flex items-center text-[#333] darks:text-slate-400 text-xs lg:text-sm gap-x-[2px]"
            >
              <Checkbox
                v-model.value="agree"
                label="I agree to the "
                labelClass="text-xs lg:text-sm"
              />
              <span>
                <NuxtLink
                  to="https://matta.trade/terms-and-conditions"
                  class="text-[#2176FF]"
                  external
                  target="_blank"
                  >Terms of services
                </NuxtLink>
                and
                <NuxtLink
                  to="https://matta.trade/privacy-policies"
                  class="text-[#2176FF]"
                  external
                  target="_blank"
                  >Policy</NuxtLink
                >
                of Matta Trade
              </span>
            </div>

            <div class="lg:col-span-2 grid gap-y-[22px] mb-[13px] mt-4">
              <AppButton
                type="submit"
                :isLoading="isLoading"
                text="Sign Up"
                btnClass="normal-case btn-primary !py-3"
                :isDisabled="
                  isLoading ||
                  !meta.valid ||
                  (app === 'MAT678' && !agree) ||
                  !!phoneError
                "
                :style="{
                  background:
                    isLoading || !meta.valid || !!phoneError ? '' : color,
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
      :email="email || newEmail"
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

// ----------------------------
// Basic Setup
// ----------------------------
const route = useRoute();
const router = useRouter();
const { app, auth } = route.params;
const authStore = useAuthStore();
const newEmail = useCookie("email", defaultOptions);

const color = appCodeColorMap[app] || "#1570EF";
const step = ref(1);
const isVerifyPin = ref(false);
const isLoading = ref(false);
const isVerified = ref(false);
const phoneError = ref(null);

const allcountries = computed(() => {
  return countries.map((item) => item.name);
});

// ----------------------------
// Head Scripts by App Type
// ----------------------------
if (app === "MAT678") {
  useHead({
    script: [
      {
        id: "gtm-init",
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

if (app === "FLU120") {
  useHead({
    script: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-9YFZLVNCG5",
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9YFZLVNCG5');
        `,
        type: "text/javascript",
      },
    ],
  });
}

// ----------------------------
// Form Setup
// ----------------------------
const formValues = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  referral_code: "",
  referral_code: route.query.referral_code || "",
  appCode: app,
  country: getCountryFromBrowserRegion(),
  agree: false,
  subscribe: false,
};

const schema = yup.object({
  appCode: yup.string().nullable(),
  email: yup.string().required().email(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phoneNumber: yup.string().required(),
  companyName: yup.string().optional(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/,
      "Password must meet complexity requirements."
    ),
  country: yup.string().required(),
  agree: yup.boolean(),
  subscribe: yup.boolean(),
  referral_code: yup.string().optional(),
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
const [referral_code, referral_codeAtt] = defineField("referral_code");
const [agree] = defineField("agree");
const [subscribe] = defineField("subscribe");

// ----------------------------
// Autofill From Query Params
// ----------------------------
const autofillFromQuery = () => {
  const queryParams = [
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "referral_code",
  ];

  queryParams.forEach((param) => {
    if (route.query[param]) setFieldValue(param, route.query[param]);
  });

  // auto open OTP screen if returning user already added email
  if (newEmail.value) {
    step.value = 2;
  }
};

// ----------------------------
// Submit - Step 1
// ----------------------------
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    const res = await registerUser({
      ...values,
      confirmPassword: values.password,
      AgentReferralCode: values.referral_code,
    });

    if (res.status === 200) {
      newEmail.value = values.email;
      isVerifyPin.value = true;
      step.value = 2;
    }
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Something went wrong"
    );
  } finally {
    isLoading.value = false;
  }
});

// ----------------------------
// Submit - OTP Verification
// ----------------------------
const handleFinalSubmit = async (code) => {
  isLoading.value = true;

  try {
    const res = await confirmRegister({
      code,
      otpCode: code,
      email: email.value || newEmail.value,
    });

    if (res.status === 200) {
      const data = res.data.data;
      isVerified.value = true;

      authStore.setLoggedUser(data);
      authStore.setHasPin(data.hasTransactionPIN);
      saveAuthProfile(data);
      newEmail.value = null;
      if (route.query.continue || app) {
        handleRedirect(route, data, app);
        return;
      }

      toast.success("Sign up successful");
      window.location.replace(intialRoute[data.userCategory]);
    }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.response?.data?.Message;
    msg && toast.error(msg);
  } finally {
    isLoading.value = false;
  }
};

// ----------------------------
// Mounted
// ----------------------------
onMounted(() => {
  autofillFromQuery();
});
</script>
