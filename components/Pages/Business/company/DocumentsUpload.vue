<template>
  <div class="grid gap-y-[18px]">
    <div v-for="(doc, index) in privateDocuments" :key="index">
      <FormGroup
        :isCumpulsory="true"
        formClass="col-span-2 grid grid-cols-1 gap-y-4"
      >
        <div v-for="(file, idx) in doc?.urls" :key="idx" class="mb-4 last:mb-0">

          <div class="relative">
            <FileUpload
              :label="documentsOptions[doc.documentType]?.title"
              :id="documentsOptions[doc.documentType]?.short"
              :isCumpulsory="true"
              v-model="file.url"
            />
            <button
              v-if="doc?.urls.length > 1"
              type="button"
              class="text-red-500 text-xs font-medium right-0 top-2 absolute"
              @click="removeField(index, idx)"
            >
              Remove
            </button>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-3" v-if="file.url">
            <span @click="downloadFile(file.url, documentsOptions[doc.documentType]?.title)">
              <span class="block text-xs text-blue-500 mt-1"
                >Download {{ documentsOptions[doc.documentType]?.short }}
                {{ idx + 1 }}</span
              ></span
            >
          </div>
        </div>
        <div>
          <button
            @click="addField(index)"
            type="button"
            class="block text-primary-500 text-xs font-medium ml-auto"
          >
            + Add document
          </button>
        </div>
      </FormGroup>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/AppButton.vue";
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  provide,
} from "vue";
import FileUpload from "@/components/FileUpload.vue";

const privateDocuments = ref([]);
const props = defineProps(["documents", "hideUpdate", "isNonNigerian"]);
const emit = defineEmits(["getDocs"]);

onMounted(() => {
  privateDocuments.value = ensureDocumentTypes(props.documents);
});
function ensureDocumentTypes(arr) {
  if(!arr?.length) return KybDocumentDefault
  // Define the possible document types (0 to 4)
  const requiredNigerianDocumentTypes = [0, 1, 2, 3, 4];
  const requiredNonNigerianDocumentTypes = [0, 4];

  // Create a Set of existing document types in the array for quick lookup
  const existingDocumentTypes = new Set(arr?.map((item) => item.documentType));

  // Iterate through all required document types
  (props.isNonNigerian
    ? requiredNonNigerianDocumentTypes
    : requiredNigerianDocumentTypes
  ).forEach((type) => {
    if (!existingDocumentTypes.has(type)) {
      arr.push({
        url: "",
        urls: [
          {
            url: "",
          },
        ],
        documentType: type,
      });
    }
  });

  return arr;
}
function addField(id) {
  privateDocuments?.value[id].urls.push({
    url: "",
  });
}

function removeField(id, idx) {
  privateDocuments?.value[id].urls.splice(idx, 1);
}
watch(
  () => privateDocuments.value,
  (newValue) => {
    emit("getDocs", newValue);
  },
  { deep: true } // Enable deep watching
);

provide("handleChange", null);
</script>
