<template>
  <div
    class="w-full rounded-[10px] border border-[#EAECF0] overflow-x-auto md:min-w-[360px] mx-auto"
  >
    <table aria-describedby="true" v-if="directors.length" class="w-full">
      <thead>
        <tr>
          <th
            class="capitalize text-[#475467] text-sm text-left font-semibold border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            Directors
          </th>

          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(director, id) in directors"
          :key="id"
          class="border-b last:border-none"
        >
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            <span class="flex gap-x-3 items-center">
              <span class="bg-gray-50 uppercase h-9 w-9 flex items-center justify-center rounded-lg border">
                {{ director.firstName.slice(0,1) }}{{ director.lastName.slice(0,1) }}
              </span>
              <span>
                <span class="text-[#101828] block">
                  {{ director.firstName }} {{ director.lastName }}</span
                >
                <span class="text-[#475467]"> {{ director.email }}</span>
              </span>
            </span>
          </td>

      
          <td
            v-if="companyInfo?.approvalStatus"
            class="flex justify-end text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            <button
              type="button"
              @click="
                detail = director;
                open = true;
              "
              class="outline-none text-2xl"
            >
              <AppIcon icon="lets-icons:view-duotone" />
            </button>
          </td>
          <td
            v-if="!companyInfo?.approvalStatus"
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            <span class="flex gap-x-3 items-center justify-end">
              <span @click="emits('handleEdit', id, director)" class="p-1"
                ><i class="uil uil-pen"></i
              ></span>
              <span class="p-1" @click="emits('handleDelete', id)"
                ><i class="uil uil-trash text-red-500"></i
              ></span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="mx-auto">
      <EmptyData type="user" title="No director added" />
    </div>
  </div>

  <IndexModal :is-open="open" @toggle-popup="open = false">
    <template #content>
      <DirectorView :detail="detail" />
    </template>
  </IndexModal>
  <MediaViewer
    v-if="isOpen"
    :open="isOpen"
    @close="isOpen = false"
    :media="media"
  />
</template>
<script setup>
import IndexModal from "~/components/IndexModal";
import { defineProps, ref, defineEmits } from "vue";
import DirectorView from "./DirectorView.vue";
import MediaViewer from "~/components/MediaViewer";
import EmptyData from "./EmptyData.vue";

const isOpen = ref(false);
const media = ref("");
defineProps(["directors", "companyInfo"]);
const emits = defineEmits(["handleDelete", "handleEdit"]);
const detail = ref(null);
const open = ref(false);
</script>
