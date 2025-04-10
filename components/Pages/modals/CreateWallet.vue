<template>
  <div class="max-w-[400px] py-8 px-6">
    <form @submit.prevent="onSubmit">
      <h1 class="text-lg font-semibold text-[#101828] mb-4">Activate Wallet</h1>

      <div
        class="px-5 py-[14px] bg-[#182230] rounded-[5px] flex justify-between gap-x-40 relative mb-3"
      >
        <div class="flex gap-x-2 items-start">
          <AppIcon icon="quill:info" iconClass="text-white text-lg" />
          <p class="text-white text-xs max-w-[660px]">
            We need your BVN and date of birth to verify your account details.
          </p>
        </div>
      </div>

      <div class="grid gap-x-[25px] gap-y-4 mb-[30px]">
        <div class="">
          <Textinput
            placeholder="Enter your BVN"
            label="BVN"
            name="bvn"
            v-bind="bvnAtt"
            v-model="bvn"
            :error="errors?.['bvn']" isRequired
          />
        </div>

        <div class="">
          <Textinput
            placeholder=""
            label="Date of Birth"
            name="bvnDateOfBirth"
            v-bind="bvnDateOfBirthAtt"
            v-model="bvnDateOfBirth"
            :error="errors?.['bvnDateOfBirth']"
            type="date"
          />
        </div>

        <FormGroup
          v-if="!hasSettlement"
          label="Bank"
          :error="errors.bankCode"
          name="bankCode" isRequired
        >
          <SelectVueSelect
            v-model="bankCode"
            :disabled="!banks.length"
            :options="banks"
            :reduce="(bank) => bank.value"
            :placeholder="!banks.length ? 'Fetching list' : 'Select bank'"
            :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
              errors.bankCode ? 'border-red-500' : 'border-[#D0D5DD]'
            }`"
          />
        </FormGroup>
        <div class="" v-if="!hasSettlement">
          <Textinput isRequired
            placeholder="Account number"
            label="Account number"
            name="accountNumber"
            v-bind="accountNumberAtt"
            v-model="accountNumber"
            :error="errors.accountNumber"
          />
        </div>
        <div class="" v-if="form.accountName && !hasSettlement">
          <Textinput
            placeholder="Account name"
            label="Account name"
            name="accountName"
            v-model="form.accountName"
            disabled
          />
        </div>
        <div v-if="isValidating" class="text-center p-1">
          <div
            class="loader border-t-4 border-gray-500 border-solid rounded-full h-4 w-4 animate-spin mx-auto"
          ></div>
        </div>
      </div>
      <div class="flex gap-x-4 items-center justify-end">
        <AppButton
          @click="handleClose"
          btnClass="bg-transparent text-white !px-[14px]  !text-sm !py-[10px] border !text-matta-black w-full"
          type="button"
          text="Cancel"
        />
        <AppButton
          :disabled="isLoading"
          :isLoading="isLoading"
          btnClass="bg-primary-500 text-white !px-[14px]  !text-sm !py-[10px] disabled:cursor-not-allowed w-full"
          type="submit"
          text="Confirm"
        />
      </div>
    </form>
  </div>

  <ActionModal
    :open="isErrorOpen"
    type="reject"
    title="Request Failed"
    :text="errorText"
    btnText="Retry"
    :isCancel="false"
    @actionItem="() => (isErrorOpen = false)"
    @close="() => (isErrorOpen = false)"
  />
  <RequestLoader :open="isLoading" />
</template>
<script setup>
import { validateAccount, createWallet } from "~/services/walletservice";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ref, reactive, inject } from "vue";

const isValidating = ref(false);
const props = defineProps({
  hasSettlement: {
    default: true,
  },
  type: {
    default: "",
  },
  banks: {
    default: () => [],
  },
});
const handleComplete = inject("handleComplete");
const handleClose = inject("handleClose");
const authStore = useAuthStore();
const isErrorOpen = ref(false);
const errorText = ref("Wallet creation request failed");
const defaultCustomerName = `${authStore.userInfo?.firstName} ${authStore.userInfo?.lastName}`;
const defaultCustomerEmail = authStore.userInfo?.email;
// Define form structure
const form = reactive({
  accountName: "",
  accountNumber: "",
  bankCode: "", // Assuming you'll populate this somewhere
  customerName: defaultCustomerName,

  bvn: "",
  bvnDateOfBirth: "",

  customerEmail: defaultCustomerEmail,
  hasSettlement: null,
});
const formSchema = yup.object().shape({
  bankCode: yup.string().when("hasSettlement", {
    is: false,
    then: (schema) => schema.required("Bank name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  accountNumber: yup.string().when("hasSettlement", {
    is: false,
    then: (schema) =>
      schema
        .matches(/^\d{10}$/, "Account number must be 10 digits")
        .test("test-account", "Invalid account number", function (value) {
          const { bankCode } = this.parent || {}; // Destructure bankCode safely
          if (value && value.length === 10 && bankCode) {
            isValidating.value = true;
            return validateAccount({
              bankCode: bankCode,
              accountNumber: value,
            })
              .then((res) => {
                isValidating.value = false;
                form.accountName = res.data.data.responseBody.accountName;
                return true; // Resolve the promise if validation is successful
              })
              .catch((err) => {
                isValidating.value = false;
                throw new yup.ValidationError(
                  "Invalid account number",
                  null,
                  "accountNumber"
                );
              });
          } else {
            return true; // Return true if the length is not 10 or bankCode is missing
          }
        })
        .required("Account number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  customerName: yup.string().required("Customer name is required"),
  bvn: yup
    .string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be 11 digits"),
  // bvnDateOfBirth: yup
  //   .date()
  //   .typeError("Invalid date")
  //   .required("Date of birth is required")
    // .max(new Date(), "Date of birth must be in the past"),
  customerEmail: yup.string().email("Invalid email address"),
});

const isLoading = ref(false);
const { handleSubmit, defineField, errors, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: { ...form, hasSettlement: props.hasSettlement },
});

const [bankCode] = defineField("bankCode");
const [accountNumber, accountNumberAtt] = defineField("accountNumber");
const [bvn, bvnAtt] = defineField("bvn");
// const [bvnDateOfBirth, bvnDateOfBirthAtt] = defineField("bvnDateOfBirth");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;

  const data = {
    accountNumber: values.accountNumber,
    bankCode: values.bankCode,
    customerName: defaultCustomerName,
    bvn: values.bvn,
    customerEmail: defaultCustomerEmail,
  };
  createWallet(data)
    .then((res) => {
      if (res.status === 200) {
        handleComplete(
          "Your wallet has been activated",
          props.type
        );
        isLoading.value = false;
      }
    })
    .catch((err) => {
      errorText.value =
        err?.response?.data?.message || "Wallet creation request failed";
      isErrorOpen.value = true;
      isLoading.value = false;
    });
});
</script>

