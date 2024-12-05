<template>
  <div
    v-show="showSideBar"
    class="w-screen h-screen lg:hidden flex bg-[#545860] backdrop backdrop-blur-xl z-99999!"
  >
    <aside
      class="box-border lg:hidden flex flex-col items-start justify-between w-[311px] h-full bg-[#0C111D]"
    >
      <div class="w-full pt-[32px] gap-[48px]">
        <div
          class="flex flex-col items-start p-0 pl-[24px] mb-[30px] pr-[20px] w-[311px] h-[30px] z-20"
        >
          <AppLogo :dark="true" />
        </div>
        <div class="w-full flex justify-center items-center mb-6">
          <div
            class="flex flex-col items-start p-0 px-[4px] gap-[8px] w-[279px] z-0"
          >
            <HeaderSearchText
              mobile
              classInput="!border-none !text-base"
              iconPosition="left"
            />
          </div>
        </div>
        <nav
          class="flex flex-col items-start p-0 px-[4px] gap-[8px] w-full h-[184px] z-0"
        >
          <ul class="grid gap-y-2 w-full">
            <li
              v-for="item in mappedNavigation"
              :key="item.name"
              class="block w-full"
            >
              <router-link
                :to="item.url"
                class="flex flex-row items-center p-2 gap-2 w-full h-[40px] bg-blue rounded-[6px]"
                activeClass="bg-[#182230] !text-[#ffffff]"
              >
                <div class="flex flex-row items-center p-2 gap-x-3">
                  <span class="">
                    <SvgsDashboardSvg
                      v-if="item.key === 'dashboard'"
                      :active="route.path === item.url"
                    />
                    <SvgsDriversSvg
                      v-if="item.key === 'drivers'"
                      :active="route.path === item.url"
                    />
                    <SvgsOrdersSvg
                      v-if="item.key === 'orders'"
                      :active="route.path === item.url"
                    />
                    <SvgsVehiclesSvg
                      v-if="item.key === 'vehicles'"
                      :active="route.path === item.url"
                    />
                    <SvgsHomeSvg
                      v-if="item.key === 'home'"
                      :active="route.path === item.url"
                    />
                    <SvgsCustomersSvg
                      v-if="item.key === 'customers'"
                      :active="route.path === item.url"
                    />
                    <SvgsCardSvg
                      v-if="item.key === 'payments'"
                      :active="route.path === item.url"
                    />
                    <SvgsTeamSvg
                      v-if="item.key === 'team-management'"
                      :active="route.path === item.url"
                    />
                    <SvgsProfileSvg
                      v-if="item.key === 'settings'"
                      :active="route.path === item.url"
                    />
                    <SvgsKeysSvg
                      v-if="item.key === 'api-keys'"
                      :active="route.path === item.url"
                    />
                  </span>

                  <span
                    class="block h-[24px] font-onest font-normal text-[16px] leading-[24px] text"
                  >
                    <!-- Text content here -->
                    {{ item.name }}
                  </span>
                </div>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <Menu as="div" class="absolute bottom-0">
        <MenuButton class="outline-none">
          <div
            class="flex flex-row items-center justify-center mx-auto w-[311px] h-[88px] order-1 self-stretch flex-grow-0"
          >
            <div
              class="flex flex-row items-center p-0 gap-3 w-[255px] h-[40px] flex-none order-0 z-0"
            >
              <div class="h-[40px] w-[40px] rounded-[50%] bg-[#ffffff]"></div>
              <div
                class="flex flex-col items-start p-0 w-[179px] h-[40px] text-[#ffffff] flex-none order-1 flex-grow-0"
              >
                <!-- Main Text -->
                <p class="font-Onest font-semibold text-sm text-black">
                  {{ authStore.loggedUser?.fullName }}
                </p>

                <!-- Supporting Text -->
                <p
                  class="text-sm font-normal font-onest truncate text-gray-500"
                >
                  {{ authStore.loggedUser?.email }}
                </p>
              </div>
            </div>
            <div
              class="flex flex-row justify-center items-center p-2 gap-2 w-[36px] h-[36px] right-0 top-4 rounded-lg flex-none order-1 flex-grow-0 z-10"
            >
              <LogoutIcon />
            </div>
          </div>
        </MenuButton>
        <MenuItems
          class="absolute top-[-40px] z-40 left-16 bg-white shadow right-0 min-w-[150px] w-[213px] rounded-lg overflow-hidden mt-2"
        >
          <div
            @click="() => (isSigningOut = true)"
            class="'group flex w-full items-center rounded-md px-[14px] py-[11px] text-sm hover:bg-[rgba(22,94,240,0.09)] whitespace-nowrap gap-x-2 text-[#333] '"
          >
            Sign Out
          </div>
        </MenuItems>
      </Menu>
    </aside>
    <div class="w-full bg-transparent">
      <div
        class="h-[40px] w-[40px] ml-[20px] mt-[20px] flex justify-center items-center"
        @click="toggleSideBar(false)"
      >
        <img
          src="/assets/images/svgs/x-close.png"
          height="24px"
          width="24px"
          color="white"
        />
      </div>
    </div>
  </div>
  <ModalCenter v-if="isSigningOut">
    <template #default>
      <div class="bg-white p-6 sm:pb-4 rounded-lg" v-if="isSigningOut">
        <div class="flex justify-between mb-5 items-center">
          <h4 class="font-medium text-matta-black text-xl">Sign Out</h4>
          <!-- <i
            class="uil uil-times cursor-pointer text-lg"
            @click="isSigniningOut = false"
          ></i> -->
        </div>

        <p class="text-sm text-matta-black mb-2">
          Are you sure you want to sign out?
        </p>

        <div class="flex justify-between gap-x-2 items-center mt-8">
          <button
            type="button"
            @click="isSigningOut = false"
            class="appearance-none border min-w-[140px] w-1/2 leading-none px-8 py-3 rounded-lg text-matta-black hover:bg-gray-100 text-[13px] uppercase"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="logOut"
            class="appearance-none border min-w-[140px] w-1/2 border-primary-500 leading-none px-8 py-3 rounded-lg text-white bg-primary-500 hover:opacity-70 text-[13px] uppercase"
          >
            Yes
          </button>
        </div>
      </div>
    </template>
  </ModalCenter>
</template>
<script setup>

import LogoutIcon from "@/assets/images/svgs/log-out-01.svg";
import { useStore } from "vuex";
import { computed } from "vue";
import HeaderSearchText from "../Textinput/HeaderSearchText.vue";
import { logOut } from "~/services/authservices";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const authStore = useAuthStore();
const route = useRoute();
const mappedNavigation = computed(() => Navigation);
const isSigningOut = ref(false);
const showSideBar = inject("showSideBar");
const toggleSideBar = inject("toggleSideBar");
provide("isOpen", isSigningOut);
</script>
<style scoped lang="scss">
.backdrop {
  backdrop-filter: blur(16px);
}
</style>
