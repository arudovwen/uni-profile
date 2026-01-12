<template>
  <div class="w-full font-Avenir">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-[800] text-[#2F2F2F] mb-2">Sign Up</h1>
      <p class="text-base text-[#475467]">Fill the form below to get started</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-5">
      <!-- First Name & Last Name -->
      <div class="grid grid-cols-2 gap-4">
        <TextinputInputField
          v-model="firstName"
          name="firstName"
          type="text"
          label="First Name"
          placeholder="First Name"
          :error="errors.firstName"
        />
        <TextinputInputField
          v-model="lastName"
          name="lastName"
          type="text"
          label="Last Name"
          placeholder="Last Name"
          :error="errors.lastName"
        />
      </div>

      <!-- Email Address -->
      <TextinputInputField
        v-model="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        :error="errors.email"
      />

      <!-- Phone Number -->
      <div>
        <label class="block mb-2 text-base text-[#344054] font-medium">
          Phone Number
        </label>
        <PhoneNumber
          v-model="phoneNumber"
          name="phoneNumber"
          :error="errors.phoneNumber"
        />
      </div>

      <!-- Business Name (Optional) -->
      <TextinputInputField
        v-model="businessName"
        name="businessName"
        type="text"
        label="Business Name"
        placeholder="Business Name"
        :error="errors.businessName"
      />

      <!-- Password -->
      <TextinputInputField
        v-model="password"
        name="password"
        :type="passwordType"
        label="Password"
        placeholder="Enter your password"
        :error="errors.password"
        @toggle-password="togglePasswordVisibility"
      />

      <!-- Agreement Checkbox -->
      <!-- <div class="flex items-start gap-3 pt-2">
        <input
          v-model="agreeToTerms"
          type="checkbox"
          class="w-5 h-5 mt-0.5 cursor-pointer accent-[#1570EF]"
        />
        <label class="text-sm text-[#475467] cursor-pointer">
          I agree to the
          <a href="#" class="font-semibold text-[#1570EF] hover:underline">
            Terms and Conditions
          </a>
          and
          <a href="#" class="font-semibold text-[#1570EF] hover:underline">
            Privacy Policy
          </a>
        </label>
      </div> -->

      <!-- Submit Button -->
      <AppButton
        type="submit"
        text="Create account"
        :isLoading="isLoading"
        btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !mt-[29px] !text-white"
      />

      <!-- Sign In Link -->
      <p class="text-center text-sm text-[#475467] !mt-8">
        Already have an account?
        <NuxtLink
          :to="loginLink"
          class="font-semibold text-[#1570EF] hover:underline"
        >
          Sign In
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { registerUser } from "~/services/authservices";
import { useToast } from "~/composables/useToast";
import { useValidatedForm } from "~/composables/useValidatedForm";

// Toast
const toast = useToast();

// Route
const route = useRoute();
const router = useRouter();
const { auth } = route.params;

// State
const isLoading = ref(false);
const passwordType = ref("password");
const agreeToTerms = ref(true);

// Computed
const loginLink = computed(() => handleRouting(route, `/${auth}/login`));

// Validation Schema
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phoneNumber: yup.string().required("Phone number is required"),
  businessName: yup.string().required("Business name is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
});

const { handleSubmit, defineField, errors, meta } = useValidatedForm({
  validationSchema: schema,
  initialValues: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    password: "",
  },
  useValidatedForm: true,
});

// Define fields for vee-validate - these return reactive refs connected to the form
const [firstName] = defineField("firstName");
const [lastName] = defineField("lastName");
const [email] = defineField("email");
const [phoneNumber] = defineField("phoneNumber");
const [businessName] = defineField("businessName");
const [password] = defineField("password");

// Methods
const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    const response = await registerUser({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      password: values.password,
      confirmPassword: values.password,
      companyName: values.businessName || "",
      referral_code: "",
      country: "Nigeria",
      agree: false,
      subscribe: false,
      AgentReferralCode: "",
    });

    if (response.status === 200) {
      // Emit event to parent to move to OTP verification step
      emit("registered", {
        email: values.email,
        firstName: values.firstName,
      });
    }
  } catch (err) {
    isLoading.value = false;
    const message =
      err?.response?.data?.message || err?.response?.data?.Message;
    if (message) {
      toast.error(message);
    }
  }
});

const emit = defineEmits(["registered"]);
</script>
