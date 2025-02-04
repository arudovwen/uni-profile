<template>
  <div
    class="flex flex-col items-center w-full bg-white z-10 text-left min-w-[400px]"
  >
   <div class="text-left w-full">
    <div class="mb-4">
      <img alt="delete" src="/images/enable-user.svg" />
    </div>
    <h4 class="text-lg font-semibold mb-[6px]">Update User Role</h4>
    <p class="text-sm font-normal mb-6">
      Are you sure you want to update this user status?
    </p>
   </div>
    <div class="flex flex-col items-start p-0 gap-[16px] w-full">
      <form @submit.prevent="onSubmit" class="grid w-full grid-cols-1 gap-y-4">
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
               emits('close')
              }
            "
          />
          <AppButton
            class="w-full"
            type="submit"
            :isLoading="isLoading"
            :is-disabled="isLoading"
            text="Update Status"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import ProfileAddIcon from "@/assets/images/svgs/profile-add.svg";
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { addCustomer } from "~/services/userservices";

const props = defineProps(["detail"]);
const formValues = {
  role: "superadmin",
};
const roles = [
  {
    label: "Superadmin",
    value: "superadmin",
  },
  {
    label: "Admin",
    value: "admin",
  },
];
const schema = yup.object({
  role: yup.string().required("Role is required"),
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

const [role] = defineField("role");

const isLoading = ref(false);

const emits = defineEmits(["refresh", "close"]);
const onSubmit = handleSubmit(async (values) => {
  console.log("🚀 ~ onSubmit ~ values:", values);
  // try {
  //   isLoading.value = true;
  //   const response = await addCustomer(values);

  //   if (response.status === 200) {
  //     isSuccessOpen.value = true;
  //     emits("refresh");
  //   }
  // } catch (error) {
  //   toast.error(error.response?.data?.message || "An error occurred");
  // } finally {
  //   isLoading.value = false;
  // }
});
</script>
