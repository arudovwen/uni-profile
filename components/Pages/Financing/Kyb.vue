<template>
  <form @submit.prevent="onSubmit" class="w-full mt-6">
    <div class="grid grid-cols-2 gap-x-[25px] gap-y-4 mb-[50px]">
      <div class="md:col-span-2">
        <Textinput
          placeholder=""
          label="Company name"
          name="companyName"
          v-bind="companyNameAtt"
          v-model="companyName"
          :error="errors.companyName"
          :isRequired="true"
        />
      </div>
      <Textinput
        placeholder=""
        label="Email"
        name="email"
        v-bind="emailAtt"
        v-model="email"
        :error="errors.email"
        disabled
        :isRequired="true"
      />
      <FormGroup
        label="Phone number"
        name="phone"
        :error="errors.phone"
        :isRequired="true"
      >
        <FormsPhoneCodes v-model="phone" />
      </FormGroup>
      <FormGroup
        :isRequired="true"
        label="Country"
        :error="errors.country"
        name="sector"
      >
        <SelectVueSelect
          :options="allcountries"
          v-model.value="country"
          :reduce="(country) => country.value"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.country ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>
      <FormGroup
        :isRequired="true"
        label="State"
        :error="errors.state"
        name="state"
      >
        <SelectVueSelect
          :options="mystates"
          :reduce="(state) => state.value"
          v-model="state"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.state ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>

      <FormGroup
        label="Date of incorporation"
        name="dateOfIncorporation"
        :error="errors.dateOfIncorporation"
        :isRequired="true"
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

      <FormGroup
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
      </FormGroup>

      <FormGroup
        :isRequired="true"
        label="Sector"
        :error="errors.sector"
        name="sector"
      >
        <Select
          v-model="sector"
          :options="sectorOptions"
          :disabled="!category"
          placeholder="Select sector"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.sector ? 'border-red-500' : 'border-[#D0D5DD]'
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
      />
      <Textinput
        v-if="country?.toLowerCase() === 'nigeria'"
        placeholder=""
        label="TIN number"
        name="tin"
        v-bind="tinAtt"
        v-model="tin"
        :error="errors.tin"
        :isRequired="true"
      />
      <div>
        <Textinput
          :isRequired="true"
          placeholder=""
          label="City"
          name="city"
          v-bind="cityAtt"
          v-model="city"
          :error="errors.city"
        />
      </div>
      <div class="md:col-span-2">
        <Textinput
          :isRequired="true"
          placeholder=""
          label="Business address"
          name="address"
          v-bind="addressAtt"
          v-model="address"
          :error="errors.address"
        />
      </div>
      <div class="md:col-span-2">
        <Textarea
          :isRequired="true"
          placeholder=""
          label="Brief description of the company"
          name="description"
          v-bind="descriptionAtt"
          v-model="description"
          :error="errors.description"
        />
      </div>
      <div class="md:col-span-2 mt-6">
        <label
          for="companyDocuments"
          class="mb-4 mt-3 font-medium text-sm block"
          >Upload the documents listed below
        </label>

        <div class="w-full" v-if="country">
          <DocumentsUpload
            :documents="companyDocuments"
            @get-docs="handleDocUpdate"
            :isNonNigerian="country?.toLowerCase() !== 'nigeria'"
          />
        </div>
      </div>
    </div>
    <div class="flex gap-x-4 items-center justify-end">
      <AppButton
        @click="active--"
        btnClass="bg-white text-white !px-11  !text-sm !py-[10px] disabled:cursor-not-allowed border border-[#BDC0C5] !rounded-lg !text-[#333]"
        type="button"
        text="Back"
      />
      <AppButton
        :disabled="
          isLoading ||
          (country?.toLowerCase() === 'nigeria' && (!registrationNo || !tin))
        "
        :isLoading="isLoading"
        btnClass="bg-primary-500
      text-white !px-12 !text-sm !py-[10px] disabled:cursor-not-allowed border
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

import {
  updateCompanyProfile,
  updateDocuments,
} from "~/services/settingservices";
import { toast } from "vue3-toastify";

const company = inject("company");
const formData = inject("formData");
const isLoading = ref(false);
const active = inject("active");
const authStore = useAuthStore();
const formSchema = yup.object().shape({
  companyName: yup.string().required("Company Name is required"),
  sector: yup.string().required("Sector is required"),
  dateOfIncorporation: yup
    .date()
    .typeError("Invalid date Of Incorporation")
    .nullable()
    .required("Date Of Incorporation is required"),
  category: yup.string().required("Business Type is required"),
  address: yup.string().required("Address is required"),
  description: yup.string().nullable(),
  companyDocuments: yup.array(),
  country: yup.string().required(),
  state: yup.string().required(),
  email: yup.string().required(),
  phone: yup.string().required(),
  city: yup.string().required(),
  registrationNo: yup.string().when("country", {
    is: "Nigeria",
    then: (schema) =>
      schema
        .min(7, "Provide a valid number")
        .required("CAC Registration number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  tin: yup.string().when("country", {
    is: "Nigeria",
    then: (schema) => schema.required("TIN is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
const options = [
  {
    label: "Company profile",
    value: 4,
  },
  {
    label: "Certificate of Incorporations",
    value: 0,
  },
  {
    label: "Memorandum and Articles of Association",
    value: 1,
  },
  {
    label: "CAC Status Report",
    value: 2,
  },
  {
    label: "Utility Bill",
    value: 3,
  },
];
const {
  handleSubmit,
  defineField,
  errors,
  setFieldValue,
  setValues,
  isFieldTouched,
  values,
} = useForm({
  validationSchema: formSchema,
  initialValues: formData.kyb,
});

const [companyDocuments] = defineField("companyDocuments");
const [companyName, companyNameAtt] = defineField("companyName");
const [registrationNo, registrationNoAtt] = defineField("registrationNo");
const [tin, tinAtt] = defineField("tin");
const [sector] = defineField("sector");
const [email, emailAtt] = defineField("email");
const [phone] = defineField("phone");
const [dateOfIncorporation] = defineField("dateOfIncorporation");
const [category] = defineField("category");
const [address, addressAtt] = defineField("address");
const [description, descriptionAtt] = defineField("description");
const [country] = defineField("country");
const [state] = defineField("state");
const [city, cityAtt] = defineField("city");
const allcountries = computed(() => {
  return CountryList.map((item) => {
    return {
      id: "",
      label: `${item.name}`,
      value: item.name,
    };
  });
});
const getCompanyData = inject("getCompanyData");

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
  setValues({ ...company?.value, ...formData.kyb } || {});
});

function handleDocUpdate(data) {
  setFieldValue("companyDocuments", data);
}

watch(country, () => {
  const isNigeria = country?.value?.toLowerCase() === "nigeria";
  const defaultDocuments = [
    {
      urls: [{ url: "" }],
      url: "",
      documentType: 1,
    },
    {
      urls: [{ url: "" }],
      url: "",
      documentType: 2,
    },
    {
      urls: [{ url: "" }],
      url: "",
      documentType: 3,
    },
  ];

  // Filter documents based on document type (0 and 4)
  const filterDocuments = (documents) =>
    documents.filter((i) => i.documentType === 0 || i.documentType === 4);

  if (!isNigeria) {
    const filteredDocuments = filterDocuments(formData.kyb?.companyDocuments);
    setFieldValue("companyDocuments", filteredDocuments);
    formData.kyb.companyDocuments = filteredDocuments;
  } else {
    const updatedDocuments = [
      ...formData.kyb?.companyDocuments,
      ...defaultDocuments,
    ];
    setFieldValue("companyDocuments", updatedDocuments);
    formData.kyb.companyDocuments = updatedDocuments;
  }
});

const onSubmit = handleSubmit((values) => {
  if (
    country.value?.toLowerCase() === "nigeria" &&
    (values.companyDocuments.some(
      (i) => i.urls.filter((i) => i.url).length === 0
    ) ||
      values.companyDocuments.length !== 5)
  ) {
    toast.error("Please upload all available document types");
    return;
  }
  const nonNigerian = values.companyDocuments
    .filter((i) => [0, 4].includes(i.documentType))
    .some((i) => i.urls.filter((i) => i.url).length == 0);

  if (
    country.value?.toLowerCase() !== "nigeria" &&
    (nonNigerian || values.companyDocuments.length !== 2)
  ) {
    toast.error("Please upload all available document types");
    return;
  }
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
        updateDocuments({
          companyDocuments: values.companyDocuments.map((i) => ({
            ...i,
            urls: i.urls.map((j) => j.url),
          })),
        })
          .then((res) => {
            isLoading.value = false;
          })
          .catch((err) => {
            isLoading.value = false;
            toast.error(
              err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Something went wrong, try again later"
            );
          });
        // }
        active.value = 3;
      }
      getCompanyData();
    })
    .catch((err) => {
      isLoading.value = false;
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Something went wrong, try again later"
      );
    });

  // formData.kyb = values;
});

const categorysOptions = businessTypes?.map((i) => {
  return {
    label: i.sector,
    value: i.sector,
  };
});
const sectorOptions = computed(() => {
  const selectedcategory = businessTypes?.find(
    (i) => i.sector === category.value
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

