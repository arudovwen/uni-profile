<template>
  <div
    class="flex lg:col-span-2 flex-col justify-between items-start p-0 w-full flex-none order-3 self-stretch flex-grow-0 z-30"
  >
    <label
      v-if="label"
      :class="`flex items-center gap-x-1 input-label text-sm !text-[#1B2B41B8]`"
      :for="'hey'"
    >
      {{ label }}
      <span
        data-toggle="tooltip"
        data-placement="top"
        data-animation="false"
        class="cursor-pointer h-4 w-4 flex items-center justify-center"
      >
        <AppIcon icon="quill:info" iconClass="text-gray-600" />
      </span>
    </label>
    <div
      class="flex justify-start !flex-row items-center w-full h-[74px] border-[1px] border-[#e4e7ec] rounded-[12px] px-[24px] py-[16px] overflow-hidden"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @click="() => !value && triggerFileInput()"
    >
      <input
        type="file"
        class="hidden-input"
        ref="fileInput"
        @change="handleFileSelect"
      />
      <div
        class="flex flex-row justify-start w-[100%] items-center relative"
        v-if="value"
      >
        <div class="mr-4">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z"
              fill="#D92D20"
            />
            <path
              opacity="0.3"
              d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z"
              fill="white"
            />
            <path
              d="M11.7491 32V25.4545H14.3315C14.8279 25.4545 15.2508 25.5494 15.6003 25.739C15.9497 25.9265 16.216 26.1875 16.3993 26.522C16.5847 26.8544 16.6773 27.2379 16.6773 27.6726C16.6773 28.1072 16.5836 28.4908 16.3961 28.8232C16.2086 29.1555 15.9369 29.4144 15.5811 29.5998C15.2274 29.7852 14.7991 29.8778 14.2963 29.8778H12.6503V28.7688H14.0726C14.3389 28.7688 14.5584 28.723 14.731 28.6314C14.9057 28.5376 15.0356 28.4087 15.1209 28.2447C15.2082 28.0785 15.2519 27.8878 15.2519 27.6726C15.2519 27.4553 15.2082 27.2656 15.1209 27.1037C15.0356 26.9396 14.9057 26.8129 14.731 26.7234C14.5562 26.6317 14.3347 26.5859 14.0662 26.5859H13.1329V32H11.7491ZM19.8965 32H17.5762V25.4545H19.9157C20.5741 25.4545 21.1408 25.5856 21.616 25.8477C22.0911 26.1076 22.4565 26.4815 22.7122 26.9695C22.97 27.4574 23.0989 28.0412 23.0989 28.7209C23.0989 29.4027 22.97 29.9886 22.7122 30.4787C22.4565 30.9687 22.089 31.3448 21.6096 31.6069C21.1323 31.869 20.5613 32 19.8965 32ZM18.9601 30.8143H19.839C20.2481 30.8143 20.5922 30.7418 20.8713 30.5969C21.1526 30.4499 21.3635 30.223 21.5041 29.9162C21.6469 29.6072 21.7183 29.2088 21.7183 28.7209C21.7183 28.2372 21.6469 27.842 21.5041 27.5352C21.3635 27.2283 21.1536 27.0025 20.8745 26.8576C20.5954 26.7127 20.2513 26.6403 19.8422 26.6403H18.9601V30.8143ZM24.1241 32V25.4545H28.4579V26.5955H25.5079V28.1552H28.1702V29.2962H25.5079V32H24.1241Z"
              fill="white"
            />
          </svg>
        </div>
        <div class="flex flex-col w-full">
          <span
            class="text-[#344054] w-[70%] truncate font-[500] font-Onest text[14px]"
            >{{ value }}</span
          >
          <span class="text-[12px] text-[#475467] font-Onest font-[400]"
            >100% uploaded</span
          >
        </div>
        <svg
          @click="handleDelete"
          class="absolute right-0"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.3333 13.0001V12.3334C21.3333 11.4 21.3333 10.9333 21.1517 10.5768C20.9919 10.2632 20.7369 10.0082 20.4233 9.8484C20.0668 9.66675 19.6001 9.66675 18.6667 9.66675H17.3333C16.3999 9.66675 15.9332 9.66675 15.5767 9.8484C15.2631 10.0082 15.0081 10.2632 14.8483 10.5768C14.6667 10.9333 14.6667 11.4 14.6667 12.3334V13.0001M16.3333 17.5834V21.7501M19.6667 17.5834V21.7501M10.5 13.0001H25.5M23.8333 13.0001V22.3334C23.8333 23.7335 23.8333 24.4336 23.5608 24.9684C23.3212 25.4388 22.9387 25.8212 22.4683 26.0609C21.9335 26.3334 21.2335 26.3334 19.8333 26.3334H16.1667C14.7665 26.3334 14.0665 26.3334 13.5317 26.0609C13.0613 25.8212 12.6788 25.4388 12.4392 24.9684C12.1667 24.4336 12.1667 23.7335 12.1667 22.3334V13.0001"
            stroke="#475467"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="content" v-else>
        <div
          v-if="!isLoading"
          class="featured-icon flex justify-center items-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5M16.667 13.9524C17.6849 13.1117 18.3337 11.8399 18.3337 10.4167C18.3337 7.88536 16.2816 5.83333 13.7503 5.83333C13.5682 5.83333 13.3979 5.73833 13.3054 5.58145C12.2187 3.73736 10.2124 2.5 7.91699 2.5C4.46521 2.5 1.66699 5.29822 1.66699 8.75C1.66699 10.4718 2.3632 12.0309 3.48945 13.1613"
              stroke="#475467"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div v-else class="featured-icon flex justify-center items-center">
          <svg
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div>
          <div>
            <span class="button-text">Click to upload</span>
            <span class="separator-text"> or drag and drop</span>
          </div>
          <span class="supporting-text w-full"
            >PDF, SVG, PNG or JPG (max. 800x400px)</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { uploadfile } from "~/services/onboardingservice";

const props = defineProps({
  value: {
    default: null,
  },
  id: {
    default: null,
  },
  label: {
    default: null,
  },
});

const emit = defineEmits(["file-selected", "update:value"]);
const isLoading = ref(false);

const handleDelete = () => emit("file-selected", null, props.id);

const uploadSingle = (file) => {
  const allowedDocumentTypes = ref([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ]);
  // Check file size (in bytes)
  const maxSize = 800 * 1024; // 800 KB
  if (!allowedDocumentTypes.value.includes(file.type)) {
    toast.error("Invalid format");
    return;
  }
  if (file.size > maxSize) {
    toast.error("File size exceeds the limit (800 KB).");
    return;
  }
  isLoading.value = true;
  // Encode the file using the FileReader API
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    // Use a regex to remove data url part
    const base64String = reader.result;
    // .replace("data:", "")
    // .replace(/^.+,/, "");
    let data = {
      fileName: file.name,
      size: `${file.size / 1000}kb`,
      file: file,
      base64: base64String,
      fileSize: file.size,
      url: "",
    };
    const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (props.type == "image") {
      images.value.push(base64String);
    }
    if (props.type == "doc") {
      documents.value.push(data);
    }

    if (props.type == "image") {
      uploadfile({
        base64: base64String.replace("data:", "").replace(/^.+,/, ""),
      })
        .then((res) => {
          emit("file-selected", res.data.message, props.id);
          emit("update:value", file);
          isLoading.value = false;
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          }
          isLoading.value = false;
        });
    } else {
      uploadfile({
        base64: base64String.replace("data:", "").replace(/^.+,/, ""),
        ext: `.${ext}`,
      })
        .then((res) => {
          data.url = res.data.message;
          emit("file-selected", res.data.message, props.id);
          emit("update:value", file);
          isLoading.value = false;
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          }
          isLoading.value = false;
        });
    }
  };
};

const fileInput = ref(null);
const isDragging = ref(false);
const selectedFile = ref(props.value);

// Watch for external value changes
watch(
  () => props.value,
  (newValue) => {
    selectedFile.value = newValue;
  }
);

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
};

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
};

const handleFile = (file) => {
  selectedFile.value = file;
  uploadSingle(file);
};
</script>

<style scoped>
.file-upload-base {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 24px;
  gap: 4px;
  height: 74px;
  background: #ffffff;
  border: 1px solid #e4e7ec;
  border-radius: 12px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

.hidden-input {
  display: none;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;
  height: 42px;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.featured-icon {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #e4e7ec;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05),
    inset 0px 0px 0px 1px rgba(16, 24, 40, 0.18),
    inset 0px -2px 0px rgba(16, 24, 40, 0.05);
  border-radius: 8px;
  flex: none;
  order: 0;
  flex-grow: 0;
  position: relative;
}

.upload-cloud-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  left: 10px;
  top: 10px;
  border: 1.67px solid #475467;
}

.text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  height: 42px;
  flex: none;
  order: 1;
  flex-grow: 1;
}

.action {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  height: 20px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.upload-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 6px;
  width: 100px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.button-text {
  font-family: "Onest";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #021242;
}

.separator-text {
  font-family: "Onest";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #475467;
}

.supporting-text {
  height: 18px;
  font-family: "Onest";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #475467;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}
</style>
