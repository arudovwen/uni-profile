<template>
  <div
    class="flex flex-col items-center p-0 pt-6 w-full bg-white z-10 min-w-[450px]"
  >
    <div class="deco flex flex-col items-center gap-[16px] mb-6 z-0">
      <div
        class="flex flex-col items-center p-0 gap-[4px] flex-none order-1 self-stretch flex-grow-0"
      >
        <div
          class="flex-none flex justify-center items-center order-0 flex-grow-0 w-[48px] h-[48px] bg-[#D1E9FF] border-[8px] border-[#EFF8FF] rounded-[28px]"
        >
          <ProfileAddIcon class="text-[#0058E5] !h-[24px] !w-[24px]" />
        </div>

        <div
          class="text-center flex-none order-0 self-stretch flex-grow-0 w-[352px]"
        >
          <span
            class="font-Onest font-semibold text-[18px] leading-[28px] text-[#101828]"
          >
            Invite a Team member
          </span>
        </div>
        <div
          v-if="!detail"
          class="text-center flex-none order-1 self-stretch flex-grow-0 w-[352px]"
        >
          <span
            class="font-Onest font-normal text-[14px] leading-[20px] text-[#475467]"
          >
            Invite team members to join your organization
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start p-0 gap-[16px] w-full">
      <form @submit.prevent="onSubmit" class="grid w-full grid-cols-1 gap-y-4">
        <div>
          <Textinput
            placeholder="Email address"
            label="Email Address"
            type="email"
            name="email"
            iconType="email"
            v-bind="emailAtt"
            v-model="email"
            :error="errors.email"
            icon-position="left"
          />
        </div>
        <div>
          <FormGroup label="Role" :error="errors.role" name="role">
            <SelectVueSelect
              v-model="role"
              :options="roles"
              :placeholder="'Select role'"
              :reduce="(role) => role.value"
              :clearable="false"
            />
          </FormGroup>
        </div>

        <div class="flex gap-x-4 pt-4 p-0 w-full z-30">
          <AppButton
            btnClass="w-full text-[#344054] bg-white border-[#D0D5DD] border-[1px]"
            type="button"
            :is-disabled="isLoading"
            text="Cancel"
            @click="
              () => {
                isOpen = false;
              }
            "
          />
          <AppButton
            class="w-full"
            type="submit"
            :isLoading="isLoading"
            :is-disabled="isLoading"
            text="Send Invite"
          />
        </div>
      </form>
    </div>
  </div>
  <ActionModal
    :open="isSuccessOpen"
    type="approve"
    title="Invite Sent"
    text="Your invite has been sent. An email to confirm invite will be recieved within the next few minutes."
    btnText="Done"
    :isCancel="false"
    :isAnother="true"
    @anotherAction="
      () => {
        resetForm();
        isSuccessOpen = false;
      }
    "
    @actionItem="
      () => {
        isOpen = isSuccessOpen = false;
      }
    "
    @close="isOpen = isSuccessOpen = false"
  />
</template>

<script setup>
import ProfileAddIcon from "@/assets/images/svgs/profile-add.svg";
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { sendOwnerInvite } from "~/services/userservices";

const authStore = useAuthStore();
const props = defineProps(["detail"]);
const formValues = {
  email: "",
  role: 2,
  appCodes: authStore.userInfo.subAppCodes,
};
const roles = [
  {
    label: "Member",
    value: 2,
  },
];
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  role: yup.number().required("Role is required"),
  appCodes: yup.array().when("role", {
    is: 0,
    then: (schema) =>
      schema
        .min(1, "At least one sub-app is required when the role is Admin") // Require at least one sub-app
        .of(
          yup.object({
            appCode: yup.string().required("App code is required"),
            role: yup.string().required("Role is required for the sub-app"),
          })
        ),
    otherwise: (schema) => schema.notRequired(), // No validation if the role is not "Admin"
  }),
});

const {
  handleSubmit,
  defineField,
  errors,
  values,
  meta,
  resetForm,
  setValues,
  setFieldValue,
} = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

const [email, emailAtt] = defineField("email");
const [role] = defineField("role");

const isSuccessOpen = ref(false);
const isLoading = ref(false);
const isOpen = inject("isOpen");

const emits = defineEmits(["refresh"]);
const onSubmit = handleSubmit(async (values) => {

  try {
    isLoading.value = true;
    const response = await sendOwnerInvite({
      ...values,
      appCodes: authStore.userInfo.subAppCodes,
    });

    if (response.status === 200) {
      isSuccessOpen.value = true;
      emits("refresh");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
  } finally {
    isLoading.value = false;
  }
});
</script>
