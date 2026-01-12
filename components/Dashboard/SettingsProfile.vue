<template>
  <div
    class="bg-white rounded-lg border border-[#E4E7EC] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] py-8 px-[51px] max-w-[723px]"
  >
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-base font-[800] text-[#344054] leading-6">
        Personal Information
      </h2>
      <p class="text-sm font-medium text-[#475467] leading-5 mt-0.5">
        Update your profile and personal details.
      </p>
    </div>

    <!-- Profile Picture -->
    <div class="flex items-center gap-[19px] mb-[23px]">
      <div
        class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative"
      >
        <img
          v-if="photo"
          :src="photo"
          alt="Profile"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1570EF] to-[#0F5BD3] text-white text-xl font-semibold"
        >
          {{ userInitial }}
        </div>
        <!-- Contrast border -->
        <div
          class="absolute inset-0 rounded-full border border-black/[0.08]"
        ></div>
      </div>
      <label class="cursor-pointer">
        <input
          type="file"
          class="hidden"
          accept="image/jpeg,image/jpg,image/png"
          @change="handlePhotoUpload"
        />
        <span
          class="text-sm font-normal text-[#667085] leading-6 hover:text-[#1570EF] transition-colors"
        >
          Upload Profile Picture
        </span>
      </label>
    </div>

    <form @submit.prevent="onSubmit">
      <!-- Form Fields -->
      <div class="flex flex-col gap-[23px]">
        <!-- Row 1: First Name & Last Name -->
        <div class="flex gap-3">
          <TextinputInputField
            v-model="firstName"
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            :error="errors.firstName"
            input-wrapper-style="flex-1"
          />
          <TextinputInputField
            v-model="lastName"
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            :error="errors.lastName"
            input-wrapper-style="flex-1"
          />
        </div>

        <!-- Row 2: Email Address & Phone Number -->
        <div class="flex gap-3">
          <!-- Email Address -->
          <TextinputInputField
            v-model="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter email address"
            :disabled="true"
            :error="errors.email"
            input-wrapper-style="flex-1"
          />

          <!-- Phone Number -->
          <PhoneNumber
            v-model="phone"
            name="phone"
            label="Phone Number"
            :error="errors.phone"
            class-label="!leading-5 !mb-1"
            text-input-class="!h-[41px]"
            dropdown-class="!h-[41px]"
          />
        </div>

        <!-- Row 3: Business Name -->
        <TextinputInputField
          v-model="businessName"
          name="businessName"
          label="Business Name"
          placeholder="Enter business name"
          :error="errors.businessName"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end mt-[34px]">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-[235px] h-[45px] bg-[#1570EF] text-white text-base font-[800] rounded-[5px] hover:bg-[#0F5BD3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span
            v-if="isLoading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { getUserProfile, updateUserProfile } from "~/services/settingservices";
import { uploaddocument } from "~/services/onboardingservice";
import { useToast } from "~/composables/useToast";

const toast = useToast();
const authStore = useAuthStore();
const { decrypt } = useEncryption();

const isLoading = ref(false);
const photo = ref("");

const userInitial = computed(() => {
  const first = authStore.loggedUser?.firstName || "";
  return first.charAt(0).toUpperCase() || "U";
});

// Form validation schema
const formSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  phone: yup.string(),
  businessName: yup.string().required("Business name is required"),
});

const { handleSubmit, defineField, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
  },
});

const [firstName] = defineField("firstName");
const [lastName] = defineField("lastName");
const [email] = defineField("email");
const [phone] = defineField("phone");
const [businessName] = defineField("businessName");

// Fetch user profile on mount
onMounted(async () => {
  try {
    const res = await getUserProfile();
    if (res.status === 200) {
      const data = res.data?.data || res.data;

      setFieldValue("firstName", data.firstName || "");
      setFieldValue("lastName", data.lastName || "");

      // Decrypt email if encrypted
      const userEmail = data.contactEmail || data.email || "";
      try {
        const decryptedEmail = decrypt(userEmail);
        setFieldValue("email", decryptedEmail || userEmail);
      } catch {
        setFieldValue("email", userEmail);
      }

      setFieldValue("phone", data.phone || "");
      setFieldValue(
        "businessName",
        data.businessName || data.companyName || ""
      );
      photo.value = data.photo || data.avatar || "";
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
});

// Handle photo upload
const handlePhotoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["jpg", "jpeg", "png"];

  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    toast.error("Invalid file type. Please upload JPG or PNG.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64String = (e.target?.result as string)?.split(",")[1];
    if (!base64String) return;

    try {
      const res = await uploaddocument({
        base64: base64String,
        ext: `.${fileExtension}`,
      });
      const uploadedPhotoUrl = res.data?.data || res.data?.message;
      photo.value = uploadedPhotoUrl;

      // Update auth store with new photo
      authStore.updateUserInfo({ photo: uploadedPhotoUrl });
      toast.success("Photo uploaded successfully");
    } catch (err) {
      console.error("Error uploading photo:", err);
      toast.error("Failed to upload photo");
    }
  };
  reader.readAsDataURL(file);
};

// Submit form
const onSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true;

  try {
    const res = await updateUserProfile({
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.phone,
      businessName: formValues.businessName,
      photo: photo.value,
    });

    if (res.status === 200) {
      // Update auth store with new user data
      authStore.updateUserInfo({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        phone: formValues.phone,
        businessName: formValues.businessName,
        photo: photo.value,
      });

      toast.success("Profile updated successfully", "success");

      // Reload page for consistency
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.Message ||
      "Something went wrong, try again later";
    toast.error(message, "error");
  } finally {
    isLoading.value = false;
  }
});
</script>
