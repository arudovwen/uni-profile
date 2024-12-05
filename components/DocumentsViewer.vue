<template>
  <div
    v-if="documents.length"
    class="w-full rounded-[10px] border border-[#EAECF0] overflow-x-auto md:min-w-[560px]"
  >
    <table aria-describedby="true" class="w-full">
      <thead>
        <tr>
          <th
            class="capitalize text-[#475467] text-sm text-left font-semibold border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            Documents
          </th>

          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          ></th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr
          v-for="(document, id) in documents.filter((i) => i.urls)"
          :key="id"
          class="border-b last:border-none"
        >
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap max-w-[260px] truncate"
          >
            {{ docName(document.documentType, type) }}
          </td>

          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap flex gap-x-4 items-center"
          >
            <span
              v-for="(file, i) in document.urls"
              :key="file.url"
              @click="openMedia(file.url)"
              class="flex gap-x-3 items-center justify-end text-primary-500 cursor-pointer"
            >
              View document {{ i + 1 }}
            </span>
          </td>
        </tr>
      </tbody> -->
        <tr
          v-for="(document, id) in flattenedObjects"
          :key="id"
          class="border-b last:border-none"
        >
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap max-w-[260px] truncate"
          >
            <span class="flex gap-x-3 items-center">
           
              <span>
                <span class="block text-[#101828] font-medium">
                  {{ docName(document.documentType, type) }}</span
                >
                <span class="text-xs text-[#475467]">
                  {{
                    `${docName(document.documentType, type).replaceAll(
                      " ",
                      "_"
                    )}.${docType(document.url)}`
                  }}</span
                >
              </span>
            </span>
          </td>

          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap flex gap-x-2 items-center justify-end"
          >
            <button
              type="button"
              @click="openMedia(document.url)"
              class="outline-none text-2xl"
            >
              <AppIcon icon="lets-icons:view-duotone" />
            </button>

            <button
              v-if="!hideUpdate"
              type="button"
              class="outline-none text-red-500 p-2"
              @click="
                emits('deleteDoc', {
                  url: document.url,
                  type: document.documentType,
                })
              "
            >
              <AppIcon icon="fa:trash-o" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <MediaViewer
    v-if="isMediaOpen"
    :open="isMediaOpen"
    @close="isMediaOpen = false"
    :media="media"
  />
</template>
<script setup>
const props = defineProps(["documents", "type", "hideUpdate"]);
const emits = defineEmits(["deleteDoc"]);
const allowedImages = ["jpg", "jpeg", "png"];
const allowedPdf = ["pdf"];
const allowedDoc = ["docx"];

const media = ref(null);
const isMediaOpen = ref(false);

function openMedia(val) {
  media.value = val;
  isMediaOpen.value = true;
}

const flattenedObjects = computed(() =>
  props.documents.flatMap((item) =>
    item.urls.map((url) => ({ url: url.url, documentType: item.documentType }))
  )
);
</script>
