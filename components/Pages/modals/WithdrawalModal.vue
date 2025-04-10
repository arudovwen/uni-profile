<template>
  <div class="max-w-[400px] w-full min-w-[350px] py-10 px-6">
    <form @submit.prevent="onSubmit" v-if="stage === 1">
      <h1 class="text-lg font-semibold text-[#101828] mb-4">Withdrawal</h1>

      <div class="grid gap-x-[25px] gap-y-4 mb-5">
        <FormGroup
          label="How much do you require?"
          :error="errors.withdrawalAmount"
          name="withdrawalAmount"
          classLabel="!normal-case"
          isRequired
        >
          <div class="flex items-center">
            <CurrencyInput
              min="1"
              :class="`outline-none px-[14px] py-[10px] min-w-[180px] w-full !bg-white border !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
                errors.withdrawalAmount ? 'border-red-500' : 'border-[#D0D5DD]'
              }`"
              placeholder="Amount"
              v-model="withdrawalAmount"
              :options="{
                currency: 'ngn',
                currencyDisplay: 'hidden',
              }"
            />
            <span class="absolute right-4">NGN</span>
          </div>
        </FormGroup>
        <FormGroup
          isRequired
          label="Bank"
          :error="errors.bankCode"
          name="bankCode"
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
        <div class="">
          <Textinput
            isRequired
            placeholder="Account number"
            label="Account number"
            name="accountNumber"
            v-bind="accountNumberAtt"
            v-model="accountNumber"
            :error="isValidating ? '' : errors.accountNumber"
          />
        </div>
        <div class="" v-if="form.accountName">
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
      <div class="mb-[30px]" v-if="withdrawalAmount">
        <p class="flex gap-x-2 text-sm text-right justify-between mb-1">
          <span>You will be charged:</span>
          <span>{{ currencyFormat(charge) }}</span>
        </p>
        <p class="flex gap-x-2 font-semibold text-right justify-between">
          <span>Total:</span>
          <span>{{ currencyFormat(withdrawalAmount + charge) }}</span>
        </p>
        <!-- <p class="flex gap-x-2 text-sm text-right justify-end">
          <span>Fee:</span> <span>{{ currencyFormat(charge) }}</span>
        </p> -->
      </div>
      <div class="flex gap-x-4 items-center justify-end">
        <AppButton
          @click="handleClose"
          btnClass="bg-transparent text-white !px-[14px]  !text-sm !py-[10px] border !text-matta-black w-full"
          type="button"
          text="Cancel"
        />
        <AppButton
          :disabled="
            isLoading ||
            loading ||
            withdrawalAmount + charge > balance ||
            isValidating
          "
          :isLoading="isLoading"
          btnClass="bg-primary-500 text-white !px-[14px]  !text-sm !py-[10px] disabled:cursor-not-allowed w-full disabled:opacity-60"
          type="submit"
          text="Submit"
        />
      </div>
    </form>
    <div v-if="stage === 2">
      <OTP />
    </div>
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
  <OTP
    v-if="isVerifyPin"
    :isVerifyPin="isVerifyPin"
    @close="isVerifyPin = false"
    @handleSubmit="handleFinalSubmit"
    :isLoading="isLoading"
  />
  <CreatePin
    v-if="isCreatePin"
    :isCreatePin="isCreatePin"
    @close="
      () => {
        if (authStore.hasPin) {
          isVerifyPin = true;
        }

        isCreatePin = false;
      }
    "
  />
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import CurrencyInput from "~/components/CurrencyInput";
import { ref, reactive, inject } from "vue";
import {
  withdrawFunds,
  validateAccount,
  walletGetWithdrawalCharge,
} from "~/services/walletservice";
import OTP from "./OTP.vue";
import CreatePin from "./CreatePin.vue";

const isCreatePin = ref(false);
const isVerifyPin = ref(false);
const isErrorOpen = ref(false);
const errorText = ref("Wallet creation request failed");
const props = defineProps({
  balance: {
    default: 0,
  },
  hasSettlement: {
    default: true,
  },
  banks: {
    default: () => [],
  },
});
const authStore = useAuthStore();
const loading = ref(false);
const stage = ref(1);
const handleClose = inject("handleClose");
const form = reactive({
  withdrawalAmount: null,
  narration: "withdraw",
  balance: props.balance.availableBalance,
  accountNumber: "",
  currency: "NGN",
  bankCode: "",
  amount: null,
});
const isValidating = ref(false);
const formData = ref(null);
const formSchema = yup.object().shape({
  balance: yup.number(),
  bankCode: yup.string().required("Bank name is required"),
  accountNumber: yup
    .string()
    .matches(/^\d{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
  withdrawalAmount: yup
    .number()
    .required("Amount is required")
    .max(yup.ref("balance", "Exceeded available balance"))
    .positive("Amount must be a positive number"),
  amount: yup
    .number()
    .test("balance-validation", "Exceeded available balance", function (value) {
      const balance = this.parent.balance;

      if (value && balance) {
        return value <= balance;
      }
      return true; // Return true if no validation needed
    })
    .nullable(),
});

const isLoading = ref(false);
const { handleSubmit, defineField, errors, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: form,
});

const [bankCode] = defineField("bankCode");
const [accountNumber, accountNumberAtt] = defineField("accountNumber");
const [withdrawalAmount] = defineField("withdrawalAmount");
const handleComplete = inject("handleComplete");

const handleFinalSubmit = (pin) => {
  isLoading.value = true;
  withdrawFunds({ ...formData.value, transactionPIN: pin })
    .then((res) => {
      if (res.status === 200) {
        handleComplete("Your withdraw request is being processed");
      }
    })
    .catch((err) => {
      errorText.value =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Withdrawal request failed";
      isErrorOpen.value = true;
      isLoading.value = false;
    });
};
const onSubmit = handleSubmit((values) => {

  formData.value = values;
  if (authStore.hasPin) {
    isVerifyPin.value = true;
  } else {
    isCreatePin.value = true;
  }
});
watch(props.banks, () => {
  if (props.banks.length) {
    const bankCode = props.banks.find(
      (i) =>
        i.label.toLowerCase() ===
        defaultsettlement.value?.bankName.toLowerCase()
    );
    setFieldValue("bankCode", bankCode?.value);
  }
});
const charge = ref(0);

watch(
  () => [values.accountNumber, values.bankCode],
  () => {
    const { bankCode, accountNumber } = values;
    if (bankCode && accountNumber) {
      isValidating.value = true;
      validateAccount({
        bankCode,
        accountNumber,
      })
        .then((res) => {
          isValidating.value = false;
          form.accountName = res.data.data.responseBody.accountName;
          return true; // Resolve the promise if validation is successful
        })
        .catch((err) => {
          isValidating.value = false;
          toast.error("Invalid account number");
        });
    }
  }
);
watch(
  () => [withdrawalAmount.value],
  () => {
    if (withdrawalAmount.value) {
      loading.value = true;
      setTimeout(() => {
        walletGetWithdrawalCharge(withdrawalAmount.value).then((res) => {
          if (res.status === 200 && res.data.data) {
            charge.value = res.data.data;
            setFieldValue(
              "amount",
              res.data.data + withdrawalAmount.value || 0
            );
            loading.value = false;
          }
        });
      }, [1200]);
    }
  }
);
</script>
