<template>
  <div
    v-if="directors.length"
    class="w-full rounded-[10px] border border-[#EAECF0] overflow-hidden md:min-w-[560px]"
  >
    <table aria-describedby="true" class="w-full">
      <thead>
        <tr>
          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            Name
          </th>
          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            Phone
          </th>
          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            DOB
          </th>
          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            BVN
          </th>

          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            ID
          </th>
          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            Signature
          </th>
          <th
            class="capitalize text-[#475467] text-sm text-left font-medium border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
          >
            Linkedin
          </th>
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
            <span class="text-[#101828] mb-1 block">
              {{ director.firstName }} {{ director.lastName }}</span
            >
            <span class="text-[#475467]"> {{ director.email }}</span>
          </td>

          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            {{ director.phone }}
          </td>
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            {{ moment(director.dob).format("ll") }}
          </td>
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            {{ director.bvn }}
          </td>
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            <span class="text-primary" @click="openMedia(director.identityUrl)"
              >View</span
            >
          </td>
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            <span class="text-primary" @click="openMedia(director.signatureUrl)"
              >View</span
            >
          </td>
          <td
            class="text-matta-black text-sm font-normal py-4 px-6 border-[#EAECF0] whitespace-nowrap"
          >
            <a class="text-primary" :href="director.linkedIn" target="_blank"
              >View profile</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <MediaViewer
    v-if="isOpen"
    :open="isOpen"
    @close="isOpen = false"
    :media="media"
  />
</template>
<script setup>
import moment from "moment";

const isOpen = ref(false);
const media = ref("");
defineProps(["directors", "title"]);
function openMedia(val) {
  media.value = val;
  isOpen.value = true;
}
</script>
