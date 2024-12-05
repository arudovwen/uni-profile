<template>
  <div class="max-w-[450px] w-full min-w-[350px] py-6 px-6">
    <form @submit.prevent="onSubmit" v-if="stage === 1">
      <h1 class="text-lg font-semibold text-[#101828] mb-4">
        Fund via monnify
      </h1>

      <div class="grid gap-x-[25px] gap-y-4 mb-5">
        <FormGroup
          label="How much do you wish to fund?"
          :error="errors.amount"
          name="amount"
          classLabel="!normal-case"
          isCumpulsory
        >
          <div class="flex items-center">
            <CurrencyInput
              min="1"
              :class="`outline-none px-[14px] py-[10px] min-w-[180px] w-full !bg-white border !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
                errors.amount ? 'border-red-500' : 'border-[#D0D5DD]'
              }`"
              placeholder="Amount"
              v-model="amount"
              :options="{
                currency: 'ngn',
                currencyDisplay: 'hidden',
              }"
            />
            <span class="absolute right-4">NGN</span>
          </div>
        </FormGroup>
      </div>

      <div class="mb-6" v-if="amount">
        <p class="flex gap-x-2 text-sm text-right justify-start">
          <span>You will receive:</span>
          <span>{{ currencyFormat(amount - charge) }}</span>
        </p>
        <p class="flex gap-x-2 text-sm text-right justify-start">
          <span>Fee:</span> <span>{{ currencyFormat(charge) }}</span>
        </p>
      </div>
      <div class="flex gap-x-4 items-center justify-end">
        <AppButton
          :disabled="isLoading || loading"
          :isLoading="isLoading"
          btnClass="bg-primary-500 text-white !px-[14px]  !text-sm !py-[10px] disabled:cursor-not-allowed w-full"
          type="submit"
          text="Submit"
        />
      </div>
    </form>

    <div  class="my-6 flex gap-x-4 items-center">
      <span class="border-b flex-1"></span>
      <span>or</span>
      <span class="border-b flex-1"></span>
    </div>
    <div
      v-if="hasWallet"
      class="border border-[#EAECF0] bg-[#F2F4F7] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] pt-5 pb-4 px-4"
    >
      <p class="text-[13px] text-[#344054] font-medium mb-3">
        You can transfer from your bank's mobile app using the account details
        here
      </p>

      <div class="grid gap-y-1">
        <div
          class="flex gap-x-2 items-center text-xs"
          v-for="item in bankData"
          :key="item.title"
        >
          <span class="font-normal text-[#667085]">{{ item.title }}: </span>
          <span class="flex gap-x-4 items-center">
            <span class="font-medium text-[#101828]">{{
              details[item.key]
            }}</span>
            <button
              v-if="item.key === 'accountNumber'"
             
              @click="copyItem(details?.accountNumber)"
              class="cursor-pointer"
            >
              <i class="uil uil-copy text-[#101828]"></i></button
          ></span>
        </div>
      </div>
    </div>
    <div v-else>
      <button
        @click="emits('activate')"
        class="text-primary-500 font-medium flex items-center gap-x-2"
      >
        <span>Activate wallet</span>
        <AppIcon icon="flowbite:angle-right-outline" iconClass="text-lg" />
      </button>
    </div>
  </div>
  <ActionModal
    :open="isErrorOpen"
    type="reject"
    title="Request Failed"
    text="Funding request failed, Try again!"
    btnText="Retry"
    :isCancel="false"
    @actionItem="() => (isErrorOpen = false)"
    @close="() => (isErrorOpen = false)"
  />
  <RequestLoader :open="loader" />

</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";

import CurrencyInput from "~/components/CurrencyInput";
import { ref, reactive, inject } from "vue";
import { confirmFunding, walletGetDepositCharge } from "~/services/walletservice";
import { nanoid } from "nanoid";

const isErrorOpen = ref(false);
const authstore = useAuthStore();
const getLedgersTrans = inject("getLedgersTrans");
defineProps(["details", "hasWallet"]);
const emits = defineEmits(["activate"]);
const loader = ref(false);
const loading = ref(false);
const stage = ref(1);
const handleComplete = inject("handleComplete");
const bankData = [
  {
    title: "Bank name",
    key: "bankName",
  },
  {
    title: "Account name",
    key: "accountName",
  },
  {
    title: "Account number",
    key: "accountNumber",
  },
];
const form = reactive({
  amount: null,
});
const formSchema = yup.object().shape({
  amount: yup
    .number()
    .required("Amount is required")

    .positive("Amount must be a positive number"),
});

const isLoading = ref(false);
const { handleSubmit, defineField, errors } = useForm({
  validationSchema: formSchema,
  initialValues: form,
});

const [amount] = defineField("amount");
function onModalClose() {
  isErrorOpen.value = true;
}
function onSuccess(response) {
  if (
    response.status.toLowerCase() === "success" &&
    response.transactionReference
  ) {
    loader.value = true;
    const data = {
      amount: amount.value,
      transactionReference: response.transactionReference,
      paymentDescription: "Wallet Funding",
    };

    confirmFunding(data)
      .then((res) => {
        if (res.status === 200) {
          getLedgersTrans();
          handleComplete("Your funding request is being proceesed");
          loader.value = false;
        }
      })
      .catch((err) => {
        isErrorOpen.value = true;
        loader.value = false;
      });
  }
}
const onSubmit = handleSubmit((values) => {
  const data = {
    email: authstore.userInfo?.email,
    name: `${authstore.userInfo?.firstName} ${authstore.userInfo?.lastName}`,
    amount: values.amount,
    phoneNumber: authstore.userInfo?.phoneNumber,
    type: "Wallet Funding",
    reference: `WAL-${Math.floor(Math.random() * 1000000000 + 1)}-${nanoid(6)}`,
  };

  payWithMonnify(data, onModalClose, onSuccess);
});
const charge = ref(5);
watch(
  () => [amount.value],
  () => {
    if (amount.value) {
      loading.value = true;
      setTimeout(() => {
        walletGetDepositCharge(amount.value).then((res) => {
          if (res.status === 200) {
            charge.value = res.data.data;
            loading.value = false;
          }
        });
      }, [1200]);
    }
  }
);
</script>

