<template>
  <Menu as="div" class="relative">
    <MenuButton class="outline-none">
      <span
        class="h-[36px] w-[36px] flex justify-center items-center bg-gray-100 rounded-[50%]"
      >
        <DotsGrid class="h-[20px] w-[20px]"
      /></span>
    </MenuButton>
    <MenuItems
      class="absolute z-[999] bg-white shadow right-0 min-w-[150px] w-[200px] rounded-lg overflow-hidden mt-2 p-4 grid grid-cols-2 gap-4 justify-center"
    >
      <MenuItem v-for="item in apps" :key="item.label"
        ><a target="_blank" :href="item.url">
          <button class="p-2 rounded-lg bg-primary-50/40 text-sm flex flex-col items-center gap-y-1 font-medium w-full">
            <span>
              <img
                :src="item?.logo"
                :alt="item.label"
                width="80"
                height="26"
                class="w-auto h-[28px] mx-auto block"
            /></span>
           <span class="text-xs"> {{ item.label }}   </span>                                                                                                                   
          </button>
        </a></MenuItem
      >
    </MenuItems>
  </Menu>
</template>

<script setup>
import DotsGrid from "@/assets/images/svgs/dots-grid.svg";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import Matta from "@/assets/apps/matt.png";
import Oxide from "@/assets/apps/ox.png";
import Flux from "@/assets/apps/flus.png";
import Orbital from "@/assets/apps/orb.png";

const apps = [
  {
    label: "Flux",
    url: "https://dev.deltalog.co",
    appId: "",
    logo: Flux,
  },
  {
    label: "Oxide",
    url: "https://dev.oxide.matta.trade/",
    appId: "",
    logo: Oxide,
  },
  {
    label: "Matta",
    url: "https://dev.matta.trade",
    appId: "",
    logo: Matta,
  },
  {
    label: "Orbital",
    url: "https://dev.orbital.matta.trade/",
    appId: "",
    logo: Orbital,
  },
];
</script>
