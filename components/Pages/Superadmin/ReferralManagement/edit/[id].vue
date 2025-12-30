<template>
  <div class="flex flex-col bg-white w-full !rounded-[10px]">
    <div
      class="flex flex-row gap-x-4 border-b-[#F4F7FE] border-b-[1px] py-6 px-[30px]"
    >
      <span @click="navigateTo('/referral-management')">
        <ArrowLeft />
      </span>
      <span class="font-semibold text-[18px] leading-[28px] text-[#101828]"
        >Edit Referral</span
      >
    </div>
    <div class="flex flex-row py-9 gap-x-20 px-[30px]">
      <div class="flex flex-col gap-1">
        <span class="font-semibold text-sm text-[#101828]">
          Campaign Details
        </span>
        <span class="font-normal text-xs text-[#475467]"
          >Provide the required campaign info
        </span>
      </div>
      <div class="flex flex-col w-full max-w-[644px]">
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin">
            <i class="text-4xl uil uil-spinner"></i>
          </div>
        </div>
        <div v-else class="w-full grid grid-cols-2 gap-x-[18px] gap-y-6">
          <div class="flex flex-col col-span-2">
            <Textinput
              placeholder="Referral Code"
              type="text"
              name="referralCode"
              label="  Referral Code"
              iconType="code"
              disabled
              v-bind="referralCodeAtt"
              v-model="referralCode"
              :error="errors.referralCode"
            />
          </div>
          <div class="col-span-2" v-if="referralData.referalType == 2">
            <label class="text-[14px] font-medium text-[#344054] block mb-1.5">
              Campaign Name
            </label>
            <Textinput
              placeholder="Campaign name "
              type="text"
              name="assignedUser"
              iconType="code"
              v-model="assignedUser"
              :error="errors.assignedUser"
            />
          </div>

          <div
            class="flex flex-col"
            v-if="!referralData.referalType || referralData.referalType == 0"
          >
            <label class="text-[14px] font-medium text-[#344054] mb-0.5 block">
              Assigned User
            </label>
            <CustomSearchSelect
              :modelValue="selectedUserData"
              @update:modelValue="
                (value) => {
                  selectedUserData = value;
                  assignedUser = value?.value;
                }
              "
              :min-search-length="1"
              placeholder="Search users..."
              apiEndpoint="admin/v1/user/get-users"
              @option-selected="handleUserSelected"
            />
            <span v-if="errors.assignedUser" class="text-sm text-red-500">
              {{ errors.assignedUser }}
            </span>
          </div>
          <div
            class=""
            v-if="
              referralData.referalType == 1 || referralData.referalType == 0
            "
          >
            <label class="text-[14px] font-medium text-[#344054] block mb-1.5">
              Department
            </label>

            <FormsDepartmentDropdown
              label=""
              name="assignedDepartment"
              v-bind="assignedDepartmentAtt"
              v-model="assignedDepartment"
              :error="errors.assignedDepartment"
            />
          </div>
          <div class="flex flex-col col-span-2">
            <label class="text-[14px] font-medium text-[#344054] mb-1.5 block">
              Apps
            </label>

            <div class="relative">
              <Combobox v-model="assignedApps" multiple>
                <div
                  class="relative w-full px-3 py-2 overflow-hidden text-left bg-white rounded-lg cursor-default input-control sm:text-sm"
                >
                  <div
                    v-if="assignedApps.length > 0"
                    class="flex flex-wrap gap-2 mb-1"
                  >
                    <span
                      v-for="app in assignedApps"
                      :key="app"
                      class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-primary-100 text-primary-600"
                    >
                      {{ getAppName(app) }}
                      <button
                        @click.stop="removeApp(app)"
                        class="ml-1 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <ComboboxInput
                    :displayValue="() => ''"
                    placeholder="Search and select apps..."
                    @change="handleAppSearch"
                    class="!bg-transparent !border-none !px-0 !py-0 !h-auto !rounded-none !text-[#475467] !outline-none focus:!outline-none w-full"
                  />
                  <ComboboxButton
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5 text-gray-400"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      />
                    </svg>
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <ComboboxOptions
                    class="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-gray-100 ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <div
                      v-if="appOptions.length === 0"
                      class="relative px-4 py-2 text-gray-600 cursor-default select-none"
                    >
                      No apps available
                    </div>
                    <ComboboxOption
                      v-for="app in appOptions"
                      :key="app.id"
                      v-slot="{ selected, active }"
                      :value="app.id"
                    >
                      <li
                        :class="[
                          'relative cursor-default select-none py-2 pl-10 pr-4',
                          active
                            ? 'bg-primary-300 text-white'
                            : 'text-secondary-500',
                        ]"
                      >
                        <span
                          :class="[
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal',
                          ]"
                        >
                          {{ app.name }}
                        </span>
                        <span
                          v-if="selected"
                          :class="[
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                            active ? 'text-white' : 'text-primary-600',
                          ]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </Combobox>
            </div>
            <span v-if="errors.assignedApps" class="text-sm text-red-500">
              {{ errors.assignedApps }}
            </span>
          </div>
        </div>
        <div class="flex justify-end mt-10 gap-x-4">
          <AppButton
            btnClass="!px-9 !border-[#D0D5DD] border text-sm text-[#344054] !py-[9px] !leading-none !text-sm "
            @click="navigateTo('/referral-management')"
            type="button"
            text="Cancel"
          />
          <AppButton
            btnClass="!px-[15px] btn-primary !py-[9px] !text-sm !leading-none"
            @click="onSubmit"
            type="submit"
            :is-disabled="!meta.valid || isSubmitting"
            :isLoading="isSubmitting"
            text="Update Referral"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { toast } from "vue3-toastify";
import * as yup from "yup";
import ArrowLeft from "~/components/Svgs/ArrowLeft.vue";
import CustomSearchSelect from "~/components/CustomSearchSelect.vue";
import {
  getSubApps,
  getReferrals,
  checkReferralCodeUniqueness,
} from "~/services/userservices";
import { ssoPost } from "~/helpers/api_helpers";
import debounce from "lodash/debounce";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { errorResponse } from "~/utils/errorResponse";

const route = useRoute();

const formValues = {
  referralCode: "",
  assignedUser: "",
  assignedDepartment: "",
  assignedApps: [],
};

const schema = yup.object({
  referralCode: yup
    .string()
    .required("Referral code is required")
    .min(3, "Referral code must be at least 3 characters")
    .max(12, "Referral code must not exceed 12 characters")
    .matches(
      /^[a-zA-Z0-9]*$/,
      "Referral code must contain only alphanumeric characters (no special characters or spaces)"
    ),
  assignedUser: yup.string().required("Assigned user is required"),
  assignedDepartment: yup.string(),
  assignedApps: yup.array(),
});

const appOptions = ref([]);
const appSearchQuery = ref("");
const isLoading = ref(true);
const isSubmitting = ref(false);
const selectedUserData = ref(null);
const referralData = ref(null);
const isCheckingUniqueness = ref(false);
const codeUniquenessError = ref("");
const codeIsUnique = ref(false);

// Debounced uniqueness check
const validateCodeUniqueness = debounce(async (code, excludeId = null) => {
  if (!code || code.length < 3) {
    codeUniquenessError.value = "";
    codeIsUnique.value = false;
    return;
  }

  isCheckingUniqueness.value = true;
  try {
    const isUnique = await checkReferralCodeUniqueness(code, excludeId);
    if (isUnique) {
      codeUniquenessError.value = "";
      codeIsUnique.value = true;
    } else {
      codeUniquenessError.value =
        "This referral code already exists. Please use a different code.";
      codeIsUnique.value = false;
    }
  } catch (error) {
    console.error("Error validating code uniqueness:", error);
    codeUniquenessError.value = "Error validating code. Please try again.";
    codeIsUnique.value = false;
  } finally {
    isCheckingUniqueness.value = false;
  }
}, 800);

const { handleSubmit, defineField, errors, meta, setValues, setFieldValue } =
  useForm({
    validationSchema: schema,
    initialValues: formValues,
  });

const [referralCode, referralCodeAtt] = defineField("referralCode");
const [assignedUser, assignedUserAtt] = defineField("assignedUser");
const [assignedDepartment, assignedDepartmentAtt] =
  defineField("assignedDepartment");
const [assignedApps, assignedAppsAtt] = defineField("assignedApps");

// Load available apps
const loadApps = async () => {
  try {
    const response = await getSubApps({});
    if (response.status === 200) {
      appOptions.value = response.data.data.map((app) => ({
        id: app.name,
        name: app.name,
      }));
    }
  } catch (error) {
    console.error("Error loading apps:", error);
    toast.error(error.response?.data?.message || "Failed to load apps");
  }
};

// Load referral data
const loadReferralData = async () => {
  try {
    isLoading.value = true;
    const referralCode = route.params.id;
    const response = await getReferrals({ referralCode });

    if (response.status === 200 && response.data.data.length > 0) {
      const data = response.data.data[0];
      referralData.value = data;

      // Set selected user data for display first
      selectedUserData.value = {
        value: data.assignedUserId,
        label: data.assignedUser,
        email: data.assignedUserEmail,
      };
      console.log({ data });

      // Set form values
      await nextTick();
      setValues({
        referralCode: data.referralCode,
        assignedUser: data.assignedUserId,
        assignedDepartment: data.assignedDepartment,
        assignedApps: data.assignedApps ? data.assignedApps.split(",") : [],
      });

      // Validate the loaded code
      validateCodeUniqueness(data.referralCode, data.id);
    }
  } catch (error) {
    console.error("Error loading referral:", error);
    toast.error(error.response?.data?.message || "Failed to load referral");
    setTimeout(() => navigateTo("/referral-management"), 1500);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadApps(), loadReferralData()]);
});

// Get app name by id
const getAppName = (appId) => {
  const app = appOptions.value.find((a) => a.id === appId);
  return app ? app.name : appId;
};

// Remove app from selected list
const removeApp = (appId) => {
  const index = assignedApps.value.indexOf(appId);
  if (index > -1) {
    assignedApps.value.splice(index, 1);
  }
};

// Handle user selection
const handleUserSelected = (selectedOption) => {
  selectedUserData.value = selectedOption;
  assignedUser.value = selectedOption.value;
  // Update the form field
  setFieldValue("assignedUser", selectedOption.value);
};

// Handle app search
const handleAppSearch = (event) => {
  appSearchQuery.value = event.target.value;
};

// Submit form
const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    // Check if code is unique before submitting
    if (!codeIsUnique.value && !codeUniquenessError.value) {
      // If we haven't validated yet, do a quick check
      const isUnique = await checkReferralCodeUniqueness(
        values.referralCode,
        referralData.value?.id
      );
      if (!isUnique) {
        toast.error(
          "Referral code already exists. Please use a different code."
        );
        isSubmitting.value = false;
        return;
      }
    } else if (codeUniquenessError.value) {
      toast.error(codeUniquenessError.value);
      isSubmitting.value = false;
      return;
    }

    const payload = {
      id: referralData.value?.id,
      referralCode: values.referralCode,
      assignedUser:
        referralData.value.referalType == 2
          ? values.assignedUser
          : selectedUserData.value?.label || values.assignedUser,
      assignedUserId: values.assignedUser,
      assignedUserEmail: selectedUserData.value?.email || "",
      assignedDepartment: values.assignedDepartment,
      assignedApps: values.assignedApps.join(","),
      referalType: referralData.value.referalType,
    };

    const response = await ssoPost(`admin/v1/referalls/edit`, payload);

    if (response.status === 200) {
      toast.success("Referral updated successfully");
      setTimeout(() => {
        navigateTo("/referral-management");
      }, 800);
    }
  } catch (error) {
    console.error("Error updating referral:", error);
    errorResponse(error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>
