<template>
  <div class="w-full bg-white rounded-lg py-6 p-6 border border-[#E9EAEB]">
    <div class="w-full max-w-[800px]">
      <form @submit.prevent="onSubmit" class="w-full grid gap-y-6">
        <div class="flex gap-x-10">
          <div class="lg:w-[300px] font-semibold text-sm">
            Full Name <span class="text-red-500">*</span>
          </div>
          <div class="flex-1 grid gap-y-6">
            <Textinput
              placeholder=""
              label="First name"
              name="firstName"
              v-bind="firstNameAtt"
              v-model="firstName"
              :error="errors.firstName"
              :isRequired="true"
              disabled
            />

            <Textinput
              placeholder=""
              label="Last name"
              name="lastName"
              v-bind="lastNameAtt"
              v-model="lastName"
              :error="errors.lastName"
              :isRequired="true"
              disabled
            />
          </div>
        </div>
        <div class="border-t border-[#E9EAEB]"></div>
        <div class="flex gap-x-10">
          <div class="lg:w-[300px] font-semibold text-sm">
            Email Address <span class="text-red-500">*</span>
          </div>
          <div class="flex-1">
            <div>
              <Textinput
                placeholder=""
                label=""
                name="contactEmail"
                v-bind="emailAtt"
                v-model="contactEmail"
                :error="errors.contactEmail"
                icon="fe:mail"
                icon-position="left"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="border-t border-[#E9EAEB]"></div>
        <div class="flex gap-x-10">
          <div class="lg:w-[300px] font-semibold text-sm">
            Phone Number <span class="text-red-500">*</span>
          </div>
          <div class="flex-1">
            <FormGroup
              label=""
              name="phone"
              :error="errors.phone"
              :isRequired="true"
            >
              <PhoneNumber v-model="phone" disabled />
            </FormGroup>
          </div>
        </div>

        <!-- <div
          class="flex gap-x-4 items-center justify-end border-t border-[#E9EAEB] pt-4 px-6"
        >
          <AppButton
            :disabled="isLoading"
            :isLoading="isLoading"
            btnClass="bg-primary-500 text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border  !rounded-lg border-primary-500"
            type="submit"
            text="Save changes"
          />
        </div> -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { getUserDetail, updateUserProfile } from "~/services/settingservices";
import { getSingleInvite } from "~/services/userservices";
import { toast } from "vue3-toastify";

const form = reactive({
  firstName: "",
  lastName: "",
  contactEmail: "",
  phone: "",
  address: "",
  photo: "", // assuming 'file' is a valid File object
  category: "",
});
const isLoading = ref(false);

const authStore = useAuthStore();
const { id } = useRoute().params;
onMounted(() => {
  getSingleInvite(id).then((res) => {
    if (res.status === 200) {
      const tempData = res.data.data;
      Object.keys(values).forEach((key) => {
        form[key] = tempData?.[key];
        if (tempData?.[key]) {
          setFieldValue(key, tempData?.[key]);
        }
      });
    }
  });

  getUserDetail(id).then((res) => {
    if (res.status === 200) {
      const tempData = res.data.data;
      Object.keys(values).forEach((key) => {
        form[key] = tempData?.[key];
        if (tempData?.[key]) {
          setFieldValue(key, tempData?.[key]);
        }
      });
    }
  });
});
const formSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  contactEmail: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  phone: yup.string().required("Phone number is required"),
  address: yup.string(),

  photo: yup.mixed().required("Photo is required"),

  category: yup
    .string()
    .required("Business category is required")
    .min(3, "Business category must be at least 3 characters")
    .max(50, "Business category must be less than 50 characters"),
});
const { handleSubmit, defineField, errors, setFieldValue, setValues, values } =
  useForm({
    validationSchema: formSchema,
    initialValues: form,
  });

const [firstName, firstNameAtt] = defineField("firstName");
const [lastName, lastNameAtt] = defineField("lastName");
const [contactEmail, emailAtt] = defineField("contactEmail");
const [phone] = defineField("phone");
const [photo] = defineField("photo");
const [category] = defineField("category");
const [address, addressAtt] = defineField("address");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  updateUserProfile({
    ...values,
  })
    .then((res) => {
      if (res.status === 200) {
        toast.success("Profile updated");
      }
    })
    .catch((err) => {
      isLoading.value = false;
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Something went wrong, try again later"
      );
    });
});

const categorysOptions = businessTypes?.map((i) => {
  return {
    label: i.sector,
    value: i.sector,
  };
});
</script>
