<template>
  <ModalCenterProp :is-modal-open="isCreatePin" @close="emit('close')">
  <template #default>
    <div class="min-w-[350px] max-w-[350px] py-6 px-6">

      <h2 class="block text-lg font-semibold text-[#101828] text-left mb-1">
        Transaction PIN
      </h2>
      <p class="text-sm text-[#475467] text-left mb-6">
        You need to set a 4 digit PIN for verifying your transactions.
      </p>

      <form @submit.prevent="onSubmit">
        <div class="mb-6">
          <Textinput
            hasicon
            placeholder=""
            label="New transaction pin"
            type="password"
            name="transactionPIN"
            v-model="transactionPIN"
            v-bind="transactionPINAtt"
            :error="errors.transactionPIN"
          />
        </div>
        <div class="mb-8">
          <Textinput
            hasicon
            placeholder=""
            label="Confirm transaction pin"
            type="password"
            name="confirmPin"
            v-model="confirmPin"
            v-bind="confirmPinAtt"
            :error="errors.confirmPin"
          />
        </div>
        <div class="flex gap-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-matta-black hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] font-medium justify-center flex items-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="border text-[13px] mb-4 border-primary- uppercase text-white lg:min-w-[120px] w-full bg-primary-500 rounded-lg px-6 py-2 hover:bg-primary/80 h-11"
          >
            <span>
              <span
                class="flex gap-x-4 justify-center items-center"
                v-if="isLoading"
                ><span> Processing...</span>
                <i
                  v-if="isLoading"
                  class="fa fa-spinner fa-spin text-white"
                  aria-hidden="true"
                ></i
              ></span>
              <span v-else>Set PIN</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </template>
  </ModalCenterProp>
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { setWalletpin } from "~/services/walletservice";
import { toast } from "vue3-toastify";

defineProps({
  isCreatePin: {
    default: false,
  },
  buttonText: {
    default: "Verify Pin",
  },
});
const emit = defineEmits(["close"]);

const form = reactive({
  transactionPIN: "",
  confirmPin: "",
});
const schema = yup.object({
  transactionPIN: yup
    .string()
    .length(4, "Pin must be 4 digits")
    .required("Pin is required"),
  confirmPin: yup
    .string()
    .length(4, "Confirm pin must be 4 digits")
    .required("Confirm pin is required")
    .oneOf([yup.ref("transactionPIN")], "Pins must match"),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: form,
});

const [transactionPIN, transactionPINAtt] = defineField("transactionPIN");
const [confirmPin, confirmPinAtt] = defineField("confirmPin");

const isLoading = ref(false);
const authStore = useAuthStore()
const onSubmit = handleSubmit((values) => {
  isLoading.value = true;

  setWalletpin(values)
    .then((res) => {
      if (res.status === 200) {
        authStore.setHasPin(true)
        emit("close");
        isLoading.value = false;
        toast.info("Transaction pin set!");
      }
    })
    .catch((err) => {
      toast.error(err.response.data.Message || err.res.data.message);

      isLoading.value = false;
    });
});
</script>

