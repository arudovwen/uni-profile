<template>
  <h3 class="font-semibold text-2xl mb-10 lg:min-w-[580px]">Add director</h3>
  <form @submit.prevent="onSubmit" class="">
    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4">
      <div class="mb-6">
        <Textinput
          placeholder=""
          label="First name"
          type="text"
          name="firstName"
          v-bind="firstNameAtt"
          v-model="firstName"
          :error="errors.firstName"
          isCumpulsory
        />
      </div>

      <div class="mb-6">
        <Textinput
          placeholder=""
          label="Last name"
          type="text"
          name="lastName"
          v-bind="lastNameAtt"
          v-model="lastName"
          :error="errors.lastName"
          isCumpulsory
        />
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4">
      <div class="mb-6">
        <Textinput
          placeholder=""
          label="E-mail"
          type="email"
          name="email"
          v-bind="emailAtt"
          v-model="email"
          :error="errors.email"
          isCumpulsory
        />
      </div>
      <div class="mb-6">
        <FormGroup  isCumpulsory label="Phone number" :error="errors.phone">
          <FormsPhoneCodes v-model="phone" />
        </FormGroup>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4">
      <div class="mb-6" v-if="companyInfo?.country?.toLowerCase()=== 'nigeria'">
        <Textinput
          placeholder=""
          label="BVN"
          type="text"
          name="bvn"
          v-bind="bvnAtt"
          v-model="bvn"
          :error="errors.bvn"
          isCumpulsory
        />
      </div>
      <div class="mb-6">
        <FormGroup isCumpulsory label="Date of birth" :error="errors.dob" name="dob">
          <ClientOnly>
            <VueDatePicker
              auto-apply
              v-model="dob"
              placeholder="Select date"
              :enable-time-picker="false"
              :input-class-name="`!rounded-lg px-[14px] py-[10px] h-11 w-full border  placeholder:text-[#B6B7B9] focus:outline-matta-black/20 ${
                errors.dob ? 'border-red-500' : 'border-[#DCDEE6]'
              }`"
            />
          </ClientOnly>
        </FormGroup>
      </div>
    </div>
    <div class="lg:col-span-2 mb-6">
      <Textinput
        placeholder=""
        label="Home address"
        type="text"
        name="address"
        v-bind="addressAtt"
        v-model="address"
        :error="errors.address"
      />
    </div>
    <div class="lg:col-span-2 mb-6">
      <Textinput
        placeholder=""
        label="Linkedin url"
        type="text"
        name="linkedIn"
        v-bind="linkedInAtt"
        v-model="linkedIn"
        :error="errors.linkedIn"
      />
    </div>

    <div class="lg:col-span-2 mb-6">
      <FormGroup  
        :error="isFieldTouched('identityUrl') ? errors.identityUrl : ''"
      >
        <FileUpload
          label="Upload ID (Passport, Driver’s License, or NIN)"
          id="identityUrl"
          :modelValue="form.identityUrl"
          :isCumpulsory="true"
        />
        <button
          @click="downloadFile(form.identityUrl, 'Identity card')"
          download
            class="outline-none"
          v-if="form.identityUrl"
        >
          <span class="block text-xs text-blue-500 mt-1"
            >Download Identity card</span
          ></button
        >
      </FormGroup>
    </div>
    <div class="lg:col-span-2 mb-6">
      <FormGroup  
        :error="isFieldTouched('utilityBillUrl') ? errors.utilityBillUrl : ''"
      >
        <FileUpload
          label="Upload Utility Bill"
          id="utilityBillUrl"
          :modelValue="form.utilityBillUrl"
          :isCumpulsory="true"
        />
        <button
          @click="downloadFile(form.utilityBillUrl, 'Identity card')"
          download
          v-if="form.utilityBillUrl"
          class="outline-none"
        >
          <span class="block text-xs text-blue-500 mt-1"
            >Download Utility Bill</span
          ></button
        >
      </FormGroup>
    </div>
    <div class="lg:col-span-2 mb-6">
      <FormGroup
        :error="isFieldTouched('signatureUrl') ? errors.signatureUrl : ''"
      >
        <FileUpload
          label="Upload Signature"
          id="signatureUrl"
          :modelValue="form.signatureUrl"
          :isCumpulsory="true"
        />
        <button
          @click="downloadFile(form.signatureUrl, 'Signature')"
          download
          v-if="form.signatureUrl"
            class="outline-none"
        >
          <span class="block text-xs text-blue-500 mt-1"
            >Download Signature</span
          ></button
        >
      </FormGroup>
    </div>
    <div class="flex justify-end gap-x-4 mt-8 w-full">
      <button
        type="button"
        @click="open = false"
        class="text-xs uppercase border border-gray-200 w-full px-5 py-4 rounded-lg"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isLoading || !form.signatureUrl || !form.identityUrl"
        class="text-xs uppercase bg-primary-500 text-white px-5 py-4 rounded-lg hover:bg-primary/70 disabled:opacity-60 w-full"
      >
        Add director
      </button>
    </div>
  </form>
</template>

<script setup>
import moment from "moment";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import * as yup from "yup";

const open = inject("open");
const formData = inject("form");
const companyInfo = inject("companyInfo");

const props = defineProps(["type", "director", "id"]);
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bvn: "",
  dob: "",
  linkedIn: "",
  address:"",
  signatureUrl: "",
  identityUrl: "",
  utilityBillUrl: "",
  country:companyInfo?.value?.country
});
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Home address is required"),
  dob: yup.date().typeError("Invalid date").required("Date of birth is required").nullable(),
  linkedIn: yup.string(), // No validation for LinkedIn URL
  signatureUrl: yup.string().required("Signature URL is required"),
  identityUrl: yup.string().required("Identity URL is required"),
  utilityBillUrl: yup.string().required("Utility Bill is required"),
  bvn: yup.string().when("country", {
    is: "Nigeria",
    then: (schema) => schema.required("BVN is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
const {
  handleSubmit,
  defineField,
  errors,
  setFieldValue,
  setFieldTouched,
  isFieldTouched,
} = useForm({
  validationSchema: schema,
  initialValues: form,
});
const [firstName, firstNameAtt] = defineField("firstName");
const [lastName, lastNameAtt] = defineField("lastName");
const [email, emailAtt] = defineField("email");
const [phone] = defineField("phone");
const [bvn, bvnAtt] = defineField("bvn");
const [dob] = defineField("dob");
const [linkedIn, linkedInAtt] = defineField("linkedIn");
const [address, addressAtt] = defineField("address");


onMounted(() => {
  if (props.director) {
    form.firstName = props.director.firstName;
    form.lastName = props.director.lastName;
    form.email = props.director.email;
    form.phone = props.director.phone;
    form.bvn = props.director.bvn;
    form.dob = new Date(props.director.dob);
    form.linkedIn = props.director.linkedIn;
    form.address = props.director.address
    form.signatureUrl = props.director.signatureUrl;
    form.identityUrl = props.director.identityUrl;
    form.utilityBillUrl = props.director.utilityBillUrl
    Object.keys(props.director).forEach(item=>{
       setFieldValue(item, props.director[item])
    })
  }
});
const isLoading = ref(false);

function handleChange(id, value) {
  setFieldValue(id, value);
  setFieldTouched(id, true);
  if (id === "signatureUrl") {
    form.signatureUrl = value;
  }
  if (id === "identityUrl") {
    form.identityUrl = value;
  }
  if (id === "utilityBillUrl") {
    form.utilityBillUrl = value;
  }
}
const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  if (props.type === "add") {
    formData.directors.push(values);
  } else {
    formData.directors.map((i, index) => {
      if (index === props.id) {
        i.firstName = values.firstName;
        i.lastName = values.lastName;
        i.email = values.email;
        i.phone = values.phone;
        i.bvn = values.bvn;
        i.dob = values.dob;
        i.address = values.address;
        i.linkedIn = values.linkedIn;
        i.signatureUrl = values.signatureUrl;
        i.identityUrl = values.identityUrl;
        i.utilityBillUrl = values.utilityBillUrl;
      }
      return i;
    });
  }

  open.value = false;
});
async function handleSubmifft() {
  if (props.type === "add") {
    formData.directors.push(form);
  } else {
    formData.directors.map((i, index) => {
      if (index === props.id) {
        i.firstName = fo.firstName;
        i.lastName = form.lastName;
        i.email = form.email;
        i.phone = form.phone;
        i.bvn = form.bvn;
        i.dob = form.dob;
        i.linkedIn = form.linkedIn;
        i.signatureUrl = form.signatureUrl;
        i.identityUrl = form.identityUrl;
      }
      return i;
    });
  }

  open.value = false;
}
provide("handleChange", handleChange);
</script>
