<template>
  <DialogModal :is-open="open" @toggle-popup="emits('close')">
    <template #content>
      <div
        class="h-[80vh] p-6 bg-white rounded-lg relative flex flex-col gap-y-2"
      >
        <div class="flex-1 w-full overflow-auto h-full">
          <div
            v-if="loading && media.includes('.pdf')"
            class="h-full w-full flex items-center justify-center"
          >
            <AppIcon icon="fa:spinner" iconClass="fa-spin text-[80px]" />
          </div>
          <VuePdfEmbed
            v-if="media.includes('.pdf')"
            annotation-layer
            text-layer
            :source="media"
            @rendered="loading = false"
            :page="1"
          />
          <img
            alt="media"
            :src="media"
            class="w-full h-full object-contain"
            v-else
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="downloadFile(media)"
            type="button"
            class="bg-primary-500 rounded-lg text-white text-sm px-[14px] py-[10px]"
          >
            Download file
          </button>
        </div>
      </div>
    </template>
  </DialogModal>
</template>

<script setup>
import VuePdfEmbed from "vue-pdf-embed";
import DialogModal from "./DialogModal.vue";
const numOfPages = ref(1);
// const VuePdf = pdf.VuePdf
const loading = ref(true);
// onMounted(() => {
//   if (props.media.includes(".pdf")) {
//     const loadingTask = pdf.createLoadingTask(props.media);
//     loadingTask.promise.then((pdff) => {
//       loading.value = false;
//       numOfPages.value = pdff.numPages;
//     });
//   }
// });
const props = defineProps(["media", "open"]);
const emits = defineEmits(["close"]);
</script>
