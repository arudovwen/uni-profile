<template>
  <div
    v-show="showSideBar"
    class="w-screen h-screen lg:hidden flex bg-[#545860]/60 backdrop-blur-xl z-[99999]"
  >
    <!-- SIDEBAR -->
    <aside class="flex flex-col justify-between w-[280px] h-full bg-white border-r border-gray-200">
      <!-- LOGO + NAVIGATION -->
      <div class="pt-3">
        <div class="px-6 mb-6">
          <AppLogo />
        </div>

        <nav class="">
          <ul class="space-y-2">
            <li v-for="item in mappedNavigation" :key="item.name">
              <router-link
                :to="item.url"
                class="flex items-center gap-3 px-6 py-2.5 transition text-matta-black"
                activeClass="bg-[#0C111D] text-white"
              >
                <span class="text-base truncate font-onest">
                  {{ item.name }}
                </span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>

      <!-- USER DROPDOWN -->
      <Menu as="div" class="relative">
        <MenuButton
          class="w-full p-4 flex items-center justify-between transition border-t"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-matta-black rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">{{ authStore.loggedUser?.fullName?.charAt(0) }}</span>
            </div>

            <div class="flex flex-col  w-[160px] truncate text-left">
              <p class="text-sm font-semibold text-black">
                {{ authStore.loggedUser?.fullName }}
              </p>
              <p class="text-sm text-gray-400 truncate">
                {{ authStore.loggedUser?.email }}
              </p>
            </div>
          </div>

          <LogoutIcon class="w-5 h-5" />
        </MenuButton>

        <MenuItems
          class="absolute bottom-16 left-4 w-[200px] bg-white shadow-lg rounded-lg overflow-hidden z-50"
        >
          <div
            @click="isSigningOut = true"
            class="px-4 py-3 text-sm cursor-pointer hover:bg-primary-50"
          >
            Sign Out
          </div>
        </MenuItems>
      </Menu>
    </aside>

    <!-- BACKDROP CLICK CLOSE -->
    <div class="flex-1" @click="toggleSideBar(false)">
      <div class="flex items-center justify-center w-10 h-10 m-5">
        <img src="/assets/images/svgs/x-close.png" class="w-6 h-6" />
      </div>
    </div>
  </div>

  <!-- SIGN OUT MODAL -->
  <ModalCenter v-if="isSigningOut">
    <div class="p-6 bg-white rounded-lg">
      <div class="flex items-center justify-between mb-5">
        <h4 class="text-xl font-medium">Sign Out</h4>
      </div>

      <p class="mb-5 text-sm">Are you sure you want to sign out?</p>

      <div class="flex gap-3 mt-6">
        <button
          @click="isSigningOut = false"
          class="w-1/2 px-4 py-3 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          @click="logOut"
          class="w-1/2 px-4 py-3 text-white rounded-lg bg-primary-500 hover:opacity-80"
        >
          Yes
        </button>
      </div>
    </div>
  </ModalCenter>
</template>
<script setup>
import { computed, inject, provide, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";

import LogoutIcon from "@/assets/images/svgs/log-out-01.svg";

import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { logOut } from "~/services/authservices";

const authStore = useAuthStore();
const route = useRoute();

const NavMapper = {
  3: SuperNavigation,
  0: Navigation,
  1: OwnerNavigation,
  2: UserNavigation,
  4: PlatformAdminNavigation,
};
const mappedNavigation = computed(
  () => NavMapper[authStore?.userInfo?.userCategory]
);

const isSigningOut = ref(false);
const showSideBar = inject("showSideBar");
const toggleSideBar = inject("toggleSideBar");

provide("isOpen", isSigningOut);
</script>
