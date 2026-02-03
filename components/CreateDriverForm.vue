<template>
  <div>
    <div
      v-if="isSuccess"
      class="flex flex-col items-center p-0 isolation isolate lg:w-[400px] max-w-[400px] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)] rounded-[12px] flex-none order-1 self-stretch flex-grow-0 z-10"
    >
      <div
        class="deco3 flex flex-col items-center p-0 isolation isolate w-full h-[160px] flex-none order-1 self-stretch flex-grow-0 z-10"
      >
        <div
          class="flex flex-col items-start pt-[24px] px-[24px] gap-[16px] lg:w-[400px] h-[160px] flex-none order-0 self-stretch flex-grow-0 z-0"
        >
          <div
            class="w-[48px] h-[48px] flex justify-center items-center bg-[#DCFAE6] border-[8px] border-[#ECFDF3] rounded-[28px] flex-none order-0 flex-grow-0"
          >
            <SMSTracking class="!h-[24px] !w-[24px] text-[#085D3A]" />
          </div>
          <div
            class="flex flex-col items-start p-0 gap-[4px] w-[352px] h-[72px] flex-none order-1 self-stretch flex-grow-0"
          >
            <!-- Text -->
            <div
              class="w-full h-[28px] flex-none order-0 self-stretch flex-grow-0"
            >
              <span
                class="font-semibold text-[18px] leading-[28px] text-[#101828]"
              >
                {{ driverData?.id ? "Account Updated" : "Account Created" }}
              </span>
            </div>

            <!-- Supporting Text -->
            <div
              class="w-[342px] h-[40px] flex-none order-1 self-stretch flex-grow-0"
            >
              <span
                class="font-Onest w-full font-normal mb-2 text-[14px] leading-[20px] text-[#475467]"
              >
                Your new driver account has been created.<br> An email has also been
                sent to <br>the registered email.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-row justify-between px-[24px] items-start pt-[32px] pb-0 gap-0 lg:w-[400px] h-[100px] flex-none order-2 self-stretch flex-grow-0 z-20"
      >
        <AppButton
          btnClass="h-[44px] lg:w-[170px] text-[#344054] bg-white border-[#D0D5DD] border-[1px]"
          type="button"
          @click="
            () => {
              resetForm();
              step = 2;
              isSuccess = false;
            }
          "
          :isLoading="isLoading"
          text="Add New Driver"
        />
        <AppButton
          class="h-[44px] w-[150px] lg:w-[170px]"
          type="button"
          @click="
            () => {
              isOpen = false;
              driverData = null;
              emit('refresh');
            }
          "
          :isLoading="isLoading"
          text="Done"
        />
      </div>
    </div>
    <template v-else>
      <div
        v-if="step === 2"
        class="flex flex-col items-center p-0 w-full lg:w-[640px] bg-white shadow-xl rounded-[12px] isolate z-10"
      >
        <div
          class="deco2 flex flex-col items-start p-[24px] gap-[16px] w-[400px] h-[140px] flex-none order-0 self-stretch flex-grow-0 z-0 !rounded-[12px] mb-4"
        >
          <div
            class="flex flex-col items-start p-0 gap-[4px] w-[342px] h-[52px] flex-none order-1 self-stretch flex-grow-0"
          >
            <div
              class="flex-none flex justify-center items-center order-0 flex-grow-0 w-[48px] h-[48px] bg-[#D1E9FF] border-[8px] border-[#EFF8FF] rounded-[28px]"
            >
              <ProfileAddIcon class="text-[#1570EF] !h-[24px] !w-[24px]" />
            </div>

            <div class="text-left flex-none order-0 self-stretch flex-grow-0">
              <span
                class="font-Onest font-semibold text-[18px] leading-[28px] text-[#101828]"
              >
                {{ driverData?.id ? "Update Driver" : "Add New Driver" }}
              </span>
            </div>
            <div class="flex-none order-1 self-stretch flex-grow-0 w-[352px]">
              <span
                class="font-Onest font-normal text-[14px] leading-[20px] text-[#475467]"
              >
                Create an account
              </span>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col items-start p-0 gap-[16px] w-full flex-none order-0 self-stretch flex-grow-0"
        >
          <form
            @submit.prevent=""
            class="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-[18px] gap-y-4 rounded-[12px] bg-white px-[24px] pb-3"
          >
            <div class="">
              <Textinput
                placeholder="First Name"
                label="First name"
                type="text"
                name="firstName"
                v-bind="firstNameAtt"
                v-model="firstName"
                :error="errors.firstName"
              />
            </div>
            <div class="">
              <Textinput
                placeholder="Last Name"
                label="Last name"
                type="text"
                name="lastName"
                v-bind="lastNameAtt"
                v-model="lastName"
                :error="errors.lastName"
              />
            </div>
            <div class="">
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
            <div class="">
              <LazyPhoneNumber
                placeholder="080XXXXXXXXXXX"
                label="phoneNumber "
                type="tel"
                name="phoneNumber"
                iconType="phone"
                v-bind="phoneNumberAtt"
                v-model="phoneNumber"
                :error="errors.phoneNumber"
                icon-position="left"
              />
            </div>
            <div class="">
              <Textinput
                isRequired
                placeholder="NIN"
                label="NIN"
                type="text"
                name="nin"
                v-bind="ninAtt"
                v-model="nin"
                :error="errors.nin"
              />
            </div>
            <div class="">
              <Textinput
                isRequired
                placeholder="drivers License Number"
                label="drivers License Number"
                type="text"
                name="driversLicenseNumber"
                v-bind="driversLicenseNumberAtt"
                v-model="driversLicenseNumber"
                :error="errors.driversLicenseNumber"
              />
            </div>
            <div
              class="flex lg:col-span-2 flex-col justify-between items-start p-0 w-full flex-none order-3 self-stretch flex-grow-0 z-30"
            >
              <DropFile
                label="Upload Driver's License"
                :id="0"
                @file-selected="handleFileSelection"
                @file-removed="handleFileRemoval"
                :value="values.driverDocuments[0].url"
              />
            </div>
            <div
              class="flex lg:col-span-2 flex-col justify-between items-start p-0 w-full h-[100px] flex-none order-3 self-stretch flex-grow-0 z-30"
            >
              <DropFile
                label="Upload LASDRI"
                :id="1"
                @file-selected="handleFileSelection"
                @file-removed="handleFileRemoval"
                :value="values.driverDocuments[1].url"
              />
            </div>
            <div
              class="flex lg:col-span-2 flex-row justify-between items-center pt-[32px] p-0 w-full h-[100px] flex-none order-3 self-stretch flex-grow-0 z-30"
            >
              <!-- Modal actions go here -->
              <AppButton
                @click="
                  () => {
                    isOpen = false;
                  }
                "
                btnClass="h-[44px] w-[150px] lg:w-[290px] text-[#344054] bg-white border-[#D0D5DD] border-[1px]"
                type="button"
                text="Cancel"
              />
              <AppButton
                btnClass="h-[44px] lg:w-[290px] btn-primary"
                @click="onSubmit"
                type="submit"
                :is-disabled="
                  !meta.valid || !checkDocumentsUrls(values.driverDocuments)
                "
                :isLoading="isLoading"
                :text="driverData?.id ? 'Update Driver' : 'Add New Driver'"
              />
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import ProfileAddIcon from "@/assets/images/svgs/profile-add.svg";
import SMSTracking from "@/assets/images/svgs/sms-tracking.svg";
import * as yup from "yup";
import { addDriver, updateDriver } from "~/services/driverservices";
import { toast } from "vue3-toastify";

const emit = defineEmits(["refresh"]);
const props = defineProps(["dataLoading"]);

const step = ref(2);

const formValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  nin: "",
  driversLicenseNumber: "",
  driverDocuments: [
    {
      url: null,
      urls: [],
      documentType: 0,
    },
    {
      url: null,
      urls: [],
      documentType: 1,
    },
  ],
};

function checkDocumentsUrls(documents) {
  if (!documents || !Array.isArray(documents)) {
    return false;
  }

  return documents.every((doc) => {
    return (
      doc && doc.url && typeof doc.url === "string" && doc.url.trim() !== ""
    );
  });
}

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  nin: yup.string().required("NIN is required"),
  driversLicenseNumber: yup.string().required("License No is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});

// const schema = yup.object({});
const driverData = inject("driverData");

const {
  handleSubmit,
  defineField,
  errors,
  values,
  meta,
  resetForm,
  setFieldValue,
} = useForm({
  validationSchema: schema,
  initialValues: driverData?.value?.id ? driverData.value : formValues,
});

const [email, emailAtt] = defineField("email");
const [driversLicenseNumber, driversLicenseNumberAtt] = defineField(
  "driversLicenseNumber"
);
const [firstName, firstNameAtt] = defineField("firstName");
const [lastName, lastNameAtt] = defineField("lastName");
const [phoneNumber, phoneNumberAtt] = defineField("phoneNumber");
const [nin, ninAtt] = defineField("nin");
const router = useRouter();

const isSuccess = ref(false);
const isOpen = inject("isOpen");
const isLoading = ref(false);
const image = ref();

const onSubmit = handleSubmit((values) => {
  if (!checkDocumentsUrls(values.driverDocuments)) {
    toast.error("Upload required files");
    return;
  }
  isLoading.value = true;
  if (!driverData?.value?.id) {
    addDriver(values)
      .then(() => {
        isLoading.value = false;
        isSuccess.value = true;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        isLoading.value = false;
      });
  } else {
    updateDriver(values, driverData?.value?.id)
      .then(() => {
        isLoading.value = false;
        isSuccess.value = true;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        isLoading.value = false;
      });
  }
});

function handleFileSelection(file, id) {
  let formDocs = [...values.driverDocuments];
  formDocs[id].url = file;
  formDocs[id].urls[0] = file;

  setFieldValue("driverDocuments", formDocs);
}
function handleFileRemoval() {
  // console.log("File removed");
}
</script>