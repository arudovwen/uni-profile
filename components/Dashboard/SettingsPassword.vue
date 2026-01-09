<template>
  <div
    class="bg-white rounded-lg border border-[#E4E7EC] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] py-8 px-[51px] max-w-[723px]"
  >
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-base font-[800] !text-[#344054] leading-6">
        Manage Password
      </h2>
      <p class="text-sm font-medium text-[#475467] leading-5 mt-0.5">
        Reset and update your password
      </p>
    </div>

    <form @submit.prevent="onSubmit">
      <!-- Form Fields -->
      <div class="flex flex-col gap-[23px]">
        <!-- Current Password -->
        <TextinputInputField
          v-model="currentPassword"
          name="currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          label="Current Password"
          placeholder="Enter current password"
          :error="errors.currentPassword"
          @toggle-password="showCurrentPassword = !showCurrentPassword"
        />

        <!-- New Password -->

        <TextinputInputField
          v-model="newPassword"
          name="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          label="New Password"
          placeholder="Enter new password"
          :error="errors.newPassword"
          @toggle-password="showNewPassword = !showNewPassword"
        />

        <!-- Confirm Password -->
        <TextinputInputField
          v-model="confirmPassword"
          name="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirm New Password"
          placeholder="Confirm new password"
          :error="errors.confirmPassword"
          @toggle-password="showConfirmPassword = !showConfirmPassword"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end mt-[34px]">
        <button
          type="submit"
          :disabled="isLoading || !meta.valid"
          class="w-[235px] h-[45px] bg-[#1570EF] text-white text-base font-[800] rounded-[5px] hover:bg-[#0F5BD3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span
            v-if="isLoading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          Update Password
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { changePassword } from "~/services/userservices";
import { useToast } from "~/composables/useToast";

const toast = useToast();

const isLoading = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Form validation schema
const formSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Current password is required")
    .min(8, "Password must be at least 8 characters"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const { handleSubmit, defineField, errors, meta, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
});

const [currentPassword] = defineField("currentPassword");
const [newPassword] = defineField("newPassword");
const [confirmPassword] = defineField("confirmPassword");

// Submit form
const onSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true;

  try {
    const res = await changePassword({
      ...formValues,
      oldPassword: formValues.currentPassword,
    });

    if (res.status === 200) {
      toast.success("Password updated successfully");
      resetForm();
    }
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.Message ||
      "Password change unsuccessful";
    toast.error(message);
  } finally {
    isLoading.value = false;
  }
});
</script>
