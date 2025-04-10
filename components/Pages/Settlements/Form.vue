<template>
  <div class="bg-white w-full sm:min-w-[350px]">
    <legend class="block text-[20px] font-bold mb-8 text-left">
      {{ detail ? "Update" : "Add" }} Settlement Account
    </legend>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-y-6 w-full">
      <FormGroup
        label="Bank"
        isRequired
        :error="errors.bankCode"
        name="bankCode"
      >
        <SelectVueSelect
          v-model="bankCode"
          :disabled="loadingBanks"
          :options="banks"
          :reduce="(bank) => bank.value"
          :placeholder="loadingBanks ? 'Fetching list' : 'Select bank'"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.bankCode ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>
      <div>
        <Textinput
          isRequired
          placeholder=""
          label="Account number"
          name="accountNumber"
          classInput="!h-[45px]"
          v-model="accountNumber"
          v-bind="accountNumberAtt"
          :error="errors.accountNumber"
        />
      </div>

      <div class="flex  items-center justify-center" v-if="loadingUser">
        <FileLoader />
      </div>
      <div v-if="formValues.accountName && !loadingUser">
        <Textinput
          placeholder=""
          label="Account name"
          name="accountName"
          v-model="formValues.accountName"
          disabled
        />
      </div>

      <div
        class="flex items-center text-[#333] darks:text-slate-400 text-xs md:text-sm gap-x-[2px]"
      >
        <Checkbox
          label="Set as settlement account"
          labelClass="text-xs md:text-sm"
          v-model="isPrimaryAccount"
          v-bind="isPrimaryAccountAtt"
        />
      </div>

      <div class="grid grid-cols-2 gap-x-4 mt-4">
        <button
          @click="isOpen = false"
          type="button"
          class="appearance-none leading-none px-5 lg:px-10 py-[10px] rounded-lg text-primary border-primary- border hover:bg-gray-300"
        >
          Cancel
        </button>
        <AppButton
          type="submit"
          :isLoading="isLoading"
          :isDisabled="isLoading"
          :text="`${detail ? 'Update' : 'Add'} account`"
          btnClass="normal-case btn-primary !py-3"
        />
      </div>
    </form>
  </div>
  <ActionModal
    :open="isSuccessOpen"
    type="success"
    title="Setllement Added"
    :text="errorText"
    btnText="Okay"
    :isCancel="false"
    @actionItem="
      () => {
        isSuccessOpen = false;
        handleSuccess();
      }
    "
    @close="handleSuccess"
  />
  <ActionModal
    :open="isErrorOpen"
    type="reject"
    title="Request Failed"
    :text="errorText"
    btnText="Retry"
    @actionItem="() => (isErrorOpen = false)"
    @close="() => (isOpen = false)"
  />
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import {
  addSettlement,
  updateSettlement,
  getBanks,
  validateAccount,
} from "~/services/settlementservice";

const emits = defineEmits(["refresh", "close"]);
const isSuccessOpen = ref(false);
const isErrorOpen = ref(false);
const errorText = ref("Settlement creation failed");
const props = defineProps(["id", "detail"]);
const isOpen = inject("isOpen");
const handleSuccess = inject("handleSuccess");
const isLoading = ref(false);
const banks = ref([]);
const loadingBanks = ref(false);
const formValues = reactive({
  id: null,
  bankCode: "",
  accountNumber: "",
  accountName: "",
  isPrimaryAccount: false,
});

const schema = yup.object().shape({
  bankCode: yup.string().required("Bank name is required"),
  accountNumber: yup
    .string()
    .matches(/^\d{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
  isPrimaryAccount: yup.boolean(),
});

const { handleSubmit, defineField, errors, setValues, setFieldValue, values } =
  useForm({
    validationSchema: schema,
    initialValues: formValues,
  });
onMounted(() => {
  loadingBanks.value = true;
  getBanks().then((res) => {
    if (res.status === 200) {
      loadingBanks.value = false;
      banks.value = res.data.data.responseBody.map((i) => ({
        label: i.name,
        value: i.code.toString(),
      }));
      if (props.detail) {
        const tempBank = res.data.data.responseBody
          .find((i) => i.name === props.detail.bankName)
          ?.code.toString();
        setFieldValue("bankCode", tempBank);
      }
    }
  });
  if (props.detail) {
    setValues(props.detail);
  }
});
const [bankCode] = defineField("bankCode");
const [accountNumber, accountNumberAtt] = defineField("accountNumber");
const [isPrimaryAccount, isPrimaryAccountAtt] = defineField("isPrimaryAccount");

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  (!props.detail ? addSettlement : updateSettlement)(values)
    .then((res) => {
      if (res.status === 200) {
        emits("refresh");
        isLoading.value = false;
        isSuccessOpen.value = false;
        isOpen.value = false;
      }
    })

    .catch((err) => {
      errorText.value =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Settlement creation failed";
      isErrorOpen.value = true;
      isLoading.value = false;
    });
});
const loadingUser = ref(false);
watch(
  () => [values.accountNumber, values.bankCode],
  () => {
    if (values.accountNumber?.length === 10 && values.bankCode) {
      loadingUser.value = true;
      validateAccount({
        bankCode: values.bankCode,
        accountNumber: values.accountNumber,
      })
        .then((res) => {
          formValues.accountName = res.data.data.responseBody.accountName;
          setFieldValue("accountName", res.data.data.responseBody.accountName);
          loadingUser.value = false;
        })
        .catch((err) => {
          loadingUser.value = false;
          toast.error("Invalid account number");
        });
    }
  }
);
</script>
