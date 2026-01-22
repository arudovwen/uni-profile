<template>
  <div
    class="bg-white rounded-lg border border-[#E4E7EC] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] py-6 sm:py-8 px-4 sm:px-6 lg:px-[51px] max-w-[723px]"
  >
    <div class="mb-6">
      <h2 class="text-sm sm:text-base font-[800] text-[#344054] leading-6">
        Business Information
      </h2>
      <p class="text-xs sm:text-sm font-medium text-[#475467] leading-5 mt-0.5">
        Update your business details.
      </p>
    </div>

    <!-- Logo Upload Section -->
    <div class="mb-6 flex gap-x-4 items-center">
      <span
        class="h-16 w-16 bg-gray-100 rounded-full flex-shrink-0 border border-[#E4E7EC] overflow-hidden"
      >
        <img
          v-if="logo"
          :src="logo"
          class="h-16 w-16 rounded-full object-cover"
        />
      </span>
      <div class="flex-1">
        <FileUploadToo
          v-model="logo"
          accept="jpg,jpeg,png"
          :is-link-only="true"
          link-text="Upload business logo"
        />
      </div>
    </div>

    <!-- Business Form -->
    <form @submit.prevent="onSubmit" class="w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-[25px] gap-y-4 mb-6">
        <!-- Company Name -->
        <Textinput
          placeholder=""
          label="Company name"
          name="companyName"
          v-bind="companyNameAtt"
          v-model="companyName"
          :error="errors.companyName"
          :isRequired="true"
        />

        <!-- Date of Incorporation -->
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
              :input-class-name="`!rounded-lg px-[14px] py-[10px] h-11 w-full border placeholder:text-[#B6B7B9] focus:outline-matta-black/20 border-[#DCDEE6]`"
            />
          </ClientOnly>
        </FormGroup>

        <!-- Email Address -->
        <Textinput
          placeholder=""
          label="Email address"
          name="companyEmail"
          type="email"
          v-bind="emailAtt"
          v-model="companyEmail"
          :error="errors.companyEmail"
          :isRequired="true"
          icon="fe:mail"
          icon-position="left"
        />

        <!-- Phone Number -->
        <PhoneNumber
          v-model="companyPhone"
          label="Phone number"
          name="companyPhone"
          :error="errors.companyPhone"
          :is-required="true"
          placeholder="0816*******"
        />

        <!-- Country -->
        <div>
          <OnboardingCustomDropdown
            v-model="country"
            :options="allcountries"
            placeholder="Select country"
            :button-class="'rounded-lg w-full'"
            label="Country"
            :show-search-filter="true"
            :error="errors.country"
            :show-asterisk="true"
          />
        </div>

        <!-- State -->
        <OnboardingCustomDropdown
          v-model="state"
          :options="mystates"
          placeholder="Select state"
          :button-class="'rounded-lg w-full'"
          label="State"
          :show-search-filter="true"
          :error="errors.state"
          :show-asterisk="true"
          :disabled="!country"
        />

        <!-- Business Sector -->
        <OnboardingCustomDropdown
          v-model="sector"
          :options="sectorOptions"
          placeholder="Select sector"
          :button-class="'rounded-lg w-full'"
          label="Business sector"
          :show-search-filter="true"
          :error="errors.sector"
          :show-asterisk="true"
        />

        <!-- Business Type/Category -->
        <OnboardingCustomDropdown
          v-model="category"
          :options="categorysOptions"
          placeholder="Select type"
          label="Business type"
          :button-class="'rounded-lg w-full'"
          :show-search-filter="true"
          :error="errors.category"
          :show-asterisk="true"
          :disabled="!sector"
        />

        <!-- Company Registration Number (Nigeria only) -->
        <Textinput
          v-if="country?.code?.toLowerCase() === 'nigeria'"
          placeholder=""
          label="CAC registration number"
          name="registrationNo"
          v-bind="registrationNoAtt"
          v-model="registrationNo"
          :error="errors.registrationNo"
          :isRequired="true"
        />

        <!-- TAX Identification Number (Nigeria only) -->
        <Textinput
          v-if="country?.code?.toLowerCase() === 'nigeria'"
          placeholder=""
          label="TAX identification number"
          name="tin"
          v-bind="tinAtt"
          v-model="tin"
          :error="errors.tin"
          :isRequired="true"
        />

        <!-- Company Address (Full width) -->
        <div class="lg:col-span-2">
          <Textinput
            :isRequired="true"
            placeholder=""
            label="Company address"
            name="address"
            v-bind="addressAtt"
            v-model="address"
            :error="errors.address"
            icon="majesticons:map-marker-area-line"
            icon-position="left"
          />
        </div>

        <!-- City -->
        <Textinput
          :isRequired="true"
          placeholder=""
          label="City"
          name="city"
          v-bind="cityAtt"
          v-model="city"
          :error="errors.city"
        />

        <!-- Company Website -->
        <Textinput
          placeholder=""
          label="Company website"
          name="website"
          type="url"
          v-bind="websiteAtt"
          v-model="website"
          :error="errors.website"
        />
      </div>

      <!-- Form Actions -->
      <div
        class="flex gap-x-4 items-center justify-end pt-6"
      >
        <AppButton
          :disabled="isLoading"
          :isLoading="isLoading"
          btnClass="bg-primary-500 text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border !rounded-lg border-primary-500"
          type="submit"
          text="Save Changes"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import CountryList from "country-list-with-dial-code-and-flag";
import countries from "~/utils/countries.json";
import { useForm } from "vee-validate";
import * as yup from "yup";
import {
  updateCompanyProfile,
  getBusinessProfile,
} from "~/services/settingservices";
import { toast } from "vue3-toastify";

// Note: businessTypes is auto-imported by Nuxt

const isLoading = ref(false);
const logo = ref("");

// Form Schema
const formSchema = yup.object({
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),

  dateOfIncorporation: yup
    .date()
    .required("Date of incorporation is required")
    .max(new Date(), "Date cannot be in the future"),

  country: yup.object().nullable().required("Country is required"),

  state: yup.object().nullable().required("State is required"),

  companyEmail: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  companyPhone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 characters"),

  sector: yup.object().nullable().required("Business sector is required"),

  category: yup.object().nullable().required("Business type is required"),

  registrationNo: yup.string().when("country", {
    is: (country) => country?.code?.toLowerCase() === "nigeria",
    then: (schema) => schema.required("CAC registration number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  tin: yup.string().when("country", {
    is: (country) => country?.code?.toLowerCase() === "nigeria",
    then: (schema) => schema.required("TAX identification number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  address: yup
    .string()
    .required("Company address is required")
    .min(5, "Address must be at least 5 characters"),

  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),

  website: yup.string().nullable().url("Website must be a valid URL"),

  logo: yup.mixed().nullable(),
});

// Form Setup
const { handleSubmit, defineField, errors, setFieldValue, setValues, values } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      companyName: "",
      dateOfIncorporation: null,
      companyEmail: "",
      companyPhone: "",
      country: null,
      state: null,
      sector: null,
      category: null,
      registrationNo: "",
      tin: "",
      address: "",
      website: "",
      city: "",
    },
  });

// Define Fields
const [companyName, companyNameAtt] = defineField("companyName");
const [registrationNo, registrationNoAtt] = defineField("registrationNo");
const [tin, tinAtt] = defineField("tin");
const [sector] = defineField("sector");
const [companyEmail, emailAtt] = defineField("companyEmail");
const [companyPhone] = defineField("companyPhone");
const [dateOfIncorporation] = defineField("dateOfIncorporation");
const [category] = defineField("category");
const [address, addressAtt] = defineField("address");
const [country] = defineField("country");
const [state] = defineField("state");
const [city, cityAtt] = defineField("city");
const [website, websiteAtt] = defineField("website");

// Computed Options
const allcountries = computed(() => {
  return CountryList.map((item) => ({
    code: item.name,
    name: item.name,
  }));
});

const mystates = computed(() => {
  if (!country.value?.code) return [];
  const selectedCountry = countries.find(
    (item) => item.name.toLowerCase() == country.value?.code?.toLowerCase(),
  );
  return (
    selectedCountry?.states?.map((item) => ({
      code: item.code,
      name: item.name,
    })) || []
  );
});

const sectorOptions = computed(() => {
  return (
    businessTypes?.map((i) => ({
      code: i.sector,
      name: i.sector,
    })) || []
  );
});

const categorysOptions = computed(() => {
  const selectedSector = businessTypes?.find(
    (i) => i.sector === sector.value?.code,
  );
  if (!selectedSector) return [];

  return (
    selectedSector.subSectors?.map((i) => ({
      code: i.subSectorName,
      name: i.subSectorName,
    })) || []
  );
});

// Load existing data on mount
onMounted(() => {
  getBusinessProfile()
    .then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        // Convert country, state, sector, category to CustomDropdown format
        const processedData = {
          ...data,
          country: data.country
            ? { code: data.country, name: data.country }
            : null,
          state: data.state ? { code: data.state, name: data.state } : null,
          sector: data.sector ? { code: data.sector, name: data.sector } : null,
          category: data.category
            ? { code: data.category, name: data.category }
            : null,
        };
        setValues(processedData);
        if (data.logo) {
          logo.value = data.logo;
        }
      }
    })
    .catch((err) => {
      console.error("Error loading business profile:", err);
    });
});

// Form Submission
const onSubmit = handleSubmit((formValues) => {
  isLoading.value = true;
  updateCompanyProfile({
    ...formValues,
    country: country.value?.code || formValues.country,
    state: state.value?.code || formValues.state,
    sector: sector.value?.code || formValues.sector,
    category: category.value?.code || formValues.category,
    logo: logo.value,
  })
    .then((res) => {
      if (res.status === 200) {
        toast.success("Business information saved successfully");
        isLoading.value = false;
      }
    })
    .catch((err) => {
      isLoading.value = false;
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Failed to save business information",
      );
    });
});
</script>
