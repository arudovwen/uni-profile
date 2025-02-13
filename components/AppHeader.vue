<template>
  <div class="bg-white">
    <div class="container box-border py-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <!-- Logo and Search Section -->
      <div class="flex gap-x-6 items-center">
        <AppLogo v-if="!hideLogo" class="" />
        <div class="w-[425px] hidden lg:inline">
          <Textinput
            icon-position="left"
            icon="mage:search"
            :class-input="searchInputClass"
          />
        </div>
      </div>

      <!-- Right Side Menu Section -->
      <div class="flex flex-row justify-start items-center p-0 gap-5">
        <AppMenu />

        <Menu as="div" class="relative">
          <MenuButton class="outline-none">
            <div :class="profileButtonClass">
              <!-- Avatar -->
              <div :class="avatarClass">
                <span>{{ userInitials.first }}</span>
                <span>{{ userInitials.last }}</span>
              </div>

              <!-- User Info - Desktop -->
              <div class="flex-col items-start p-0 lg:w-[103px] hidden lg:inline">
                <p :class="nameClass">
                  {{ displayName }}
                </p>
                <p :class="emailClass">
                  {{ authStore?.userInfo?.email }}
                </p>
              </div>

              <!-- Dropdown Arrow - Desktop -->
              <div class="hidden lg:flex flex-row items-start p-0 w-[32px] h-[32px]">
                <div class="flex flex-row flex-wrap justify-center items-center content-center p-1.5 w-[32px] h-[32px] rounded-[6px]">
                  <AppIcon icon="flowbite:angle-down-outline" />
                </div>
              </div>
            </div>
          </MenuButton>

          <MenuItems :class="menuItemsClass">
            <MenuItem v-slot="{close, active, disabled}">
              <MultiApps @close="close" />
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  </div>

  <!-- Side Modal -->
  <ModalSide :is-open="isOpen" @toggle-popup="openModal" v-if="isOpen">
    <template #content>
      <div class="h-full md:w-[480px] bg-white rounded-lg p-6 lg:p-10">
        <!-- <NotificationComponent /> -->
      </div>
    </template>
  </ModalSide>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch, provide } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { useRouter } from 'vue-router';
import { useThrottleFn } from '@vueuse/core';

// Props
defineProps({
  showlang: {
    type: Boolean,
    default: false,
  },
  hideLogo:{
    type: Boolean,
    default:false
  }
});

// Store and Router
const router = useRouter();
const authStore = useAuthStore();

// Refs
const isOpen = ref(false);
const windowWidth = ref(0);
const view = ref({ atTopOfPage: true });


const userInitials = computed(() => ({
  first: authStore.userInfo?.firstName?.slice(0, 1) || '',
  last: authStore.userInfo?.lastName?.slice(0, 1) || ''
}));

const displayName = computed(() => 
  authStore?.userInfo?.userCategory !== 3
    ? authStore?.userInfo?.fullName
    : "Superadmin"
);

// Styles
const searchInputClass = '!shadow-none !border-none !bg-[#F2F4F7] !text-base';
const profileButtonClass = 'box-border flex flex-row items-center lg:p-2 lg:gap-3 lg:w-[220px] lg:border lg:border-gray-200 rounded-[12px]';
const avatarClass = 'w-[38px] h-[38px] text-sm whitespace-nowrap bg-gray-200 flex rounded-[50%] uppercase items-center justify-center font-medium truncate';
const nameClass = 'h-[20px] font-medium text-[14px] leading-[20px] text-[#344054] text-left w-[120px] truncate whitespace-nowrap';
const emailClass = 'font-normal text-[12px] leading-[18px] text-gray-600 flex-none order-1 flex-grow-0 capitalize w-[120px] truncate';
const menuItemsClass = 'absolute z-[999] divide-y divide-gray-100 bg-white shadow right-0 min-w-[150px] w-[300px] border border-[#E4E7EC] overflow-hidden rounded-lg mt-2';

// Methods
const openModal = () => {
  isOpen.value = !isOpen.value;
};

const handleScroll = useThrottleFn(() => {
  view.value.atTopOfPage = window?.pageYOffset <= 500;
}, 100);

const getWindowSize = () => {
  windowWidth.value =
    window?.innerWidth ||
    document?.documentElement?.clientWidth ||
    document?.body?.clientWidth;
};

// Lifecycle hooks
onBeforeMount(() => {
  window?.addEventListener('scroll', handleScroll);
  window?.addEventListener('resize', getWindowSize);
  getWindowSize(); // Initial window size
});

// Route watcher
watch(() => router.currentRoute.value, () => {
  isOpen.value = false;
});

// Provide for child components
provide('isOpen', isOpen);
</script>

<style lang="scss">
.fade-in-top {
  -webkit-animation: fade-in-top 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: fade-in-top 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

.fade-out-top {
  -webkit-animation: fade-out-top 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: fade-out-top 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes fade-in-top {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-out-top {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}

nav .NuxtLink-active.NuxtLink-exact-active {
  color: #1570ef;
}
</style>