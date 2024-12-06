<template>
  <div class="w-full mx-auto max-w-[640px]  px-4 lg:px-0">
    <div class="mb-6 ">
      <HeaderComponent
        title="Password"
        subtext="Please enter your current password to change your password."
      />
    </div>
    <div class="w-full bg-white rounded-lg py-6 border border-[#E9EAEB]">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-y-6 w-full">
        <div class="px-6 w-full flex flex-col gap-y-6">
          <Textinput
            label="Current Password"
            placeholder="Current Password"
            type="password"
            name="oldPassword"
            v-bind="oldPasswordAtt"
            v-model="oldPassword"
            :error="errors.oldPassword"
            isCumpulsory
            iconType="password"
            icon-position="left"
            :hasicon="true"
          />

          <Textinput
            placeholder="New Password"
            type="password"
            label="New Password"
            name="newPassword"
            v-bind="newPasswordAtt"
            v-model="newPassword"
            :error="errors.newPassword"
            isCumpulsory
            description="Your new password must be more than 8 characters."
            iconType="password"
            icon-position="left"
            :hasicon="true"
          />

          <Textinput
            placeholder="New Password"
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            v-bind="confirmPasswordAtt"
            v-model="confirmPassword"
            :error="errors.confirmPassword"
            isCumpulsory
            iconType="password"
            icon-position="left"
            :hasicon="true"
          />
        </div>
        <div
          class="flex gap-x-4 items-center justify-end border-t border-[#E9EAEB] pt-4 px-6"
        >
          <AppButton
            text="Update password"
            :is-disabled="
              !meta.valid || values.hasIndemnityClauseChecked === false
            "
            type="submit"
            @click="onSubmit"
            :is-loading="isLoading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { changePassword } from "~/services/userservices";
import * as yup from "yup";

const schema = yup.object({
  oldPassword: yup
    .string()
    .required(
      "Password must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
  newPassword: yup
    .string()
    .required(
      "Password must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

const isLoading = ref(false);

const formValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const authStore = useAuthStore();

const {
  handleSubmit,
  defineField,
  errors,
  values,
  meta,
  setFieldValue,
  resetForm,
} = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

const [oldPassword, oldPasswordAtt] = defineField("oldPassword");
const [newPassword, newPasswordAtt] = defineField("newPassword");
const [confirmPassword, confirmPasswordAtt] = defineField("confirmPassword");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  changePassword(values)
    .then(() => {
      toast.success("Password updated");
      resetForm();
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.Message || "Password change unsuccessful"
      );
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style lang="scss" scoped></style>
