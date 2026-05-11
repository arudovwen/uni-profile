<template>
  <div class="flex flex-col w-full" :class="containerStyle">
    <!-- Label -->
    <div v-if="label" class="flex items-start">
      <span class="mb-2 text-base text-[#344054] font-medium leading-[1.25rem]">
        {{ label }}
      </span>
      <span v-if="isRequired" class="text-[#F97066] ml-1">*</span>
    </div>

    <!-- Upload Area -->
    <div
      v-if="!hideUploadField"
      class="w-full border border-dashed border-[#003B7733] cursor-pointer flex flex-col items-center justify-center text-center rounded-lg py-[19px] mb-2"
      :class="{ 'opacity-50 cursor-not-allowed': disabled || uploadProgress.isUploading }"
      @click="handleUploadContainerClick"
      @dragover.prevent
      @drop.prevent="handleFileDrop"
    >
      <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-1">
        <div v-if="uploadProgress.isUploading" class="flex items-center gap-2">
          <svg class="w-6 h-6 text-[#344054] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 0110 10v1H2v-1a10 10 0 0110-10z" />
          </svg>
        </div>
        <div v-else>
          <svg class="w-6 h-6 text-[#7D8299] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7" />
          </svg>
        </div>
        <span v-if="!uploadProgress.isUploading" class="font-normal flex-1 text-[#7D8299] text-sm">
          Drag and drop document here for upload.<br />
          Supported documents are {{ acceptedTypes.split(",").map((t) => t.trim()).join(", ") }}
        </span>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="acceptedTypes"
        :disabled="disabled || uploadProgress.isUploading"
        @change="handleFileChange"
      />
    </div>

    <!-- File Display with Status -->
    <div v-if="modelValue" class="flex flex-col sm:flex-row sm:items-center gap-2">
      <div class="w-max flex items-center gap-2 px-4 py-2.5 rounded-[2.5rem] bg-[#27AE601A]">
        <p class="text-[#27AE60] text-sm font-medium">
          {{ extractFilename(modelValue.filename || modelValue.name) }}
        </p>
        <button
          v-if="!disabled"
          type="button"
          class="cursor-pointer hover:opacity-80 transition-opacity"
          @click="removeFile"
        >
          <svg class="w-4 h-4 text-[#27AE60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Status Display -->
      <div v-if="modelValue.status" class="mt-2.5 sm:mt-0">
        <div
          v-if="modelValue.status === 'pending'"
          class="px-3 py-1.5 rounded-full text-sm font-medium"
          style="background-color: #FFFAEB; color: #B54708; border: 1px solid #FEDF89"
        >
          Verification Pending
        </div>
        <div
          v-else-if="modelValue.status === 'approved'"
          class="px-3 py-1.5 rounded-full text-sm font-medium"
          style="background-color: #ECFDF3; color: #067647; border: 1px solid #ABEFC6"
        >
          Approved
        </div>
        <div
          v-else-if="modelValue.status === 'rejected'"
          class="flex items-center gap-2"
        >
          <div
            class="px-3 py-1.5 rounded-full text-sm font-medium"
            style="background-color: #FEF3F2; color: #B42318; border: 1px solid #FECDCA"
          >
            Rejected
          </div>
          <p class="text-[#182230] text-base font-medium underline cursor-pointer">
            View Reason
          </p>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="uploadProgress.isUploading && uploadProgress.percentage > 0" class="mt-2">
      <div class="w-full bg-[#E9EAEB] rounded-full h-2">
        <div
          class="bg-[#1570EF] h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress.percentage + '%' }"
        ></div>
      </div>
      <p class="text-xs text-[#667085] mt-1">{{ uploadProgress.percentage }}%</p>
    </div>

    <!-- Error Messages -->
    <div v-if="error" class="mt-2 text-sm text-[#F04438] font-normal">
      {{ error }}
    </div>

    <div v-if="uploadErrorMessage" class="mt-2 text-base text-[#F04438] font-normal">
      {{ uploadErrorMessage }}
    </div>

    <!-- Helper Text -->
    <div v-if="helperText && !modelValue" class="text-xs text-[#667085] mt-2">
      {{ helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import { uploaddocument } from "~/services/onboardingservice";

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

interface Props {
  label?: string;
  acceptedTypes?: string;
  modelValue?: FileData | null;
  error?: string;
  disabled?: boolean;
  containerStyle?: string;
  isRequired?: boolean;
  helperText?: string;
  hideUploadField?: boolean;
}

interface UploadProgress {
  percentage: number;
  currentSize: number;
  isUploading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  acceptedTypes: "pdf,jpg,jpeg,png",
  modelValue: null,
  error: "",
  disabled: false,
  containerStyle: "",
  isRequired: false,
  helperText: "",
  hideUploadField: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: FileData | null): void;
  (e: "change", value: FileData | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadProgress = ref<UploadProgress>({
  percentage: 0,
  currentSize: 0,
  isUploading: false,
});
const uploadErrorMessage = ref("");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const handleUploadContainerClick = () => {
  if (props.disabled || uploadProgress.value.isUploading) return;
  fileInputRef.value?.click();
};

const extractFilename = (filename: string): string => {
  if (!filename) return "";
  // Remove timestamp prefix if exists
  const parts = filename.split("-");
  return parts.length > 1 ? parts.slice(1).join("-") : filename;
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFile = target.files?.[0];

  if (!selectedFile) return;

  uploadProgress.value.isUploading = true;
  uploadErrorMessage.value = "";

  if (selectedFile.size > MAX_FILE_SIZE) {
    uploadProgress.value.isUploading = false;
    toast.error("File size exceeds 5MB limit");
    uploadErrorMessage.value = "File size exceeds 5MB limit";
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const result = reader.result as string;
    const base64 = result.split(",")[1];
    const extension = selectedFile.name.split(".").pop() || "";

    const payload = {
      base64,
      extension,
      file: selectedFile,
    };
    await handleFileUpload(payload);
  };

  reader.readAsDataURL(selectedFile);
};

const handleFileDrop = (e: DragEvent) => {
  if (props.disabled || uploadProgress.value.isUploading) return;

  const file = e.dataTransfer?.files[0];
  if (!file) return;

  uploadProgress.value.isUploading = true;
  uploadErrorMessage.value = "";

  if (file.size > MAX_FILE_SIZE) {
    uploadProgress.value.isUploading = false;
    toast.error("File size exceeds 5MB limit");
    uploadErrorMessage.value = "File size exceeds 5MB limit";
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const result = reader.result as string;
    const base64 = result.split(",")[1];
    const extension = file.name.split(".").pop() || "";

    const payload = {
      base64,
      extension,
      file,
    };
    await handleFileUpload(payload);
  };

  reader.readAsDataURL(file);
};

const handleFileUpload = async (data: {
  base64: string;
  extension: string;
  file: File;
}) => {
  uploadProgress.value.isUploading = true;
  uploadProgress.value.percentage = 0;

  try {
    const response = await uploaddocument({
      base64: data.base64,
      ext: `.${data.extension}`,
    });

    const fileData: FileData = {
      filename: `${Date.now()}-${data.file.name}`,
      name: data.file.name,
      filePath: response?.data?.data || response?.data?.message,
      url: response?.data?.data || response?.data?.message,
      fileType: data.extension,
      fileSize: data.file.size,
    };

    emit("update:modelValue", fileData);
    emit("change", fileData);
    toast.success("File uploaded successfully");

    uploadProgress.value.isUploading = false;
    uploadProgress.value.percentage = 0;
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("File upload failed. Please try again");
    uploadErrorMessage.value = "File upload failed. Please try again";
    uploadProgress.value.isUploading = false;
    uploadProgress.value.percentage = 0;
  }
};

const removeFile = () => {
  if (props.disabled) return;
  emit("update:modelValue", null);
  emit("change", null);
  uploadErrorMessage.value = "";
};
</script>
