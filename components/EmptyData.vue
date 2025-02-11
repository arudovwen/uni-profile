<template>
  <div
    class="flex flex-col items-center justify-center p-4 h-[280px] text-gray-400 text-center"
    :class="className"
  >
    <div class="mx-24 flex justify-center">
      <div class="mb-6">
        <img
          :src="EmptyIcon"
          class="!!h-auto !w-20"
          v-if="type === 'settlement'"
        />
        <BoxIcon class="!h-auto !w-20" v-else />
      </div>
    </div>
    <p :class="titleClass" class="text-lg text-[#475467] mb-2">
      {{ title || "No data available" }}
    </p>
    <p
      v-if="subtext"
      class="text-sm text-[#475467] max-w-[352px] mx-auto text-center"
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
import UserIcon from "/assets/images/svgs/user-01.svg";
import EmptyIcon from "/images/settle.png";
import SettlementsIcon from "/assets/images/svgs/settlements.svg";
import BoxIcon from "/assets/images/svgs/ic-folder-empty.svg";
import TruckIcon from "@/assets/images/svgs/truck-01.svg";
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
