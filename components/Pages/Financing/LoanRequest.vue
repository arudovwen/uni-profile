<template>
  <form @submit.prevent="onSubmit" class="w-full mt-6">
    <div class="grid grid-cols-2 gap-x-[25px] gap-y-4 mb-[50px]">
      <FormGroup
        label="How much do you require?"
        :error="errors.amountRequired"
        name="amountRequired"
        :isRequired="true"
        classLabel="!normal-case"
      >
        <CurrencyInput
          min="1"
          :class="` outline-none px-[14px] py-[10px] min-w-[180px] w-full !bg-white border !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.amountRequired ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
          v-model="amountRequired"
          :options="{
            currency: 'ngn',
            currencyDisplay: 'hidden',
          }"
        />
      </FormGroup>

      <FormGroup  classLabel="!normal-case" label="Tenor" :error="errors.tenor" name="tenor"  :isRequired="true">
        <Select
          v-model="tenor"
          :options="options"
          placeholder="Select tenor"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer ${
            errors.tenor ? 'border-red-500' : 'border-[#D0D5DD]'
          }`"
        />
      </FormGroup>
      <div class="md:col-span-2">
        <Textinput
          placeholder=""
          label="Where did you hear about us?"
          name="whereDidYouHearAboutUs"
          v-bind="whereDidYouHearAboutUsAtt"
          v-model="whereDidYouHearAboutUs"
          :error="errors.whereDidYouHearAboutUs"
           classLabel="!normal-case"
        />
      </div>
    </div>
    <div class="flex gap-x-4 items-center justify-end">
      <AppButton
        :disabled="isLoading"
        :isLoading="isLoading"
        btnClass="bg-primary-500 text-white !px-12  !text-sm !py-[10px] disabled:cursor-not-allowed"
        type="submit"
        text="Next"
      />
    </div>
  </form>
</template>

<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";

const isLoading = ref(false);
const formValues = reactive({
  amountRequired: null,
  tenor: "",
  whereDidYouHearAboutUs: "",
});
const active = inject("active");
const formData = inject("formData");
const schema = yup.object({
  amountRequired: yup
    .number()
    .typeError("invalid value")
    .min(100, "Minimum amount is 100 naira")
    .required("Amount is required"),
  tenor: yup.string().required("Tenor is required"),
  whereDidYouHearAboutUs: yup.string(),
});

const { handleSubmit, defineField, errors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    amountRequired: formData.amountRequired,
    tenor: formData.tenor,
    whereDidYouHearAboutUs: formData.whereDidYouHearAboutUs,
  },
});

const [amountRequired] = defineField("amountRequired");
const [tenor] = defineField("tenor");
const [whereDidYouHearAboutUs, whereDidYouHearAboutUsAtt] = defineField(
  "whereDidYouHearAboutUs"
);

const onSubmit = handleSubmit((values) => {
	formData.amountRequired = values.amountRequired;
  formData.tenor = values.tenor;
  formData.whereDidYouHearAboutUs = values.whereDidYouHearAboutUs;
  active.value = 2;

});

const options = [
  {
    label: "7 days",
    value: 7,
  },
  {
    label: "14 days",
    value: 14,
  },
  {
    label: "30 days",
    value: 30,
  },
  {
    label: "60 days",
    value: 60,
  },
];
</script>

