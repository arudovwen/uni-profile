<template>
  <form @submit.prevent="onSubmit" class="w-full mt-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-[25px] gap-y-4 mb-6 px-6">
      <Textinput
        placeholder=""
        label="Company name"
        name="companyName"
        v-bind="companyNameAtt"
        v-model="companyName"
        :error="errors.companyName"
        :isCumpulsory="true"
      />

      <FormGroup
        label="Date of incorporation"
        name="dateOfIncorporation"
        :error="errors.dateOfIncorporation"
        :isCumpulsory="true"
      >
        <ClientOnly>
          <VueDatePicker
            auto-apply
            v-model="dateOfIncorporation"
            placeholder="Select date"
            :enable-time-picker="false"
            :input-class-name="`!rounded-lg px-[14px] py-[10px] h-11 w-full border  placeholder:text-[#B6B7B9] focus:outline-matta-black/20
                        border-[#DCDEE6]`"
          />
        </ClientOnly>
      </FormGroup>
      <Textinput
        placeholder=""
        label="Email address"
        name="companyEmail"
        v-bind="emailAtt"
        v-model="companyEmail"
        :error="errors.companyEmail"
        :isCumpulsory="true"
        icon="fe:mail"
        icon-position="left"
        :disabled="(!!companyEmail && !!form?.onboardingStatus)"
      />
      <FormGroup
        label="Phone number"
        name="companyPhone"
        :error="errors.companyPhone"
        :isCumpulsory="true"
      >
        <FormsPhoneCodes v-model="companyPhone" />
      </FormGroup>
      <FormGroup
        :isCumpulsory="true"
        label="Country"
        :error="errors.country"
        name="sector"
      >
        <Select
          :options="allcountries"
          v-model.value="country"
          :reduce="(country) => country.value"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.country ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>
      <FormGroup
        :isCumpulsory="true"
        label="State"
        :error="errors.state"
        name="state"
      >
        <Select
          :options="mystates"
          :reduce="(state) => state.value"
          v-model="state"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.state ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>
      <FormGroup
        :isCumpulsory="true"
        label="Business Sector"
        :error="errors.sector"
        name="sector"
      >
        <Select
          v-model="sector"
          :options="sectorOptions"
          placeholder="Select sector"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.sector ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>

      <FormGroup
        label="Business category"
        :error="errors.category"
        name="category"
        :isCumpulsory="true"
      >
        <Select
          v-model="category"
          :disabled="!sector"
          :options="categorysOptions"
          placeholder="Select type"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.tenor ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>

      <Textinput
        v-if="country?.toLowerCase() === 'nigeria'"
        placeholder=""
        label="CAC Registration number"
        name="registrationNo"
        v-bind="registrationNoAtt"
        v-model="registrationNo"
        :error="errors.registrationNo"
        :isCumpulsory="true"
      />
      <Textinput
        v-if="country?.toLowerCase() === 'nigeria'"
        placeholder=""
        label="TIN number"
        name="tin"
        v-bind="tinAtt"
        v-model="tin"
        :error="errors.tin"
        :isCumpulsory="true"
      />

      <div class="md:col-span-2">
        <Textinput
          :isCumpulsory="true"
          placeholder=""
          label="Business address"
          name="address"
          v-bind="addressAtt"
          v-model="address"
          :error="errors.address"
          icon="majesticons:map-marker-area-line"
          icon-position="left"
        />
      </div>
      <div>
        <Textinput
          placeholder=""
          label="Company website"
          name="website"
          v-bind="cityAtt"
          v-model="website"
          :error="errors.website"
        />
      </div>
      <div>
        <Textinput
          :isCumpulsory="true"
          placeholder=""
          label="City"
          name="city"
          v-bind="cityAtt"
          v-model="city"
          :error="errors.city"
        />
      </div>
      <div class="md:col-span-2">
        <Textarea
          :isCumpulsory="true"
          placeholder=""
          label="Brief description of the company"
          name="notes"
          v-bind="notesAtt"
          v-model="notes"
          :error="errors.notes"
        />
      </div>
    </div>
    <div
      v-if="authStore?.userInfo?.userCategory === 1"
      class="flex gap-x-4 items-center justify-end border-t border-[#E9EAEB] pt-6 px-6"
    >
      <AppButton
        :disabled="isLoading"
        :isLoading="isLoading"
        btnClass="bg-primary-500
      text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border
      !rounded-lg border-primary-500"
        type="submit"
        text="Next"
      />
    </div>
  </form>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import CountryList from "country-list-with-dial-code-and-flag";
import countries from "~/utils/countries.json";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { updateCompanyProfile } from "~/services/settingservices";
import { toast } from "vue3-toastify";

const form = inject("form");
console.log("🚀 ~ form:", form)
const isLoading = ref(false);
const active = inject("active");
const authStore = useAuthStore();
const formSchema = yup.object({
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters long")
    .max(100, "Company name cannot exceed 100 characters"),

  dateOfIncorporation: yup
    .date()
    .required("Date of incorporation is required")
    .max(new Date(), "Date of incorporation cannot be in the future"),

  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  companyEmail: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  companyPhone: yup.string().required("Phone number is required").min(10), // Adjust companyPhone number pattern to your country format

  sector: yup.string().required("Business sector is required"),
  category: yup.string().required("Business type is required"),
  registrationNo: yup.string().when("country", {
    is: (country) => country?.toLowerCase() === "nigeria",
    then: (schema) => schema.required("CAC registration number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  tin: yup.string().when("country", {
    is: (country) => country?.toLowerCase() === "nigeria",
    then: (schema) => schema.required("TIN number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  website: yup.string().nullable(),
  // .required("Company website is required"),

  address: yup
    .string()
    .required("Company address is required")
    .min(2, "Address must be at least 5 characters long"),

  city: yup
    .string()
    .required("City is required")
    .min(2, "City name must be at least 2 characters long"),

  notes: yup
    .string()
    // .required("Description is required")
    // .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
});

const { handleSubmit, defineField, errors, setFieldValue, setValues, values } =
  useForm({
    validationSchema: formSchema,
    initialValues: form,
  });

const [companyName, companyNameAtt] = defineField("companyName");
const [registrationNo, registrationNoAtt] = defineField("registrationNo");
const [tin, tinAtt] = defineField("tin");
const [sector] = defineField("sector");
const [companyEmail, emailAtt] = defineField("companyEmail");
const [companyPhone] = defineField("companyPhone");
const [dateOfIncorporation] = defineField("dateOfIncorporation");
const [category] = defineField("category");
const [address, addressAtt] = defineField("address");
const [notes, notesAtt] = defineField("notes");
const [country] = defineField("country");
const [state] = defineField("state");
const [city, cityAtt] = defineField("city");
const [website] = defineField("website");

const allcountries = computed(() => {
  return CountryList.map((item) => {
    return {
      id: "",
      label: `${item.name}`,
      value: item.name,
    };
  });
});

const states = computed(() => {
  if (!country.value) return [];
  return countries.find(
    (item) => item.name.toLowerCase() == country.value?.toLowerCase()
  )?.states;
});

const mystates = computed(() => {
  return states.value?.map((item) => {
    return {
      id: item.code,
      label: item.name,
      value: item.name,
    };
  });
});

onMounted(() => {
  // setValues({ ...company?.value} || {});
});

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  updateCompanyProfile({
    ...values,
    companyDocuments: values.companyDocuments.map((i) => ({
      ...i,
      urls: i.urls.map((j) => j.url),
    })),
  })
    .then((res) => {
      if (res.status === 200) {
        Object.keys(values).forEach((key) => {
          form[key] = values[key];
        });
        active.value = 2;
        toast.success("Information saved");
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

const sectorOptions = businessTypes?.map((i) => {
  return {
    label: i.sector,
    value: i.sector,
  };
});
const categorysOptions = computed(() => {
  const selectedcategory = businessTypes?.find(
    (i) => i.sector === sector.value
  );
  if (!selectedcategory) return []; // Handle case when selected business type is not found

  return (
    selectedcategory.subSectors?.map((i) => {
      return {
        label: i.subSectorName,
        value: i.subSectorName, // Use subSectorCode as the value
      };
    }) ?? []
  ); // Use optional chaining and nullish coalescing operators for safer property access
});
provide("handleChange", null);
</script>
