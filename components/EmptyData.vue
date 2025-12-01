<template>
  <div
    class="flex flex-col items-center justify-center p-4 h-[280px] text-gray-400 text-center"
    :class="className"
  >
    <div class="flex justify-center mx-24">
      <div class="mb-6">
        <img
          :src="EmptyIcon"
          class="!!h-auto !w-20"
          v-if="type === 'settlement'"
        />
        <BoxIcon class="!h-auto !w-20" v-else />
      </div>
    </div>
    <p :class="titleClass" class="mb-2 text-gray-400">
      {{ title || "No data available" }}
    </p>
    <p
      v-if="subtext"
      class="text-sm text-gray-400 max-w-[352px] mx-auto text-center"
    >
      {{ subtext }}
    </p>
    <AppButton
      @click="emits('btnFunction')"
      v-if="btnText"
      :text="btnText"
      btnClass="!py-[10px] bg-primary-500 text-white mt-3 !rounded-lg"
      :icon="btnIcon"
    />
  </div>
</template>
<script setup>
import EmptyIcon from "/images/settle.png";
import BoxIcon from "/assets/images/svgs/ic-folder-empty.svg";

defineProps([
  "title",
  "subtext",
  "btnText",
  "url",
  "type",
  "btnIcon",
  "className",
  "classIcon",
  "titleClass",
]);
const emits = defineEmits(["btnFunction"]);
</script>
