<template>
  <div class="relative">
    <editor
      :api-key="apikey"
      :placeholder="placeholder"
      :init="{
        height: 400,
        width: 700,
        selector: id,
        plugins: 'fullscreen image link  table advlist lists quickbars',
        menubar: 'edit view insert format tools table',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | pagebreak | image link',
        toolbar_sticky: true,
        images_upload_url: `${url}v1/fileservice/uploadsinglephoto`,
        images_upload_handler: handleFile,
      }"
      v-model="value"
      @keyup="emit('update:modelValue', value)"
      ref="input"
      class="rounded-lg px-[14px] py-[10px] w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
    />
  </div>
</template>

<script setup>
import Editor from "@tinymce/tinymce-vue";
import { defineProps, defineEmits, ref, watch } from "vue";
const apikey = process.env.VUE_APP_TINYMCE_KEY;
const url = process.env.VUE_APP_URL;
const value = ref("");
const prop = defineProps({
  modelValue: {
    default: "",
  },
  showAttachment: {
    default: false,
  },
  placeholder: {
    default: "Enter text here",
  },
  id: {},
});
const handleFile = (blobInfo, progress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open(
      "POST",
      `${process.env.VUE_APP_URL}v1/fileservice/uploadsinglephoto`
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.upload.onprogress = (e) => {
      progress((e.loaded / e.total) * 100);
    };

    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: "HTTP Error: " + xhr.status, remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject("HTTP Error: " + xhr.status);
        return;
      }

      const json = JSON.parse(xhr.responseText);

      if (!json || typeof json.message != "string") {
        reject("Invalid JSON: " + xhr.responseText);
        return;
      }

      resolve(json.message);
    };

    xhr.onerror = () => {
      reject(
        "Image upload failed due to a XHR Transport error. Code: " + xhr.status
      );
    };

    const formData = new FormData();
    formData.append("base64", blobInfo.base64());
    let body = JSON.stringify({
      base64: blobInfo.base64(),
    });
    xhr.send(body);
  });
const emit = defineEmits(["update:modelValue"]);
watch(prop, (oldvalue, newvalue) => {
  value.value = newvalue.modelValue;
});
</script>
