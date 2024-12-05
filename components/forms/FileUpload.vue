<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="relative">
    <label
      class="flex items-center gap-x-[15px] border p-1 border-[#EAECF0] rounded-lg bg-[#F9FAFB] h-[44px]"
    >
      <input type="file" id="uploadId" class="hidden" @change="handleFile" />
      <span
        class="bg-[#98A2B3] text-white rounded-[6px] flex items-center px-4 text-xs h-full font-medium cursor-pointer hover:bg-[#98A2B3]/80"
        >Choose file</span
      >
      <span class="text-xs text-loft-black" v-if="file">{{ file.name }}</span>
    </label>
  </div>
</template>
<script setup>
import { ref } from "vue";

const file = ref(null);
function handleFile(e) {
  file.value = e.target.files[0];
}
</script>
