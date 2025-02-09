<template>
  <div class="w-full">
    <div class="mb-6">
      <HeaderComponent
        title="Personal info"
        subtext="Update your photo and personal details here."
      />
    </div>
    <div class="w-full bg-white rounded-lg py-6 border border-[#E9EAEB]">
      <form @submit.prevent="onSubmit" class="w-full">
        <div class="px-6 mb-6 flex gap-x-4 items-center">
          <span
            class="h-16 w-16 bg-gray-100 rounded-full block border border-[#E4E7EC]"
          >
            <img :src="photo" class="h-16 w-16 rounded-full object-cover" />
          </span>
          <div class="flex-1">
            <FileUploadToo v-model="photo" accept="jpg, jpeg,png" />
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-[25px] gap-y-4 mb-6 px-6">
          <Textinput
            placeholder=""
            label="First name"
            name="firstName"
            v-bind="firstNameAtt"
            v-model="firstName"
            :error="errors.firstName"
            :isCumpulsory="true"
          />

          <Textinput
            placeholder=""
            label="Last name"
            name="lastName"
            v-bind="lastNameAtt"
            v-model="lastName"
            :error="errors.lastName"
            :isCumpulsory="true"
          />

          <div class="md:col-span-2">
            <Textinput
              placeholder=""
              label="Email address"
              name="contactEmail"
              v-bind="emailAtt"
              v-model="contactEmail"
              :error="errors.contactEmail"
              :isCumpulsory="true"
              icon="fe:mail"
              icon-position="left"
              :disabled="!!contactEmail"
            />
          </div>
          <FormGroup
            label="Phone number"
            name="phone"
            :error="errors.phone"
            :isCumpulsory="true"
          >
            <FormsPhoneCodes v-model="phone" />
          </FormGroup>

          <FormGroup
            label="Business type"
            :error="errors.category"
            name="category"
            :isCumpulsory="true"
          >
            <Select
              v-model="category"
              :options="categorysOptions"
              placeholder="Select type"
              :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
                errors.tenor ? 'border-red-500' : 'border-[#D0D5DD]'
              }`"
            />
          </FormGroup>

          <div class="md:col-span-2">
            <Textinput
              :isCumpulsory="true"
              placeholder=""
              label="Address"
              name="address"
              v-bind="addressAtt"
              v-model="address"
              :error="errors.address"
              icon="majesticons:map-marker-area-line"
              icon-position="left"
            />
          </div>
        </div>
        <div
          class="flex gap-x-4 items-center justify-end border-t border-[#E9EAEB] pt-4 px-6"
        >
          <AppButton
            :disabled="isLoading"
            :isLoading="isLoading"
            btnClass="bg-primary-500
      text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border
      !rounded-lg border-primary-500"
            type="submit"
            text="Save changes"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import {
  getUserProfile,
  updateCompanyProfile,
  updateUserProfile,
} from "~/services/settingservices";
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
const phoneRegex = /^[0-9]{18}$/;

onMounted(() => {
  getUserProfile().then((res) => {
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
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be less than 100 characters"),

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
