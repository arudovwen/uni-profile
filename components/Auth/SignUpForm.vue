<template>
  <div class="w-full font-Avenir">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-semibold text-[#2F2F2F] mb-2">
        Sign Up
      </h1>
      <p class="text-base text-[#475467]">
        Fill the form below to get started
      </p>
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
          :isRequired="true"
        />
      </div>

      <!-- Business Name (Optional) -->
      <TextinputInputField
        v-model="businessName"
        name="businessName"
        type="text"
        label="Business Name (Optional)"
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
      <div class="flex items-start gap-3 pt-2">
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
      </div>

      <!-- Submit Button -->
      <AppButton
        type="submit"
        text="Create account"
        :isLoading="isLoading"
        :isDisabled="isLoading || !meta.valid || !agreeToTerms"
        btnClass="w-full !py-3 !rounded-lg !bg-[#1570EF] !text-white"
      />

      <!-- Sign In Link -->
      <p class="text-center text-sm text-[#475467]">
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
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { registerUser } from "~/services/authservices";

// Route
const route = useRoute();
const router = useRouter();
const { auth } = route.params;

// State
const isLoading = ref(false);
const passwordType = ref("password");
const agreeToTerms = ref(false);

// Computed
const loginLink = computed(() =>
  handleRouting(route, `/${auth}/login`)
);

// Form Fields
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");
const businessName = ref("");
const password = ref("");

// Validation Schema
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phoneNumber: yup.string().required("Phone number is required"),
  businessName: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
});

const { handleSubmit, defineField, errors, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    password: "",
  },
});

// Define fields for vee-validate
defineField("firstName");
defineField("lastName");
defineField("email");
defineField("phoneNumber");
defineField("businessName");
defineField("password");

// Methods
const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

const onSubmit = handleSubmit(async (values) => {
  if (!agreeToTerms.value) {
    toast.error("Please agree to terms and conditions");
    return;
  }

  isLoading.value = true;

  try {
    const response = await registerUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      businessName: values.businessName || null,
      password: values.password,
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
    const message = err?.response?.data?.message || err?.response?.data?.Message;
    if (message) {
      toast.error(message);
    }
  }
});

const emit = defineEmits(["registered"]);
</script>
