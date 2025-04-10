<template>
  <div class="w-full mx-auto max-w-[640px]">
    <div class="mb-6">
      <HeaderComponent
        title="Transaction pin"
        subtext="Please enter your current pin to change your pin."
      />
    </div>
    <div class="w-full bg-white rounded-lg py-6 border border-[#E9EAEB]">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-y-6 w-full">
        <div class="px-6 w-full flex flex-col gap-y-6">
          <Textinput
            label="Current Pin"
            placeholder="Current Pin"
            type="password"
            name="oldPin"
            v-bind="oldPinAtt"
            v-model="oldPin"
            :error="errors.oldPin"
            isRequired
          />

          <Textinput
            placeholder="New Pin"
            type="password"
            label="New Pin"
            name="newPin"
            v-bind="newPinAtt"
            v-model="newPin"
            :error="errors.newPin"
            isRequired
            description="Your new pin must be 4 characters."
          />

          <Textinput
            placeholder="New Pin"
            type="password"
            name="confirmPin"
            label="Confirm Pin"
            v-bind="confirmPinAtt"
            v-model="confirmPin"
            :error="errors.confirmPin"
            isRequired
          />
        </div>
        <div
          class="flex gap-x-4 items-center justify-end border-t border-[#E9EAEB] pt-4 px-6"
        >
          <AppButton
            text="Update pin"
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
  oldPin: yup
    .string()
    .required(
      "Pin must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Pin must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
  newPin: yup
    .string()
    .required(
      "Pin must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Pin must be at least 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&#)"
    ),
  confirmPin: yup
    .string()
    .required("Confirm Pin is required")
    .oneOf([yup.ref("newPin"), null], "Pins must match"),
});

const isLoading = ref(false);

const formValues = {
  oldPin: "",
  newPin: "",
  confirmPin: "",
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

const [oldPin, oldPinAtt] = defineField("oldPin");
const [newPin, newPinAtt] = defineField("newPin");
const [confirmPin, confirmPinAtt] = defineField("confirmPin");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  changePassword(authStore.jwToken, values)
    .then(() => {
      toast.success("Pin updated");
      resetForm();
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.Message || "Pin change unsuccessful"
      );
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style lang="scss" scoped></style>
