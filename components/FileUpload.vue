
<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm mb-[10px] text-[#475467]"
      >{{ label }} <RedDot v-if="isCumpulsory"
    /></label>
    <div
      class="flex-1 rounded-lg py-1 pr-[14px] pl-2 h-12 text-sm w-full border border-[##EAECF0] placeholder:text-[#B6B7B9] bg-[#F9FAFB] focus:outline-matta-black/20 flex items-center"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        @change="
          (e) => {
            multiple ? handleMultiple(e) : handleEvent(e);
          }
        "
        :accept="accept"
        :multiple="multiple"
      />

      <button
        type="button"
        @click="triggerFileInput"
        class="text-xs text-white border border-[#1570Ef] !bg-[#1570EF] rounded px-5 py-[10px] active:scale-[.95] leading-normal flex justify-center"
      >
        <div
          v-if="loading"
          class="loader border-t-2 border-white border-solid rounded-full h-3 w-3 animate-spin whitespace-nowrap"
        ></div>
        <span v-else class="flex flex-row justify-between">
          <Icon icon="lucide:upload" class="mr-2" />
          <span>{{ btnText || "Select file" }}</span>
        </span>
      </button>

      <span
        :class="lClass"
        class="flex-1 px-4 truncate text-[#999999] inline-bloc"
        >{{ multiple ? multiUrls.join() : title }}</span
      >

      <span v-if="modelValue">
        <img class="h-5" :src="modelValue" />
      </span>
    </div>
  </div>
</template>

<script setup>
import RedDot from "@/components/RedDot.vue";
import { Icon } from "@iconify/vue";
import { defineProps, ref, inject, watch, onMounted, defineEmits } from "vue";
import { toast } from "vue3-toastify";
import { uploaddocument } from "~/services/onboardingservice";

const props = defineProps({
  label: {
    default: "",
  },
  id: {
    default: "",
  },
  btnText: {
    default: "",
  },
  modelValue: {
    default: "",
  },
  multiple: {
    default: false,
  },
  accept: {
    default: "pdf,jpeg,jpg,png",
  },
  isCumpulsory: {
    default: false,
  },
  lClass: {
    default: " max-w-[300px] xl:max-w-[380px]",
  },
});
const emits = defineEmits(["update:modelValue"]);
const handleChange = inject("handleChange");
const fileInputRef = ref(null);
const title = ref("");
const loading = ref(false);
const multiUrls = ref([]);
function handleEvent(e) {
  const file = e.target.files[0];

  if (!file) return;

  // Add more allowed extensions if needed
  const fileExtension = file.name.split(".").pop().toLowerCase();

  if (!props.accept.split(",").includes(fileExtension)) {
    // Show an error message or handle accordingly
    toast.error("Invalid file type. Please upload a document.");
    return;
  }
  title.value = file.name;
  const reader = new FileReader();

  reader.onload = function (event) {
    const base64String = event.target.result.split(",")[1];
    loading.value = true;
    const data = { base64: base64String, ext: `.${fileExtension}` };
    // Assuming canvas and uploaddocument are available

    uploaddocument(data)
      .then((res) => {
        loading.value = false;
        handleChange && handleChange(props.id, res.data.message);
        emits("update:modelValue", res.data.message);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        loading.value = false;
      });
  };

  reader.onerror = function (error) {
    console.error("Error reading file:", error);
  };

  reader.readAsDataURL(file);
}
function handleMultiple(e) {
  const files = Object.values(e.target.files);

  if (!files.length) return;
  const promises = [];
  files.forEach((file) => {
    multiUrls.value = [];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!props.accept.split(",").includes(fileExtension)) {
      // Show an error message or handle accordingly
      toast.error("Invalid file type. Please upload a document.");
      return;
    }

    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = function (event) {
        const base64String = event.target.result.split(",")[1];
        loading.value = true;
        const data = { base64: base64String, ext: `.${fileExtension}` };

        // Assuming uploaddocument is available
        uploaddocument(data)
          .then((res) => {
            multiUrls.value = [...multiUrls.value, res.data.message];
            resolve(); // Resolve the promise after successful upload
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            reject(error); // Reject the promise if there's an error
          })
          .finally(() => {
            loading.value = false; // Ensure loading indicator is turned off after upload, regardless of success or failure
          });
      };

      reader.onerror = function (error) {
        console.error("Error reading file:", error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });

    promises.push(promise);
  });

  // Wait for all promises to resolve before calling handleChange
  Promise.all(promises)
    .then(() => {
      // All files have been successfully uploaded
      handleChange && handleChange(props.id, multiUrls.value);
      emits("update:modelValue", multiUrls.value);
    })
    .catch((error) => {
      // An error occurred during file upload
      console.error("Error handling multiple files:", error);
    });
}

function triggerFileInput() {
  fileInputRef.value.click();
}
onMounted(() => {
  title.value = props.modelValue;
});
watch(
  () => [props.modelValue],
  () => {
    title.value = props.modelValue;
  }
);
</script>
