<template>
  <ul class="grid gap-y-[10px]" v-if="!activeKey">
    <li
      v-for="n in navigations.filter(
        (i) => i.name.toLowerCase() !== 'finance' && i.key !== 'sign-out'
      )"
      :key="n.name"
      @click="activeKey = n.name"
      class="flex gap-x-1 items-center group-hover:text-[#1570EF] justify-between text-sm font-medium text-[#182230]"
    >
      {{ n.name }}
      <AppIcon icon="pepicons-pencil:angle-right" />
    </li>
    <!-- <li
     
      
    >
     <NuxtLink to="/finance">
     <span class="flex gap-x-1 items-center group-hover:text-[#1570EF] justify-between text-sm font-medium text-[#182230]"> Finance
      <AppIcon icon="pepicons-pencil:angle-right" /></span>
     </NuxtLink>
    </li> -->
  </ul>
  <button
    class="flex gap-x-1 items-center text-xs mb-5"
    v-if="activeKey"
    @click="activeKey = null"
  >
    <AppIcon icon="pepicons-pencil:angle-left" class="text-base" /> Back
  </button>
  <ul class="grid gap-y-5 pb-10">
    <li
      v-for="cat in handleDropDown()"
      :key="cat.title"
      class="flex gap-x-1 items-center group-hover:text-[#1570EF] justify-between text-sm font-medium text-[#182230]"
    >
      <NuxtLink
        v-if="activeKey.toLowerCase() !== 'finance'"
        :to="`/category/${
          activeKey.toLowerCase() === 'markets' ? 'market' : 'application'
        }/${encodeURIComponent(cat.title.toLowerCase())}/${cat.id}`"
      >
        <button
          :class="[
            'group flex w-full items-center  text-sm  whitespace-nowrap gap-x-2 text-[#182230]',
          ]"
        >
          <AppIcon :icon="`fa6-solid:${cat.imagePath}`" v-if="cat.imagePath" />
          {{ cat.title }}
        </button>
      </NuxtLink>
      <button
        v-else
        :class="[
          'group flex w-full items-center  text-sm  whitespace-nowrap gap-x-2 text-[#182230]',
        ]"
      >
        <AppIcon :icon="`fa6-solid:${cat.imagePath}`" v-if="cat.imagePath" />
        {{ cat.title }}
      </button>
    </li>
    <li   class="flex gap-x-1 items-center group-hover:text-[#1570EF] justify-between text-sm font-medium text-[#182230] mt-2">
      <NuxtLink
        to="/request-product"
        activeClass="text-[#1570EF] font-medium"
        class="flex gap-x-1 items-center group-hover:text-[#1570EF]"
      >
        Request a product</NuxtLink
      >
    </li>
  </ul>
</template>
<script setup>
import {
  categories,
  navigations,
  mobileNavigation,
  financeMenu,
} from "~/utils/data";

const activeKey = inject("activeKey");

function handleDropDown() {
  if (activeKey?.value?.toLowerCase() === "markets") {
    return store?.marketsData;
  }

  if (activeKey?.value?.toLowerCase() === "applications") {
  }
  if (activeKey?.value?.toLowerCase() === "finance") {
    return financeMenu;
  }
}
</script>
