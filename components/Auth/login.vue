<template>
  <NuxtLayout v-if="step === 1" name="auth">
    <div class="pt-10 lg:pt-0 w-full lg:w-[450px] mx-auto">
      <h1
        class="text-[#021242] darks:text-white mb-2 text-2xl lg:text-3xl font-medium w-full"
      >
        Log In {{ authStore.appList.find((i) => i.code === app)?.name ?? "" }}
      </h1>
      <p class="mb-8 text-base text-[#475467] darks:text-white/80">
        Welcome Back! Please enter your details
      </p>
      <form @submit.prevent="onSubmit">
        {{ email }}
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
            :hasicon="true"
            :error="errors.password"
          />
        </div>

        <span
          class="block mb-10 text-sm darks:text-white/80"
          :style="{ color }"
        >
          <NuxtLink :to="forgotPasswordLink" class="font-medium"
            >Forgot password?</NuxtLink
          >
        </span>

        <div class="grid gap-y-[22px]">
          <AppButton
            type="submit"
            :isLoading="isLoading"
            :isDisabled="isLoading"
            text="Sign In"
            btnClass="btn-primary !py-3"
            :style="{
              background: isLoading ? '' : color,
            }"
          />
        </div>

        <span
          class="flex items-center text-center text-sm text-[#182230] mt-9 darks:text-white/80 gap-x-1 justify-center"
        >
          Don't have an account?
          <NuxtLink :to="registerLink" class="font-medium" :style="{ color }"
            >Sign Up</NuxtLink
          >
        </span>
      </form>
    </div>
  </NuxtLayout>

  <NuxtLayout name="empty" v-else-if="step === 2">
    <AuthOtp
      :title="isVerified ? 'Email Verified' : 'Email Verification'"
      :isVerifyPin="isVerifyPin"
      :isVerified="isVerified"
      @close="onOtpClose"
      :subtext="
        isVerified
          ? 'Your email has been verified. You will be automatically redirected to the dashboard'
          : 'We have sent an OTP to your email address and your registered mobile number'
      "
      buttonText="Verify Email"
      @handleSubmit="handleFinalSubmit"
      :isLoading="isLoading"
      :email="loginEmail"
      continue-link="/vendor/dashboard"
    />
  </NuxtLayout>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { saveAuthProfile } from "~/utils/saveAuthProfile";
import { loginUser, loginUser2FA } from "~/services/authservices";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { app, auth } = route.params;

// ─── Analytics ────────────────────────────────────────────────────────────────
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
      {
        id: "facebook-pixel",
        innerHTML: `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '979825461003897');
        fbq('track', 'PageView');`,
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
        id: "ga-init",
        innerHTML: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9YFZLVNCG5');`,
        type: "text/javascript",
      },
      {
        id: "gtm-init",
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WKXBWCB5');`,
        type: "text/javascript",
      },
      {
        id: "facebook-pixel",
        innerHTML: `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '873140148927572');
        fbq('track', 'PageView');`,
        type: "text/javascript",
      },
    ],
    noscript: [
      {
        innerHTML: `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=873140148927572&ev=PageView&noscript=1"/>`,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      "ga-init": ["innerHTML"],
      "gtm-init": ["innerHTML"],
      "facebook-pixel": ["innerHTML"],
    },
  });
}

// ─── State ─────────────────────────────────────────────────────────────────────
const color = appCodeColorMap[app] || "#1570EF";
const step = ref(Number(route.query.step) || 1);
const isVerified = ref(false);
const isVerifyPin = ref(false);
const isLoading = ref(false);
const loginEmail = ref("");

// ─── Form ──────────────────────────────────────────────────────────────────────
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup.string().required("Password is required"),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: { email: loginEmail.value, password: "", appCode: app },
  mode: "onBlur",
});

const [email, emailAtt] = defineField("email");
const [password, passwordAtt] = defineField("password");

// ─── Computed links ────────────────────────────────────────────────────────────
const appSuffix = app ? `/${app}` : "";
const forgotPasswordLink = computed(() =>
  handleRouting(route, `/${auth}/forgot-password${appSuffix}`),
);
const registerLink = computed(() =>
  handleRouting(route, `/${auth}/register${appSuffix}`),
);

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getErrorMessage = (data) => data?.message || data?.Message || "";

const handleFinalRedirect = (data) => {
  if (route.query.continue || app) {
    handleRedirect(route, data, app);
    return;
  }
  isLoading.value = false;
  toast.success("Login successful");
  window.location.replace(intialRoute[data?.userCategory]);
};

const onOtpClose = () => {
  isLoading.value = false;
  router.push(
    `/auth/login${appSuffix}?email=${encodeURIComponent(
      loginEmail.value,
    )}&step=1`,
  );
};

// ─── Submit handlers ───────────────────────────────────────────────────────────
const onSubmit = handleSubmit((values) => {
  loginEmail.value = values.email;
  isLoading.value = true;

  loginUser({ ...values, appCode: app })
    .then((res) => {
      if (res.status !== 200) return;

      if (typeof fbq === "function") {
        fbq("track", "Login", {
          method: "email",
          device: window.innerWidth < 768 ? "mobile" : "desktop",
          value: 0,
          currency: "NGN",
        });
      }

      if (!res.data.data.is2FA && app) {
        authStore.setLoggedUser(res.data.data);
        saveAuthProfile(res.data.data);
        handleFinalRedirect(res.data.data);
        return;
      }

      isVerifyPin.value = true;
      step.value = 2;
      isLoading.value = false;
    })
    .catch((err) => {
      if (!err.response?.data) return;
      const { data } = err.response;
      const message = getErrorMessage(data);
      if (message) toast.error(message);
      if (message.includes("Email has not verified yet")) {
        router.push(
          `/auth/login${appSuffix}?email=${encodeURIComponent(
            values.email,
          )}&step=2`,
        );
      }
    })
    .finally(() => {
      if (isLoading.value) isLoading.value = false;
    });
});

const handleFinalSubmit = (token) => {
  isLoading.value = true;

  loginUser2FA({ token, email: loginEmail.value, appCode: app })
    .then((res) => {
      if (res.status !== 200) return;
      authStore.setLoggedUser(res.data.data);
      saveAuthProfile(res.data.data);
      handleFinalRedirect(res.data.data);
    })
    .catch((err) => {
      if (!err?.response?.data) return;
      const { data } = err.response;
      const message = getErrorMessage(data);
      if (message) toast.error(message);
      if (message.includes("Email has not verified yet")) {
        router.push(
          `/auth/register?email=${encodeURIComponent(loginEmail.value)}`,
        );
      }
    })
    .finally(() => {
      if (isLoading.value) isLoading.value = false;
    });
};

// ─── Watchers ──────────────────────────────────────────────────────────────────
watch(
  () => route.query.step,
  (newStep) => {
    step.value = Number(newStep) || 1;
  },
  { immediate: true },
);
</script>
