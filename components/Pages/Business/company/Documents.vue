<!-- eslint-disable no-useless-escape -->
<template>
  <form @submit.prevent="handleSubmit" class="w-full">
    <div
      class="flex gap-x-[76px] justify-start flex-col lg:flex-row gap-y-7 w-full px-6 mb-6"
    >
      <div class="w-full">
        <PagesBusinessCompanyDocumentsUpload
          :documents="companyDoc"
          @get-docs="handleDocUpdate"
          :isNonNigerian="form?.country?.toLowerCase() !== 'nigeria'"
        />
      </div>
    </div>
    <div
      class="flex justify-end pt-6 border-t border-[#EAECF0] gap-x-4 items-center px-6 w-full"
      v-if="
        !companyInfo?.approvalStatus ||
        !companyDoc?.some((i) => i.documentType === 4)
      "
    >
      <AppButton
        @click="active--"
        :disabled="isLoading"
        btnClass="bg-transparent border border-[#E7EBEE] !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed !rounded-lg "
        type="button"
        text="Back"
      />

      <AppButton
        @click="handleSubmit"
        :disabled="isLoading"
        :isLoading="isLoading"
        btnClass="bg-primary-500 text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border !rounded-lg border-primary-500"
        type="submit"
        text="Next"
      />
    </div>
  </form>
</template>
<script setup>
import "vue-advanced-cropper/dist/style.css";
import { ref, reactive, onMounted, provide } from "vue";
import { nigeriaTypes, nonNigeriaTypes } from "~/utils/constants.js";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
// eslint-disable-next-line no-unused-vars
import {
  updateCompanyProfile,
  updateDocuments,
} from "~/services/settingservices";

const authStore = useAuthStore();
const companyInfo = inject("companyInfo");
const active = inject("active");
const form = inject("form");

const companyDoc = computed(() => {
  if (form?.country?.toLowerCase() !== "nigeria") {
    return companyInfo?.value?.companyDocuments.filter(
      (i) => i.documentType === 0 || i.documentType === 4
    );
  } else {
    return form?.companyDocuments;
  }
});
const isLoading = ref(false);

function handleDocUpdate(data) {
  form.companyDocuments = data;
}
async function handleSubmit() {
  if (
    form.country?.toLowerCase() === "nigeria" &&
    (form.companyDocuments.some(
      (i) => i.urls.filter((i) => i.url).length === 0
    ) ||
      form.companyDocuments.length !== 5)
  ) {
    toast.error("Please upload all available document types");
    return;
  }
  const nonNigerian = form.companyDocuments
    .filter((i) => [0, 4].includes(i.documentType))
    .some((i) => i.urls.filter((i) => i.url).length == 0);

  if (
    form.country?.toLowerCase() !== "nigeria" &&
    (nonNigerian || form.companyDocuments.length < 2)
  ) {
    toast.error("Please upload all available document types");
    return;
  }
  isLoading.value = true;
  const dataValue = {
    ...form,
    companyDocuments: form.companyDocuments.map((i) => ({
      ...i,
      urls: i.urls.map((j) => j.url),
    })),
  };
  updateCompanyProfile(dataValue)
    .then((res) => {
      if (res.status === 200) {
        toast.success("Documents saved");
        active.value = 3;
      }
    })

    .catch((err) => {
      isLoading.value = false;

      toast.error(err?.response?.data?.message || err?.response?.data?.Message);
    });
}

watch(companyDoc, () => {
  form.companyDocuments = companyDoc.value;
});
</script>
