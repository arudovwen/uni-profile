<template>
  <div class="p-10 bg-white rounded-lg bg-img">
    <div class="mb-12"><BreadCrumbs /></div>
    <div class="grid grid-cols-3 justify-between items-end">
      <h1 class="text-4xl text-matta-black col-span-1 font-medium">
        {{ route.meta.title }}
      </h1>
      <div />

      <div class="col-span-1 grid justify-end">
        <span class="p-5 rounded-lg bg-[#F1F3F5] w-[300px]"></span>
      </div>
    </div>
  </div>
</template>
<script setup>
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import { defineProps } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
defineProps(["title"]);
</script>