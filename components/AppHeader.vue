<template>
  <div class="bg-white">
    <div
      class="container box-border py-4 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <div class="flex gap-x-6 items-center">
        <AppLogo className="w-[80px] h-auto lg:w-[124px] " />
        <div class="w-[425px] hidden lg:inline">
          <Textinput
            icon-position="left"
            icon="mage:search"
            classInput="!shadow-none !border-none !bg-[#F2F4F7] !text-base"
          />
        </div>
      </div>
      <div class="flex flex-row justify-start items-center p-0 gap-5">
        <!-- Your content here -->
        <AppMenu />

        <Menu as="div" class="relative">
          <MenuButton class="outline-none">
            <div
              class="box-border flex flex-row items-center lg:p-2 lg:gap-3 lg:w-[220px] lg:border lg:border-gray-200 rounded-[12px]"
            >
              <!-- Content goes here -->
              <div
                class="w-[38px] h-[38px] text-sm whitespace-nowrap bg-gray-200 flex rounded-[50%] uppercase items-center justify-center font-medium truncate"
              >
                <span>{{ authStore.loggedUser?.firstName?.slice(0, 1) }}</span>
                <span>{{ authStore.loggedUser?.lastName?.slice(0, 1) }}</span>
              </div>
              <div
                class="flex flex-col items-start p-0 lg:w-[103px] hidden lg:inline"
              >
                <p
                  class="h-[20px] font-medium text-[14px] leading-[20px] text-[#344054] text-left  w-[120px] truncate whitespace-nowrap"
                >
                  {{ authStore?.loggedUser?.fullName }}
                </p>
                <p
                  class="font-normal text-[12px] leading-[18px] text-gray-600 flex-none order-1 flex-grow-0 capitalize w-[120px] truncate"
                >
                  {{ authStore?.loggedUser?.email }}
                </p>
              </div>
              <div
                class="hidden lg:flex flex-row items-start p-0 w-[32px] h-[32px] flex-none order-2 flex-grow-0"
              >
                <div
                  class="flex flex-row flex-wrap justify-center items-center content-center p-1.5 w-[32px] h-[32px] rounded-[6px] flex-none order-0 flex-grow-0"
                >
                  <AppIcon icon="flowbite:angle-down-outline" />
                </div>
              </div>
            </div>
          </MenuButton>
          <MenuItems
            class="absolute z-[999] divide-y divide-gray-100 bg-white shadow right-0 min-w-[150px] w-[213px] rounded-lg overflow-hidden mt-2"
          >
            <MenuItem>
              <div
                class="'group  w-full items-center rounded-md px-[14px] py-[11px] text-sm hover:bg-[rgba(22,94,240,0.09)] whitespace-nowrap gap-x-2 text-[#333] '"
              >
                <span class="block font-medium text-xs  w-[180px] truncate whitespace-nowrap"> {{ authStore?.loggedUser?.fullName }}</span>
                <span class="block font-normal text-xs w-[180px] truncate"> {{ authStore?.loggedUser?.email }} </span>
              </div></MenuItem
            >
            <MenuItem>
              <div
                @click="isSigniningOut = true"
                class="'group flex w-full items-center rounded-md text-sm px-[14px] py-[11px] text-sm hover:bg-[rgba(22,94,240,0.09)] whitespace-nowrap gap-x-2 text-[#333] '"
              >
              <AppIcon icon="lets-icons:sign-out-circle-light" icon-class="text-base" />  Sign Out
              </div></MenuItem
            >
          </MenuItems>
        </Menu>

        <!-- Your child elements go here -->
      </div>
    </div>
  </div>

  <ModalCenter v-if="isSigniningOut">
    <template #default>
      <div class="bg-white p-6 sm:pb-4 rounded-lg" v-if="isSigniningOut">
        <div class="flex justify-between mb-5 items-center">
          <h4 class="font-medium text-matta-black text-xl">Sign Out</h4>
        </div>

        <p class="text-sm text-matta-black mb-2">
          Are you sure you want to sign out?
        </p>

        <div class="flex justify-between gap-x-2 items-center mt-8">
          <button
            type="button"
            @click="isSigniningOut = false"
            class="appearance-none border min-w-[140px] w-1/2 leading-none px-8 py-3 rounded-lg text-matta-black hover:bg-gray-100 text-[13px] uppercase"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="logOut"
            :disabled="authStore.isLoggingOut"
            class="appearance-none border min-w-[140px] w-1/2 disabled:opacity-60 disabled:cursor-not-allowed border-primary-500 leading-none px-4 py-3 rounded-lg text-white bg-primary-500 hover:opacity-70 text-[13px]"
          >
            {{authStore.isLoggingOut?'Logging out ...':'Yes'}}
          </button>
        </div>
      </div>
    </template>
  </ModalCenter>
  <ModalSide :isOpen="isOpen" @togglePopup="openModal" v-if="isOpen">
    <template #content>
      <div class="h-full md:w-[480px] bg-white rounded-lg p-6 lg:p-10">
        <!-- <NotificationComponent /> -->
      </div>
    </template>
  </ModalSide>
</template>
<script setup>
import { ref } from "vue";
import { financeMenu } from "~/utils/data";
import { logOut } from "~/services/authservices";
import DotsGrid from "@/assets/images/svgs/dots-grid.svg";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const isSigniningOut = ref(false);

const props = defineProps({
  showlang: {
    default: false,
  },
});
const windowWidth = ref(
  window?.innerWidth ||
    document?.documentElement?.clientWidth ||
    document?.body?.clientWidth ||
    0
);
const handleGoogleTranslateSelect = (language) => {
  console.log(language);
};
const isOpen = ref(false);
const authStore = useAuthStore();
function openModal() {
  isOpen.value = !isOpen.value;
}
// const cartStore = useCartStore();
// const authStore = useAuthStore();
// const appStore = useApplicationStore();
// const store = useMarketStore();
const notifications = ref([]);
const router = useRouter();
const { currentRoute } = router;

const view = ref({
  atTopOfPage: true,
});
const open = ref(false);
onBeforeMount(() => {
  window?.addEventListener("scroll", handleScroll);
  window?.addEventListener("resize", getWindowSize);
});

// onMounted(() => {
//   if (authStore?.isLoggedIn) {
//     getNotifications();
//     setInterval(() => {
//       getNotifications();
//     }, 2 * 60 * 1000);
//   }
//   // geoFindMe();
// });
// const notifyParams = reactive({
//   PageNumber: 1,
//   PageSize: 30,
//   BusinessId: authStore?.businessId,
//   UserId: authStore.userId,
//   Role: "",
// });
const unreadnotifications = computed(() => {
  return notifications?.value?.filter((i) => !i.isViewed)?.length;
});
function getNotifications() {
  getnotification(notifyParams).then((res) => {
    notifications.value = res.data.data;
  });
}

function handleScroll() {
  // when the user scrolls, check the pageYOffset
  if (window?.pageYOffset > 500) {
    // user is scrolled
    if (view.value.atTopOfPage) view.value.atTopOfPage = false;
  } else if (!view.value.atTopOfPage) view.value.atTopOfPage = true;
}
function handleWidth() {
  windowWidth.value = window?.innerWidth;
}
function getWindowSize() {
  windowWidth.value =
    window?.innerWidth ||
    document?.documentElement?.clientWidth ||
    document?.body?.clientWidth;
  // const height = window?.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  // return { width, height };
}
function handleDropDown(val) {
  if (val === "markets") {
    return store?.marketsData;
  }
  if (val === "applications") {
  }
  if (val === "finance") {
    return financeMenu;
  }
}
watch(currentRoute, () => {
  open.value = false;
});

provide("getNotifications", getNotifications);
provide("notifications", notifications);
provide("unreadnotifications", unreadnotifications);
provide("open", open);
provide("isOpen", isSigniningOut);
</script>
<style lang="scss">
nav {
  .NuxtLink-active.NuxtLink-exact-active {
    color: #1570ef;
  }
}
/* Add the transition class for slide-down effect */
.fade-in-top {
  -webkit-animation: fade-in-top 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: fade-in-top 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2023-11-20 13:54:55
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-in-top
 * ----------------------------------------
 */
@-webkit-keyframes fade-in-top {
  0% {
    -webkit-transform: translateY(-50px);
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes fade-in-top {
  0% {
    -webkit-transform: translateY(-50px);
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
.fade-out-top {
  -webkit-animation: fade-out-top 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: fade-out-top 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2023-11-20 13:57:36
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-out-top
 * ----------------------------------------
 */
@-webkit-keyframes fade-out-top {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-50px);
    transform: translateY(-50px);
    opacity: 0;
  }
}
@keyframes fade-out-top {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-50px);
    transform: translateY(-50px);
    opacity: 0;
  }
}
</style>
