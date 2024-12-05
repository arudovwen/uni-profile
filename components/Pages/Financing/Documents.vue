<template>
  <form @submit.prevent="onSubmit" class="w-full mt-6">
    <div class="grid grid-cols-2 gap-x-[25px] gap-y-4 mb-[50px]">
      <FormGroup
        class="col-span-2"
        label="Bank Statement (6 months statement is required)"
        isCumpulsory
      >
        <div class="grid gap-y-7 mb-4">
          <div
            v-for="(file, idx) in formData?.supportingDocuments[0].urls"
            :key="idx"
          >
            <div class="relative">
              <FileUpload id="BankStatement" v-model="file.url" />
              <button
                v-if="formData?.supportingDocuments[0]?.urls.length > 1"
                type="button"
                class="text-red-500 text-xs font-medium right-0 -top-5 absolute"
                @click="removeField(0, idx)"
              >
                Remove
              </button>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-3" v-if="file.url">
              <span @click="downloadFile(file.url, 'BankStatement')">
                <span class="block text-xs text-blue-500 mt-1"
                  >Download Bank Statement {{ idx + 1 }}</span
                ></span
              >
            </div>
          </div>
        </div>
        <div class="mt-1">
          <button
            @click="addField(0)"
            type="button"
            class="block text-primary-500 text-xs font-medium ml-auto"
          >
            + Add document
          </button>
        </div>
      </FormGroup>

      <FormGroup class="col-span-2" label="Proforma Invoice" isCumpulsory>
        <div class="grid gap-y-7 mb-4">
          <div
            v-for="(file, idx) in formData?.supportingDocuments[1].urls"
            :key="idx"
          >
            <div class="relative">
              <FileUpload id="ProformaInvoice" v-model="file.url" />
              <button
                v-if="formData?.supportingDocuments[1]?.urls.length > 1"
                type="button"
                class="text-red-500 text-xs font-medium right-0 -top-5 absolute"
                @click="removeField(1, idx)"
              >
                Remove
              </button>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-3" v-if="file.url">
              <span @click="downloadFile(file.url, 'ProformaInvoice')">
                <span class="block text-xs text-blue-500 mt-1"
                  >Download Proforma Invoice {{ idx + 1 }}</span
                ></span
              >
            </div>
          </div>
        </div>
        <div class="mt-1">
          <button
            @click="addField(1)"
            type="button"
            class="block text-primary-500 text-xs font-medium ml-auto"
          >
            + Add document
          </button>
        </div>
      </FormGroup>
      <FormGroup
        label="Evidence of previously successful supply contracts (PO and Paid Invoices)"
        class="col-span-2"
        v-if="id == 1 || id == 3"
        isCumpulsory
      >
        <div class="grid gap-y-7 mb-6">
          <div
            v-for="(file, idx) in formData?.supportingDocuments[2].urls"
            :key="idx"
          >
            <div class="relative">
              <FileUpload
                id="EvidenceOfPreviouslySuccessfulSupplyContracts"
                v-model="file.url"
              />
              <button
                v-if="formData?.supportingDocuments[2]?.urls.length > 1"
                type="button"
                class="text-red-500 text-xs font-medium right-0 -top-5 absolute"
                @click="removeField(2, idx)"
              >
                Remove
              </button>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-3" v-if="file.url">
              <span
                @click="
                  downloadFile(
                    file.url,
                    'EvidenceOfPreviouslySuccessfulSupplyContracts'
                  )
                "
              >
                <span class="block text-xs text-blue-500 mt-1"
                  >Download Contract {{ idx + 1 }}</span
                ></span
              >
            </div>
          </div>
        </div>
        <div class="mt-1">
          <button
            @click="addField(2)"
            type="button"
            class="block text-primary-500 text-xs font-medium ml-auto"
          >
            + Add document
          </button>
        </div>
      </FormGroup>

      <FormGroup label="Other documents" class="col-span-2">
        <div class="grid gap-y-7 mb-6">
          <div
            v-for="(file, idx) in formData?.supportingDocuments[3].urls"
            :key="idx"
          >
            <div class="relative">
              <FileUpload id="OtherDocuments" v-model="file.url" />
              <button
                v-if="formData?.supportingDocuments[3]?.urls.length > 1"
                type="button"
                class="text-red-500 text-xs font-medium right-0 -top-5 absolute"
                @click="removeField(3, idx)"
              >
                Remove
              </button>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-3" v-if="file.url">
              <span @click="downloadFile(file.url, 'Others')">
                <span class="block text-xs text-blue-500 mt-1"
                  >Download Other document {{ idx + 1 }}</span
                ></span
              >
            </div>
          </div>
        </div>
        <div class="mt-1">
          <button
            @click="addField(3)"
            type="button"
            class="block text-primary-500 text-xs font-medium ml-auto"
          >
            + Add document
          </button>
        </div>
      </FormGroup>

      <div class="md:col-span-2" v-if="id == 0 || id == 3">
        <Textinput
          placeholder=""
          label="Have you done business with the buyer before?"
          name="haveyoudonebusiness"
          v-bind="haveyoudonebusinessAtt"
          v-model="haveyoudonebusiness"
          :error="errors.haveyoudonebusiness"
        />
      </div>
      <div class="md:col-span-2" v-if="id == 0 || id == 3">
        <Textinput
          placeholder=""
          label="Have you previously exported to the order’s country of destination?"
          name="haveyouexportedtotheothercourty"
          v-bind="haveyouexportedtotheothercourtyAtt"
          v-model="haveyouexportedtotheothercourty"
          :error="errors.haveyouexportedtotheothercourty"
        />
      </div>
    </div>
    <div class="flex gap-x-4 items-center justify-end">
      <AppButton
        btnClass="bg-white text-white !px-11  !text-sm !py-[10px] disabled:cursor-not-allowed border border-[#BDC0C5] !rounded-lg !text-[#333]"
        type="button"
        text="Back"
        @click="active--"
      />
      <AppButton
        :disabled="
          isLoading || errors?.BankStatement || errors?.ProformaInvoice
        "
        :isLoading="isLoading"
        btnClass="bg-primary-500 text-white !px-12  !text-sm !py-[10px] disabled:cursor-not-allowed border  !rounded-lg border-primary-500"
        type="submit"
        text="Submit"
      />
    </div>
  </form>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { addFinance, editFinance } from "~/services/financeservice";

const isLoading = ref(false);
const route = useRoute();
const { id, financeId } = route.params;

const active = inject("active");
const formData = inject("formData");

const formSchema = yup.object().shape({
  haveyouexportedtotheothercourty: yup.string(),
  haveyoudonebusiness: yup.string(),
  EvidenceOfPreviouslySuccessfulSupplyContracts: yup.string().nullable(),
  ProformaInvoice: yup
    .string()
    .required("Proforma Invoice is required")
    .nullable(),
  BankStatement: yup.string().required("Bank statement is required").nullable(),
  OtherDocuments: yup.string().nullable(),
});

const {
  handleSubmit,
  defineField,
  errors,
  setFieldValue,
  setFieldTouched,
  isFieldTouched,
} = useForm({
  validationSchema: formSchema,
  initialValues: {
    haveyouexportedtotheothercourty: formData.haveyouexportedtotheothercourty,
    haveyoudonebusiness: formData.haveyoudonebusiness,
    EvidenceOfPreviouslySuccessfulSupplyContracts: "",
    ProformaInvoice: "",
    BankStatement: "",
    OtherDocuments: "",
  },
});

const [haveyoudonebusiness, haveyoudonebusinessAtt] = defineField(
  "haveyoudonebusiness"
);
const [haveyouexportedtotheothercourty, haveyouexportedtotheothercourtyAtt] =
  defineField("haveyouexportedtotheothercourty");

function addField(id) {
  formData?.supportingDocuments[id].urls.push({
    url: "",
  });
}

function removeField(id, idx) {
  formData?.supportingDocuments[id].urls.splice(idx, 1);
}

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  formData.haveyoudonebusiness = values.haveyoudonebusiness;
  formData.haveyouexportedtotheothercourty =
    values.haveyouexportedtotheothercourty;
  if (financeId) {
    editFinance({
      ...formData,
      supportingDocuments: formData?.supportingDocuments.map((i) => ({
        ...i,
        urls: i.urls.map((j) => j.url),
      })),
      id: financeId,
    })
      .then((res) => {
        if (res.status === 200) {
          active.value = 3;
          isLoading.value = false;
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.Message || err?.response?.data?.message
        );
        isLoading.value = false;
      });
  } else {
    addFinance({
      ...formData,
      supportingDocuments: formData?.supportingDocuments.map((i) => ({
        ...i,
        urls: i.urls.map((j) => j.url),
      })),
    })
      .then((res) => {
        if (res.status === 200) {
          active.value = 3;
          isLoading.value = false;
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.Message || err?.response?.data?.message
        );
        isLoading.value = false;
      });
  }
});

onMounted(() => {
  if (financeId && id) {
    setFieldValue(
      "ProformaInvoice",
      formData?.supportingDocuments[1].urls.some((i) => !i.url) ? "" : "Valid"
    );

    setFieldValue(
      "BankStatement",
      formData?.supportingDocuments[0].urls.some((i) => !i.url) ? "" : "Valid"
    );
    setFieldValue(
      "EvidenceOfPreviouslySuccessfulSupplyContracts",
      formData?.supportingDocuments[2].urls.some((i) => !i.url) ? "" : "Valid"
    );
    setFieldValue(
      "OtherDocuments",
      formData?.supportingDocuments[3].urls.some((i) => !i.url) ? "" : "Valid"
    );
  }
});
function handleChange(id, value) {}
watch(
  formData,

  () => {
    console.log("🚀 ~ ProformaInvoice:");
    setFieldValue(
      "ProformaInvoice",
      formData?.supportingDocuments[1].urls.some((i) => !i.url) ? "" : "Valid"
    );

    setFieldValue(
      "BankStatement",
      formData?.supportingDocuments[0].urls.some((i) => !i.url) ? "" : "Valid"
    );
    setFieldValue(
      "EvidenceOfPreviouslySuccessfulSupplyContracts",
      formData?.supportingDocuments[2].urls.some((i) => !i.url) ? "" : "Valid"
    );
    setFieldValue(
      "OtherDocuments",
      formData?.supportingDocuments[3].urls.some((i) => !i.url) ? "" : "Valid"
    );
  }
);
provide("handleChange", handleChange);
</script>
