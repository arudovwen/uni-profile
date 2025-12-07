<template>
  <!-- {{ authStore.authUsers }} -->

  <ul class="grid">
    <li
      v-for="item in profileList"
      @click="switchProfile(item)"
      class="px-4 flex gap-x-3 items-center text-sm border-b py-[10px] hover:bg-gray-50 cursor-pointer"
    >
      <span
        class="flex items-center justify-center w-10 h-10 font-semibold uppercase border border-blue-100 rounded-full bg-blue-50"
        >{{ item.firstName.slice(0, 1) }}{{ item.lastName.slice(0, 1) }}</span
      >
      <span class="flex flex-col">
        <span class="font-medium">{{ item.fullName }}</span>
        <span class="block truncate w-[220px]">{{ item.email }}</span>
      </span>
    </li>
    <li class="px-4 py-[10px] border-b">
      <button
        @click="
          navigateTo('/account/login', {
            open: {
              target: '_blank',
            },
          })
        "
        class="flex items-center text-sm gap-x-3"
      >
        <span
          class="h-10 w-10 rounded-full flex items-center r border border-[#D0D5DD] justify-center bg-[#F2F4F7]"
          ><AppIcon icon="mage:user-plus" iconClass="text-base"
        /></span>
        <span class="flex flex-col">
          <span class="">Add another account</span>
        </span>
      </button>
    </li>
    <li class="px-4 py-[10px]">
      <button
        @click="isSigniningOut = true"
        class="flex items-center text-sm gap-x-3"
      >
        <span
          class="h-10 w-10 rounded-full flex items-center r border border-[#D0D5DD] justify-center bg-[#F2F4F7]"
          ><AppIcon icon="tabler:logout" iconClass="text-base"
        /></span>
        <span class="flex flex-col">
          <span class="">Logout of All Accounts</span>
        </span>
      </button>
    </li>
  </ul>

  <ModalCenter v-if="isSigniningOut">
    <template #default>
      <div class="p-6 bg-white rounded-lg sm:pb-4" v-if="isSigniningOut">
        <div class="flex items-center justify-between mb-5">
          <h4 class="text-xl font-medium text-matta-black">Sign Out</h4>
        </div>

        <p class="mb-2 text-sm text-matta-black">
          Are you sure you want to sign out?
        </p>

        <div class="flex items-center justify-between mt-8 gap-x-2">
          <button
            type="button"
            @click="isSigniningOut = false"
            class="appearance-none border min-w-[140px] w-1/2 leading-none px-8 py-3 rounded-lg text-matta-black hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="handleLogout"
            class="appearance-none border min-w-[140px] w-1/2 disabled:opacity-60 disabled:cursor-not-allowed border-primary-500 leading-none px-4 py-3 rounded-lg text-white bg-primary-500 hover:opacity-70 text-sm"
          >
            Yes
          </button>
        </div>
      </div>
    </template>
  </ModalCenter>
  <ModalCenter v-if="isAnother">
    <template #default>
      <div class="p-6 bg-white rounded-lg sm:pb-4" v-if="isAnother">
        <div class="flex items-center justify-between mb-5">
          <h4 class="text-xl font-medium text-matta-black">Sign Out</h4>
        </div>

        <p class="mb-2 text-sm text-matta-black">
          Are you sure you want to sign out?
        </p>

        <div class="flex items-center justify-between mt-8 gap-x-2">
          <button
            type="button"
            @click="isSigniningOut = false"
            class="appearance-none border min-w-[140px] w-1/2 leading-none px-8 py-3 rounded-lg text-matta-black hover:bg-gray-100 text-[13px] uppercase"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="handleLogout"
            class="appearance-none border min-w-[140px] w-1/2 disabled:opacity-60 disabled:cursor-not-allowed border-primary-500 leading-none px-4 py-3 rounded-lg text-white bg-primary-500 hover:opacity-70 text-[13px]"
          >
            Yes
          </button>
        </div>
      </div>
    </template>
  </ModalCenter>
</template>
<script setup>
const authStore = useAuthStore();
const mattaProfiles = useCookie("mattaProfiles_Dev", defaultOptions);
defineEmits([
  "close",
  "click",
  "focus",
  "pointerenter",
  "mouseenter",
  "pointermove",
  "mouseleave",
  "pointerleave",
  "mousemove",
]);
defineProps([
  "id",
  " role",
  "tabIndex",
  "aria-disabled",
  "data-headlessui-state",
  "role",
]);
const isAnother = ref(false);
const isSigniningOut = ref(false);
function handleLogout() {
  window.location.href = "/auth/logout";
}
const profileList = computed(() =>
  mattaProfiles.value?.filter(
    (item) => item.email !== authStore?.userInfo?.email
  )
);
function switchProfile(data) {
  authStore.setLoggedUser(data);
  saveAuthProfile(data);
  window.location.href = "/";
}
provide("isOpen", isSigniningOut);
</script>
