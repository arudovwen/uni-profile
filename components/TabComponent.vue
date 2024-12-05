<template>
  <div
    class="min-h-[200px] h-full w-full relative bg-white/80 hover:bg-white flex flex-col justify-between cursor-pointer shadow-sm overflow-hidden bg-cover bg-no-repeat transition-all duration-500 rounded-lg hover:scale-105"
  >
    <div
      class="flex flex-col justify-between absolute top-0 right-0 bottom-0 left-0 p-6"
    >
      <div class="flex justify-between items-start mb-8">
        <div
          class="h-11 w-12 rounded-full flex items-center justify-center border border-matta-black/20"
          :style="{
            borderColor:
              activeIndex === index
                ? detail.marketColor
                : 'rgb(44 44 44 / 0.4)',
          }"
        >
          <font-awesome-icon
            class="h-4 w-4"
            :style="{
              color:
                activeIndex === index ? detail.marketColor : 'rgb(44 44 44 )',
            }"
            :icon="['fas', detail.imagePath ? detail.imagePath : 'box']"
          />
        </div>
        <span class="font-normal text-[13px]">0{{ index + 1 }}</span>
      </div>
      <div>
        <p class="text-sm font-medium text-matta-black mb-2">
          {{ detail.title }}
        </p>
        <p class="text-xs font-normal flex justify-start items-center">
          <span class="">{{ detail.productCount }} products</span>
          <span
            class="rounded-full bg-[#DDDDDD] h-[.25rem] w-[.25rem] mx-4"
          ></span>
          <span>{{ detail.categoriesCount }} subcategories</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

defineProps(["detail", "index", "activeIndex"]);
</script>
