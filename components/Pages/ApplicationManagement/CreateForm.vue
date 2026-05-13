<template>
  <div class="max-w-[1200px] ">
    <div class="mb-6">
      <GoBack text="Back to App Management" url="/application-management" />
    </div>
    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent title="Add New App" subtext="Create a new application" />
    </div>
    <hr class="border-[#E4E7EC] my-6" />
    <div class="flex flex-col items-start p-0 gap-[16px] w-full">
      <form @submit.prevent="onSubmit" class="grid w-full grid-cols-1 gap-y-6">
        <div class="bg-white border border-[#E9EAEB] rounded-[12px] p-5">
          <FormGroupV2 label="Application name">
            <Textinput
              placeholder="Enter application name"
              label=""
              v-bind="nameAtt"
              v-model="name"
              :error="errors.name"
              :isRequired="true"
              containerStyle="rounded-[10px] border-[#D0D5DD] bg-white"
            />
          </FormGroupV2>
        </div>

        <div class="bg-white border border-[#E9EAEB] rounded-[12px] p-5">
          <FormGroupV2
            label="Application URL Link"
            subtext="The URL to access the app"
          >
            <Textinput
              placeholder="Enter application URL link"
              v-bind="urlAtt"
              v-model="url"
              :error="errors.url"
              :isRequired="true"
              containerStyle="rounded-[10px] border-[#D0D5DD] bg-white"
            />
          </FormGroupV2>
        </div>

        <div class="bg-white border border-[#E9EAEB] rounded-[12px] p-5">
          <FormGroupV2 label="Description">
            <Textarea
              placeholder="Enter application description"
              v-model="description"
              :error="errors.description"
              :isRequired="true"
              classInput="w-full rounded-[10px] border border-[#D0D5DD] px-4 py-3 text-sm text-[#344054] placeholder:text-[#98A2B3]"
            />
          </FormGroupV2>
        </div>

        <div class="bg-white border border-[#E9EAEB] rounded-[12px] p-5">
          <FormGroupV2 label="Application logo" subtext="Upload the app logo.">
            <FormGroup label="" :error="errors.logoUrl" name="logoUrl">
              <FileUpload id="iconUrl" v-model="logoUrl" :isRequired="true" />
            </FormGroup>
          </FormGroupV2>
        </div>

        <div class="bg-white border border-[#E9EAEB] rounded-[12px] p-5">
          <FormGroupV2 label="Application Icon" subtext="Upload the app favicon">
            <FormGroup label="" :error="errors.iconUrl" name="iconUrl">
              <FileUpload id="iconUrl" v-model="iconUrl" :isRequired="true" />
            </FormGroup>
          </FormGroupV2>
        </div>

        <div class="bg-white border border-[#E9EAEB] rounded-[12px] p-5">
          <FormGroupV2
            label="Two Factor Authentication"
            subtext="Add an extra layer of security "
          >
            <FormGroup
              label="Enable 2FA"
              :error="errors.isTwoFactorAuthEnabled"
              :horizontal="true"
              name="iconUrl"
              ><input type="checkbox" v-model="isTwoFactorAuthEnabled" />
            </FormGroup>
          </FormGroupV2>
        </div>

        <hr class="border-[#E4E7EC] mt-6" />
        <div
          class="flex gap-x-4 pt-4 p-0 w-full z-30 justify-end ml-auto max-w-[400px]"
        >
          <AppButton
            btnClass="w-full text-[#344054] bg-white border-[#D0D5DD] border-[1px]"
            type="button"
            :is-disabled="isLoading"
            text="Cancel"
            @click="
              () => {
                emits('close');
              }
            "
          />
          <AppButton
            class="w-full"
            type="submit"
            :isLoading="isLoading"
            :is-disabled="isLoading"
            text="Submit"
          />
        </div>
      </form>
    </div>
  </div>

  <ActionModal
    :open="isSuccessOpen"
    type="approve"
    :title="`Application ${id ? 'Updated' : 'Created'}`"
    :text="`Your application has been ${
      id ? 'updated' : 'created'
    } successfully`"
    btnText="Close"
    :isCancel="false"
    @actionItem="
      () => {
        navigateTo('/application-management');
      }
    "
    @close="navigateTo('/application-management')"
  />
</template>

<script setup>
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { addSubApp, editSubApp, getSubApp } from "~/services/userservices";

const { id } = useRoute().params;

const formValues = {
  name: "",
  logoUrl: "",
  iconUrl: "",
  isTwoFactorAuthEnabled: true,
  isDisabled: false,
  url: "",
  description: "",
};

const schema = yup.object({
  name: yup.string().required("Application name is required"),
  logoUrl: yup.string().required("Logo is required"),
  iconUrl: yup.string().required("Icon is required"),
  isTwoFactorAuthEnabled: yup.boolean(),
  isDisabled: yup.boolean(),
  description: yup.string().required(),
  url: yup
    .string()
    .trim()
    .url("Please enter a valid URL")
    .required("URL is required"),
});

const { handleSubmit, defineField, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

const [name, nameAtt] = defineField("name");
const [iconUrl] = defineField("iconUrl");
const [url, urlAtt] = defineField("url");
const [description] = defineField("description");
const [logoUrl] = defineField("logoUrl");
const [isTwoFactorAuthEnabled] = defineField("isTwoFactorAuthEnabled");

const isSuccessOpen = ref(false);
const isLoading = ref(false);

onMounted(() => {
  if (id) {
    getSubApp(id).then((res) => {
      if (res.status === 200) {
        setValues(res.data.data);
      }
    });
  }
});
const emits = defineEmits(["refresh", "close"]);
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const response = await (id ? editSubApp : addSubApp)(values);

    if (response.status === 200) {
      isSuccessOpen.value = true;
      emits("refresh");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
  } finally {
    isLoading.value = false;
  }
});

provide("handleChange", null);
</script>
