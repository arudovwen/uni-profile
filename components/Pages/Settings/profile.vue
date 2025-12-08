<template>
  <div class="w-full mx-auto max-w-[640px] px-4 lg:px-0">
    <div class="flex items-center justify-between mb-6">
      <HeaderComponent
        title="Personal info"
        subtext="Update your photo and personal details here."
      />

      <div v-if="refDetail">
        <span class="text-xs text-[#98A2B3] block text-right mb-0.5"
          >Referral code</span
        >
        <button
          @click="openRef = true"
          type="button"
          class="flex items-center text-xs gap-x-2.5 bg-[#EAECF5] rounded-lg px-2.5 py-2"
        >
          <span>{{refDetail.referralCode}}</span> <AppIcon icon="lucide:copy" />
        </button>
      </div>
    </div>
    <div class="w-full bg-white rounded-lg py-6 border border-[#E9EAEB]">
      <form @submit.prevent="onSubmit" class="w-full">
        <div class="flex items-center px-6 mb-6 gap-x-4">
          <span
            class="h-16 w-16 bg-gray-100 rounded-full block border border-[#E4E7EC]"
          >
            <img :src="photo" class="object-cover w-16 h-16 rounded-full" />
          </span>
          <div class="flex-1">
            <FileUploadToo v-model="photo" accept="jpg, jpeg, png" />
          </div>
        </div>
        <div
          class="grid grid-cols-1 xl:grid-cols-2 gap-x-[25px] gap-y-4 mb-6 px-6"
        >
          <Textinput
            placeholder=""
            label="First name"
            name="firstName"
            v-bind="firstNameAtt"
            v-model="firstName"
            :error="errors.firstName"
            :isRequired="true"
          />

          <Textinput
            placeholder=""
            label="Last name"
            name="lastName"
            v-bind="lastNameAtt"
            v-model="lastName"
            :error="errors.lastName"
            :isRequired="true"
          />

          <div>
            <Textinput
              placeholder=""
              label="Email address"
              name="contactEmail"
              v-bind="emailAtt"
              v-model="contactEmail"
              :error="errors.contactEmail"
              :isRequired="true"
              icon="fe:mail"
              icon-position="left"
              :disabled="!!contactEmail"
            />
          </div>
          <FormGroup
            label="Phone number"
            name="phone"
            :error="errors.phone"
            :isRequired="true"
          >
            <FormsPhoneCodes v-model="phone" />
          </FormGroup>

          <!-- <FormGroup
              label="Business type"
              :error="errors.category"
              name="category"
              :isRequired="true"
            >
              <Select
                v-model="category"
                :options="categorysOptions"
                placeholder="Select type"
                :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
                  errors.tenor ? 'border-red-500' : 'border-[#D0D5DD]'
                }`"
              />
            </FormGroup> -->

          <div class="xl:col-span-2">
            <Textinput
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
  <IndexModal :is-open="openRef" @toggle-popup="openRef = false">
    <template #content>
      <PagesSettingsReferralLinks :refDetail="refDetail" />
    </template>
  </IndexModal>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { getUserProfile, updateUserProfile } from "~/services/settingservices";
import { toast } from "vue3-toastify";
import { getRefferralByUser } from "../../../services/userservices";

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
const openRef = ref(false);
const refDetail = ref(null);

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
  address: yup.string(),
  photo: yup.mixed().required("Photo is required"),
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

const [address, addressAtt] = defineField("address");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  updateUserProfile({
    ...values,
  })
    .then((res) => {
      if (res.status === 200) {
        isLoading.value = false;
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

async function fetchRefDetail() {
  try {
    const { data } = await getRefferralByUser();
    refDetail.value = data?.data;
  } catch {}
}

onMounted(() => {
  fetchRefDetail();
});
</script>
