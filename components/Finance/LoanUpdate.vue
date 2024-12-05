<template>
  <div class="grid bg-white rounded-[10px] md:min-w-[320px] w-full">
    <div class="mb-4">
      <img alt="loan" src="/images/approve.png" />
    </div>
    <div class="mb-4">
      <legend class="text-[#18273AF0] text-lg font-bold mb-1">
        Review loan offer
      </legend>
      <p class="text-sm text-[rgba(71,84,103,1)]">
        Kindly review your loan offer for disbursement
      </p>
    </div>

    <div
      class="border-[#EAECF0] border rounded-lg bg-[#F2F4F7] py-4 px-4 mb-4 grid gap-y-1"
    >
      <div class="flex gap-x-2 items-center">
        <span class="text-xs text-[#667085]">Requested amount:</span>
        <span class="text-sm font-medium text-[#667085]">{{
          currencyFormat(detail.amountRequired)
        }}</span>
      </div>
      <div class="flex gap-x-2 items-center">
        <span class="text-xs text-[#667085]">Approved amount:</span>
        <span class="text-sm font-medium text-[#667085]">{{
          currencyFormat(detail.amountApproved)
        }}</span>
      </div>
      <div class="flex gap-x-2 items-center">
        <span class="text-xs text-[#667085]">Tenure amount:</span>
        <span class="text-sm font-medium text-[#667085]"
          >{{ detail.tenor }} days</span
        >
      </div>
      <div class="flex gap-x-2 items-center">
        <span class="text-xs text-[#667085]">Interest rate: </span>
        <span class="text-sm font-medium text-[#667085]"
          >{{ detail.interestRate }}%</span
        >
      </div>
    </div>

    <div class="">
      <AppButton
        @click="handleApprove"
        :isLoading="approveloading"
        :isDisabled="loading || approveloading"
        type="button"
        text=" Accept conditional offer"
        class="appearance-none leading-none px-10 py-4 w-full rounded-lg text-white bg-[#0E9384] hover:opacity-70 mb-4"
				data-testid="accept"
      />

      <AppButton
        type="button"
        @click="handleReject"
        :isLoading="loading"
        text="  Reject offer"
        :isDisabled="approveloading || loading"
        class="appearance-none leading-none px-10 py-4 rounded-lg !text-[#344054] hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] bg-transparent font-medium"
      />
    </div>
  </div>
</template>
<script setup>
import { toast } from "vue3-toastify";
import { updateFinanceStatus } from "~/services/financeservice";

const props = defineProps(["detail"]);
const emits = defineEmits(["refresh"]);
const loading = ref(false);
const approveloading = ref(false);

function handleReject() {
  loading.value = true;
  let data = {
    financeRequestId: props.detail.id,
    approvalStatus: 4,
    approvedAmount:props.detail.amountApproved,
    tenor: props.detail.tenor,
  };
  updateFinanceStatus(data)
    .then((res) => {
      if (res.status === 200) {
        loading.value = false;
        emits("refresh");
      }
    })
    .catch((err) => {
      loading.value = false;
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Unable to complete request"
      );
    });
}
function handleApprove() {
  let data = {
    financeRequestId: props.detail.id,
    approvalStatus: 3,
    approvedAmount:props.detail.amountApproved,
    tenor: props.detail.tenor,
  };
  approveloading.value = true;
  updateFinanceStatus(data)
    .then((res) => {
      if (res.status === 200) {
        approveloading.value = false;
        emits("refresh");
      }
    })
    .catch((err) => {
      approveloading.value = false;
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Unable to complete request"
      );
    });
}
</script>
