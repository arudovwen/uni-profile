<template>
  <div class="bg-white rounded-lg border border-[#E4E7EC] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] py-6 sm:py-8 px-4 sm:px-6 lg:px-[51px] max-w-[723px]">
    <div class="mb-6">
      <h2 class="text-sm sm:text-base font-[800] text-[#344054] leading-6">
        Business Documents
      </h2>
      <p class="text-xs sm:text-sm font-medium text-[#475467] leading-5 mt-0.5">
        Provide the required business incorporation documents
      </p>
    </div>

    <!-- Documents Upload Form -->
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Certificate of Incorporation -->
      <DashboardDocumentUpload
        v-model="incorporationFile"
        label="Certificate of Incorporation"
        :is-required="true"
        accepted-types="pdf,jpg,jpeg,png"
        helper-text="Upload your business registration certificate (PDF, JPG, PNG)"
      />

      <!-- Tax Certificate -->
      <DashboardDocumentUpload
        v-model="taxFile"
        label="Tax Certificate"
        :is-required="true"
        accepted-types="pdf,jpg,jpeg,png"
        helper-text="Upload your business tax certificate (PDF, JPG, PNG)"
      />

      <!-- Business License -->
      <DashboardDocumentUpload
        v-model="licenseFile"
        label="Business License"
        accepted-types="pdf,jpg,jpeg,png"
        helper-text="Upload your business license (optional)"
      />

      <!-- Form Actions -->
      <div class="flex gap-x-4 items-center justify-end border-t border-[#E9EAEB] pt-6">
        <AppButton
          :disabled="isLoading || !isFormValid"
          :isLoading="isLoading"
          btnClass="bg-primary-500 text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border !rounded-lg border-primary-500"
          type="submit"
          text="Submit Documents"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { updateCompanyProfile, getBusinessProfile } from "~/services/settingservices";

interface FileData {
  filename?: string;
  name?: string;
  filePath?: string;
  url?: string;
  fileType?: string;
  size?: number;
  fileSize?: number;
  status?: "pending" | "approved" | "rejected";
}

interface CompanyDocument {
  url: string;
  urls: string[];
  documentType: number;
}

// Document type mapping
const DOCUMENT_TYPES = {
  INCORPORATION: 0,
  TAX: 1,
  LICENSE: 2,
};

const incorporationFile = ref<FileData | null>(null);
const taxFile = ref<FileData | null>(null);
const licenseFile = ref<FileData | null>(null);
const isLoading = ref(false);
const businessProfileData = ref<any>(null);

// Form is valid if required documents are uploaded
const isFormValid = computed(() => {
  return incorporationFile.value !== null && taxFile.value !== null;
});

// Load existing documents on mount
onMounted(() => {
  getBusinessProfile()
    .then((res) => {
      if (res?.status === 200 && res.data?.data) {
        businessProfileData.value = res.data.data;
        const companyDocuments = res.data.data.companyDocuments as CompanyDocument[];

        // Map documents to form fields based on documentType
        // Only populate if documents exist with valid URLs
        companyDocuments?.forEach((doc) => {
          const fileUrl = doc.urls?.[0] || doc.url;
          if (!fileUrl) return;

          const fileData: FileData = {
            filename: fileUrl.split("/").pop() || "",
            name: fileUrl.split("/").pop() || "",
            filePath: fileUrl,
            url: fileUrl,
            fileType: fileUrl.split(".").pop() || "",
          };

          switch (doc.documentType) {
            case DOCUMENT_TYPES.INCORPORATION:
              if (fileUrl) incorporationFile.value = fileData;
              break;
            case DOCUMENT_TYPES.TAX:
              if (fileUrl) taxFile.value = fileData;
              break;
            case DOCUMENT_TYPES.LICENSE:
              if (fileUrl) licenseFile.value = fileData;
              break;
          }
        });
      }
    })
    .catch((err) => {
      console.error("Error loading business profile:", err);
      // Don't trigger validation errors on load failure
    });
});

const onSubmit = () => {
  if (!isFormValid.value) {
    toast.error("Please upload all required documents");
    return;
  }

  isLoading.value = true;

  // Prepare updated company documents
  const updatedCompanyDocuments: CompanyDocument[] = [
    {
      url: "",
      urls: [incorporationFile.value?.url || incorporationFile.value?.filePath || ""],
      documentType: DOCUMENT_TYPES.INCORPORATION,
    },
    {
      url: "",
      urls: [taxFile.value?.url || taxFile.value?.filePath || ""],
      documentType: DOCUMENT_TYPES.TAX,
    },
    ...(licenseFile.value
      ? [
          {
            url: "",
            urls: [licenseFile.value?.url || licenseFile.value?.filePath || ""],
            documentType: DOCUMENT_TYPES.LICENSE,
          },
        ]
      : []),
  ];

  // Send entire profile with updated documents
  updateCompanyProfile({
    ...businessProfileData.value,
    companyDocuments: updatedCompanyDocuments,
  })
    .then((res) => {
      if (res?.status === 200) {
        toast.success("Documents submitted successfully");
      }
      isLoading.value = false;
    })
    .catch((err) => {
      isLoading.value = false;
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Failed to submit documents. Please try again."
      );
    });
};
</script>
