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
        helper-text="Upload your business registration certificate (PDF, JPG, PNG)"
        @change="handleDocumentChange"
      />

      <!-- Tax Certificate -->
      <DashboardDocumentUpload
        v-model="taxFile"
        label="Tax Certificate"
        :is-required="true"
        helper-text="Upload your business tax certificate (PDF, JPG, PNG)"
        @change="handleDocumentChange"
      />

      <!-- Business License -->
      <DashboardDocumentUpload
        v-model="licenseFile"
        label="Business License"
        helper-text="Upload your business license (optional)"
        @change="handleDocumentChange"
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
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import { updateDocuments } from "~/services/settingservices";

interface FileData {
  filename?: string;
  name?: string;
  filePath?: string;
  url?: string;
  fileType?: string;
  size?: number;
  fileSize?: number;
}

const incorporationFile = ref<FileData[]>([]);
const taxFile = ref<FileData[]>([]);
const licenseFile = ref<FileData[]>([]);
const isLoading = ref(false);

// Form is valid if required documents are uploaded
const isFormValid = computed(() => {
  return incorporationFile.value.length > 0 && taxFile.value.length > 0;
});

const handleDocumentChange = () => {
  // Handle document changes if needed
  // This can be used for auto-saving or validation
};

const onSubmit = async () => {
  if (!isFormValid.value) {
    toast.error("Please upload all required documents");
    return;
  }

  isLoading.value = true;

  try {
    // Prepare document payload with URLs only
    const companyDocuments = [
      {
        documentType: "incorporation",
        urls: incorporationFile.value.map((file) => file.url || file.filePath || ""),
      },
      {
        documentType: "tax",
        urls: taxFile.value.map((file) => file.url || file.filePath || ""),
      },
      ...(licenseFile.value.length > 0
        ? [
            {
              documentType: "license",
              urls: licenseFile.value.map((file) => file.url || file.filePath || ""),
            },
          ]
        : []),
    ];

    // Submit documents to API
    const response = await updateDocuments({
      companyDocuments,
    });

    if (response?.status === 200) {
      toast.success("Documents submitted successfully");
      // Reset form
      incorporationFile.value = [];
      taxFile.value = [];
      licenseFile.value = [];
    }
    isLoading.value = false;
  } catch (error) {
    console.error("Error submitting documents:", error);
    toast.error(
      (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.Message ||
        "Failed to submit documents. Please try again."
    );
    isLoading.value = false;
  }
};
</script>
