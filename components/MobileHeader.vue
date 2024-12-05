<template>
  <div
    v-show="!showSideBar"
    class="flex flex-row lg:hidden justify-between items-center p-3 gap-[201px] w-full h-[64px] flex-none order-0 self-stretch bg-[#0C111D] flex-grow fixed top-0 left-0 z-[3000]"
  >
    <!-- Logo -->
    <div class="flex flex-row items-start p-0 lg:hidden w-[142px] h-[32px]">
      <!-- <div
        class="mx-auto w-[143px] h-[32px] bg-[url('Oxide Pry2.png')] flex-none order-1 flex-grow-0"
      ></div> -->
      <AppLogo :dark="true" />
    </div>

    <!-- Application Nav Menu Button -->
    <div
      class="flex flex-row justify-center items-center p-2 gap-2 w-[40px] h-[40px] bg-[#0C111D] rounded-lg"
      @click="() => toggleSideBar(true)"
    >
      <MenuIcon />
      <!-- Menu Icon -->
      <!-- <img src="/assets/images/svgs/menu-02.svg" /> -->
      <!-- <div class="w-[24px] h-[24px] flex-none order-0 flex-grow-0 relative">
        <div
          class="absolute left-[12.5%] right-[12.5%] top-[25%] bottom-[25%] border-2 border-gray-300"
        ></div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import MenuIcon from "@/assets/images/svgs/menu-02.svg";

const showSideBar = inject("showSideBar");
const toggleSideBar = inject("toggleSideBar");
</script>

<style lang="scss" scoped></style>
