<template>
  <div
    class="flex flex-col items-center p-0 pt-6 w-full bg-white z-10 lg:w-[500px]"
  >
    <div class="deco flex flex-col items-center gap-[16px] mb-6 z-0">
      <div
        class="flex flex-col items-center p-0 gap-[4px] flex-none order-1 self-stretch flex-grow-0"
      >
        <div
          class="text-center flex-none order-0 self-stretch flex-grow-0 w-[352px]"
        >
          <span
            class="font-Onest font-semibold text-[18px] leading-[28px] text-[#101828]"
          >
            {{ detail ? "Update" : "New" }} Application
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start p-0 gap-[16px] w-full">
      <form @submit.prevent="onSubmit" class="grid w-full grid-cols-1 gap-y-6">
        <div>
          <Textinput
            placeholder="Enter application name"
            label="Application name"
            iconType="name"
            v-bind="nameAtt"
            v-model="name"
            :error="errors.name"
            :isCumpulsory="true"
          />
        </div>
        <div>
          <Textinput
            placeholder="Enter application url link"
            label="URL Link"
            iconType="url"
            v-bind="urlAtt"
            v-model="url"
            :error="errors.url"
            :isCumpulsory="true"
          />
        </div>
        <div>
          <FormGroup label="" :error="errors.logoUrl" name="logoUrl">
            <FileUpload
              label="Application logo"
              id="iconUrl"
              v-model="logoUrl"
              :isCumpulsory="true"
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup label="" :error="errors.iconUrl" name="iconUrl">
            <FileUpload
              label="Application Icon"
              id="iconUrl"
              v-model="iconUrl"
              :isCumpulsory="true"
            />
          </FormGroup>
        </div>
        <div class="flex gap-x-6">
          <FormGroup
            label="Two Factor Enabled"
            :error="errors.isTwoFactorAuthEnabled"
            :horizontal="true"
            name="iconUrl"
            ><input type="checkbox" v-model="isTwoFactorAuthEnabled" />
          </FormGroup>
          <FormGroup
            label="Set as Disabled"
            :error="errors.isDisabled"
            :horizontal="true"
            name="iconUrl"
            ><input type="checkbox" v-model="isDisabled" />
          </FormGroup>
        </div>

        <div class="flex gap-x-4 pt-4 p-0 w-full z-30">
          <AppButton
            btnClass="w-full text-[#344054] bg-white border-[#D0D5DD] border-[1px]"
            type="button"
            :is-disabled="isLoading"
            text="Cancel"
            @click="
              () => {
                isOpen = false;
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
    :title="`Application ${detail ? 'Updated' : 'Created'}`"
    :text="`Your application has been ${
      detail ? 'updated' : 'created'
    } successfully`"
    btnText="Close"
    :isCancel="false"
    @actionItem="
      () => {
        isOpen = isSuccessOpen = false;
      }
    "
    @close="isOpen = isSuccessOpen = false"
  />
</template>

<script setup>
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { addSubApp, editSubApp } from "~/services/userservices";

const props = defineProps(["detail", "id"]);
const formValues = {
  name: "",
  logoUrl: "",
  iconUrl: "",
  isTwoFactorAuthEnabled: true,
  isDisabled: false,
  url: "",
};

const schema = yup.object({
  name: yup.string().required("Application name is required"),
  logoUrl: yup.string().required("Logo is required"),
  iconUrl: yup.string().required("Icon is required"),
  isTwoFactorAuthEnabled: yup.boolean(),
  isDisabled: yup.boolean(),
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
const [logoUrl] = defineField("logoUrl");
const [isTwoFactorAuthEnabled] = defineField("isTwoFactorAuthEnabled");
const [isDisabled] = defineField("isDisabled");

const isSuccessOpen = ref(false);
const isLoading = ref(false);
const isOpen = inject("isOpen");

onMounted(() => {
  if (props.detail) {
    setValues(props.detail);
  }
});

const emits = defineEmits(["refresh"]);
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const response = await (props?.detail ? editSubApp : addSubApp)(values);

    if (response.status === 200) {
      isSuccessOpen.value = true;
      emits("refresh");
    }
  } catch (error) {
    console.log("🚀 ~ onSubmit ~ error:", error);
    toast.error(error.response?.data?.message || "An error occurred");
  } finally {
    isLoading.value = false;
  }
});

provide("handleChange", null)
</script>
