<template>
  <div
    v-show="!showSideBar"
    class="flex lg:hidden justify-between items-center px-3 py-4 w-full flex-none order-0 self-stretch bg-white z-[3000] border-b"
  >
    <!-- Logo -->
    <div class="flex items-start p-0 lg:hidden">
      <AppLogo />
    </div>

    <!-- Application Nav Menu Button -->
    <div class="flex gap-x-4 items-center">
      <AppMenu />
      <button
        type="button"
        class="flex justify-center items-center p-2 gap-2 w-[40px] h-[40px] text-2xl bg-[#0C111D] rounded-lg"
        @click="() => toggleSideBar(true)"
      >
        <MenuIcon />
      </button>
    </div>
  </div>
</template>

<script setup>
import MenuIcon from "@/assets/images/svgs/menu-02.svg";

const showSideBar = inject("showSideBar");
const toggleSideBar = inject("toggleSideBar");
</script>

<style lang="scss" scoped></style>
