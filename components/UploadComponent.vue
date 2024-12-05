<template>
  <label
    :for="id"
    @drop.prevent="onDrop"
    class="border flex-1 border-[#DCDEE6] w-full rounded-[12px] flex flex-row items-center justify-start text-center relative group overflow-hidden min-h-[74px]"
  >
    <div
      :class="`relative flex flex-row items-center px-6 z-20 ${
        !isMultiple && (image || url)
          ? 'invisible group-hover:visible'
          : 'visible'
      }`"
    >
      <label
        :for="id"
        class="text-center cursor-pointer h-10 w-10 flex mx-auto items-center justify-center rounded-[10px] border border-primary mr-4"
      >
        <AppIcon
          icon="bytesize:upload"
          iconClass="text-xl text-[#475467] cursor-pointer"
        />
      </label>

      <p class="text-sm text-left">
        <span :for="id" class="!text-primary-500 font-medium cursor-pointer"
          >Click to upload</span
        >
        or Drag & Drop <br />
        <span class="!text-[12px] text-[#475467]"
          >SVG, PNG, JPG or GIF (max. 800x400px)</span
        >
      </p>
      <p class="text-xs text-[#ABABAB] mb-1" v-if="support">{{ support }}</p>
      <p class="text-xs text-[#ABABAB]" v-if="recommended">{{ recommended }}</p>
    </div>
    <img
      alt="upload"
      v-if="!isMultiple && (image || url)"
      :src="image || url"
      class="w-full h-full object-cover absolute z-10 group-hover:opacity-10 backdrop-blur-sm"
    />
  </label>
  <input
    data-testid="upload"
    type="file"
    :id="id"
    class="hidden"
    :accept="accepts"
    @change="handleFile"
    :multiple="isMultiple"
  />
  <div
    class="bg-white flex flex-wrap gap-2 max-h-full overflow-y-auto rounded-lg"
    v-if="type === 'image' && isMultiple && gallery.length"
  >
    <span v-for="(n, i) in gallery" :key="i">
      <span
        class="h-24 w-24 rounded-lg bg-white flex items-center justify-center border relative border-[#E7EBEE]"
      >
        <img :src="n" alt="logo" class="w-full h-full rounded-lg" />
        <span
          class="bg-white text-matta-black h-5 w-5 flex items-center justify-center absolute -top-1 -right-2"
          @click="removeFile(i)"
        >
          <i class="uil uil-times"></i> </span
      ></span>
    </span>
  </div>
  <span
    ><i
      v-if="isLoading"
      class="fa fa-spinner fa-spin text-6xl text-matta-black"
      aria-hidden="true"
    ></i
  ></span>
</template>
<script setup>
import { toast } from "vue3-toastify";
import { ref, onMounted, defineProps, defineEmits, computed } from "vue";
import { uploadfile, uploaddocument } from "@/services/onboardingservice.js";
// import axios from "axios";
const images = ref([]);
const image = ref("");
const documents = ref([]);
const emits = defineEmits(["onGetFiles", "removeFile"]);
const props = defineProps({
  isMultiple: { default: true },
  type: { default: "image" },
  gallery: { default: [] },
  support: {
    default: "",
  },
  recommended: {
    default: "",
  },
  id: {
    default: "file",
  },
  url: {
    default: "",
  },
});
const events = ["dragenter", "dragover", "dragleave", "drop"];
onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});
function preventDefaults(e) {
  e.preventDefault();
}
const isLoading = ref(false);
function handleFile(e) {
  const files = [...e.target.files];
  console.log(files);
  
  files.forEach((file) => {
    // Check file size (in bytes)
    const maxSize = 800 * 1024; // 800 KB
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
      };
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (props.type == "image") {
        images.value.push(base64String);
      }
      if (props.type == "doc") {
        documents.value.push(data);
      }
       
      if (props.type == "image") {
        console.log("image");
        uploadfile({
          base64: base64String.replace("data:", "").replace(/^.+,/, ""),
        }).then((res) => {
          emits("onGetFiles", res.data.message);
          image.value = res.data.message;
          isLoading.value = false;
        });
      } else {
        console.log("here");
        uploaddocument({
          base64: base64String.replace("data:", "").replace(/^.+,/, ""),
          ext: `.${ext}`,
        }).then((res) => {
          data.url = res.data.message;
          emits("onGetFiles", data);
          isLoading.value = false;
        });
      }
      // uploadfile({
      //   base64: base64String.replace("data:", "").replace(/^.+,/, ""),
      // }).then((res) => {
      //   emits("onGetFiles", props.type == "image" ? res.data.message : data);
      // });
    };
  });
}

function onDrop(e) {
  const files = [...e.dataTransfer.files];
  files.forEach((img) => {
    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = () => {
      // Use a regex to remove data url part
      const base64String = reader.result;
      // .replace("data:", "")
      // .replace(/^.+,/, "");

      images.value.push(base64String);
    };
  });
  emits("onGetFiles", images.value);
}

function removeFile(id) {
  images.value.splice(id, 1);
  emits("removeFile", id);
}
const accepts = computed(() => {
  let val;
  switch (props.type) {
    case "image":
      val = ".png, .jpg, .jpeg";
      break;
    case "doc":
      val = ".pdf";
      break;
  }
  return val;
});
</script>
