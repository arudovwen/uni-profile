<template>
  <div class="flex flex-col w-full" :class="containerStyle">
    <!-- Label -->
    <div v-if="label" class="flex items-start mb-2">
      <span class="text-base text-[#344054] font-medium leading-5">
        {{ label }}
      </span>
      <span v-if="isRequired" class="text-[#F97066] ml-1">*</span>
    </div>

    <!-- Upload Area -->
    <div
      class="w-full border-2 border-dashed border-[#D0D5DD] cursor-pointer flex flex-col items-center justify-center text-center rounded-lg py-8 px-4 mb-4 transition-colors hover:border-[#1570EF] hover:bg-[#F0F9FF]"
      :class="{ 'opacity-50 cursor-not-allowed': disabled || isUploading }"
      @click="handleUploadClick"
      @dragover.prevent
      @drop.prevent="handleFileDrop"
    >
      <div v-if="isUploading" class="flex flex-col items-center gap-2">
        <div class="animate-spin">
          <svg class="w-8 h-8 text-[#1570EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 0110 10v1H2v-1a10 10 0 0110-10z" />
          </svg>
        </div>
        <span class="text-sm text-[#475467]">Uploading files...</span>
      </div>

      <div v-else class="flex flex-col items-center gap-3">
        <svg class="w-10 h-10 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7" />
        </svg>
        <div>
          <p class="text-sm text-[#344054]">
            <span class="text-[#1570EF] font-medium">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-[#667085]">PDF, JPG, PNG (Max 5MB)</p>
        </div>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="acceptedTypes"
        :multiple="multiple"
        :disabled="disabled || isUploading"
        @change="handleFileChange"
      />
    </div>

    <!-- Uploaded Files List -->
    <div v-if="uploadedFiles && uploadedFiles.length > 0" class="space-y-2 mb-4">
      <div
        v-for="(file, idx) in uploadedFiles"
        :key="idx"
        class="flex items-center justify-between gap-3 p-3 bg-[#F0F9FF] border border-[#E0F2FE] rounded-lg"
      >
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <svg class="w-5 h-5 flex-shrink-0 text-[#1570EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-[#344054] truncate">
              {{ file.filename || file.name }}
            </p>
            <p class="text-xs text-[#667085]">{{ formatFileSize(file.fileSize || file.size) }}</p>
          </div>
        </div>
        <button
          type="button"
          @click="removeFile(idx)"
          class="flex-shrink-0 text-[#667085] hover:text-[#F04438] transition-colors"
          title="Remove file"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="error || uploadError" class="text-sm text-[#F04438] font-medium">
      {{ error || uploadError }}
    </div>

    <!-- Empty State Message -->
    <div v-if="uploadedFiles.length === 0 && helperText" class="text-xs text-[#667085] mt-2">
      {{ helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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
}

interface Props {
  label?: string;
  acceptedTypes?: string;
  modelValue?: FileData[];
  value?: FileData[];
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  containerStyle?: string;
  isRequired?: boolean;
  helperText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  acceptedTypes: "pdf,jpg,jpeg,png",
  modelValue: () => [],
  value: () => [],
  error: "",
  disabled: false,
  multiple: true,
  containerStyle: "",
  isRequired: false,
  helperText: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: FileData[]): void;
  (e: "change", value: FileData[]): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadError = ref("");
const uploadedFiles = ref<FileData[]>((props.modelValue || props.value || []));

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const handleUploadClick = () => {
  if (props.disabled || isUploading.value) return;
  fileInputRef.value?.click();
};

const formatFileSize = (bytes: number = 0): string => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (Math.round((bytes / Math.pow(k, i)) * 100) / 100) + " " + sizes[i];
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  const allowedFiles = selectedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
  const rejectedFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE);

  if (rejectedFiles.length > 0) {
    toast.error("Some files exceed the 5MB limit and were skipped");
  }

  if (allowedFiles.length > 0) {
    processFiles(allowedFiles);
  }

  // Reset input
  target.value = "";
};

const handleFileDrop = (e: DragEvent) => {
  if (props.disabled || isUploading.value) return;

  const files = Array.from(e.dataTransfer?.files || []);
  const allowedFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);
  const rejectedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

  if (rejectedFiles.length > 0) {
    toast.error("Some files exceed the 5MB limit and were skipped");
  }

  if (allowedFiles.length > 0) {
    processFiles(allowedFiles);
  }
};

const processFiles = async (files: File[]) => {
  if (files.length === 0) return;

  isUploading.value = true;
  uploadError.value = "";

  try {
    const uploadPromises = files.map(
      (file) =>
        new Promise<FileData | null>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const result = reader.result as string;
              const base64 = result.split(",")[1];
              const extension = file.name.split(".").pop() || "";

              const response = await uploaddocument({
                base64,
                ext: `.${extension}`,
              });

              if (response?.data?.data || response?.data?.message) {
                const fileData: FileData = {
                  filename: file.name,
                  name: file.name,
                  filePath: response.data.data || response.data.message,
                  url: response.data.data || response.data.message,
                  fileType: extension,
                  fileSize: file.size,
                };
                resolve(fileData);
              } else {
                resolve(null);
              }
            } catch (err) {
              console.error("Error uploading file:", err);
              resolve(null);
            }
          };
          reader.readAsDataURL(file);
        })
    );

    const results = await Promise.all(uploadPromises);
    const validFiles = results.filter((f): f is FileData => !!f);

    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles.value, ...validFiles];
      uploadedFiles.value = newFiles;
      emit("update:modelValue", newFiles);
      emit("change", newFiles);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }

    if (results.some((f) => !f) && validFiles.length === 0) {
      uploadError.value = "Failed to upload files. Please try again.";
      toast.error("File upload failed. Please try again.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    uploadError.value = "File upload failed. Please try again.";
    toast.error("File upload failed. Please try again.");
  } finally {
    isUploading.value = false;
  }
};

const removeFile = (idx: number) => {
  uploadedFiles.value.splice(idx, 1);
  emit("update:modelValue", uploadedFiles.value);
  emit("change", uploadedFiles.value);
};

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      uploadedFiles.value = newValue;
    }
  }
);
</script>
