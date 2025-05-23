<template>
  <div
    class="w-full g:px-[30px] flex flex-col items-start gap-y-2 lg:flex-row lg:items-center justify-between"
    :class="className"
  >
    <div class="flex-1">
      <span
        class="cursor-pointer flex flex-row justify-start items-center text-[#021242] mb-6"
        v-if="canGoback"
        @click="backRoute ? navigateTo(backRoute) : router.go(-1)"
      >
        <AppIcon icon="ph:arrow-left-bold" />
        <span class="ml-2">{{ backText }}</span>
      </span>
      <h1
        v-if="title"
        class="text-lg text-[#101828] col-span-1 font-semibold flex gap-x-3 items-center capitalize"
      >
        {{ title }}
        <span
          class="text-xs h-6 min-w-[24px] px-1 rounded-full flex justify-center items-center border border-[#EAECF0] bg-[#F9FAFB] text-[#344054]"
          v-if="count"
          >{{ count }}</span
        >
      </h1>
  
      <slot name="subtext">
        <p v-if="subtext" class="text-sm text-[#475467] max-w-[500px]">
          {{ subtext }}
        </p>
      </slot>
    </div>
    <div>
      <slot name="button">
        <div class="hidden md:flex">
          <AppButton
            v-if="btnText"
            @click="emits('onButtonClick')"
            :text="btnText"
            :icon="btnIcon"
            :btnClass="`!px-[10px] md:!px-[14px] !py-[10px] bg-primary-500 !text-white !text-sm ${btnClass}`"
            iconClass="text-sm md:text-base"
          />
        </div>
        <div class="md:hidden">
          <AppButton
            v-if="btnMiniText || btnText"
            @click="emits('onButtonClick')"
            :text="btnMiniText || btnText"
            :icon="btnIcon"
            :btnClass="`!px-[10px] md:!px-[14px] !py-[10px] bg-primary-500 !text-white !text-sm ${btnClass}`"
            iconClass="text-sm md:text-base"
          />
        </div>
      </slot>
    </div>
  </div>
  <div class="w-full h-[1px] bg-[#E4E7EC] mt-6" v-show="hasLine"></div>
</template>
<script setup>
defineProps([
  "title",
  "className",
  "welcome",
  "subtext",
  "btnText",
  "btnIcon",
  "canGoback",
  "btnClass",
  "btnMiniText",
  "count",
  "backRoute",
  "backText",
  "hasLine",
]);
const emits = defineEmits(["onButtonClick", "returnButtonClick"]);
const router = useRouter();
</script>
