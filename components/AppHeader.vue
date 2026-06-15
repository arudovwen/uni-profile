<template>
  <!-- Header -->
  <div class="bg-white border-b border-[#E5E7EB]">
    <header class="bg-white max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-0">
      <!-- Top Bar with Logo and Avatar -->
      <div class="flex items-center justify-between py-4 !pb-6 lg:px-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <AuthLogo />
        </NuxtLink>

        <!-- User Avatar with Dropdown -->
        <div class="relative" ref="userMenuRef">
          <button
            type="button"
            class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#1570EF] to-[#0F5BD3] cursor-pointer"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <img
              v-if="userAvatar"
              :src="userAvatar"
              alt="User"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white text-sm font-semibold"
            >
              {{ userInitial }}
            </div>
          </button>

          <!-- User Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full mt-2 w-[223px] bg-white border border-[#F2F4F7] rounded-lg shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)] z-50"
            >
              <!-- User Info -->
              <div class="px-4 py-[15px]">
                <p
                  class="text-sm font-medium text-[#475467] leading-5 truncate"
                >
                  {{ userName }}
                </p>
                <p
                  class="text-xs text-[#666666] leading-[18px] truncate"
                  :title="userEmail"
                >
                  {{ userEmail }}
                </p>
              </div>

              <!-- Divider -->
              <div class="border-t border-[#E4E7EC]"></div>

              <!-- Settings -->
              <button
                type="button"
                class="w-full px-4 py-[9px] flex items-center gap-[8px] hover:bg-[#F9FAFB] transition-colors"
                @click="goToSettings"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                    stroke="#475467"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1.66669 10.7334V9.26671C1.66669 8.40004 2.37502 7.68337 3.25002 7.68337C4.75835 7.68337 5.37502 6.61671 4.61669 5.30837C4.18335 4.55837 4.44169 3.58337 5.20002 3.15004L6.64169 2.32504C7.30002 1.93337 8.15002 2.16671 8.54169 2.82504L8.63335 2.98337C9.38335 4.29171 10.6167 4.29171 11.375 2.98337L11.4667 2.82504C11.8584 2.16671 12.7084 1.93337 13.3667 2.32504L14.8084 3.15004C15.5667 3.58337 15.825 4.55837 15.3917 5.30837C14.6334 6.61671 15.25 7.68337 16.7584 7.68337C17.625 7.68337 18.3417 8.39171 18.3417 9.26671V10.7334C18.3417 11.6 17.6334 12.3167 16.7584 12.3167C15.25 12.3167 14.6334 13.3834 15.3917 14.6917C15.825 15.45 15.5667 16.4167 14.8084 16.85L13.3667 17.675C12.7084 18.0667 11.8584 17.8334 11.4667 17.175L11.375 17.0167C10.625 15.7084 9.39169 15.7084 8.63335 17.0167L8.54169 17.175C8.15002 17.8334 7.30002 18.0667 6.64169 17.675L5.20002 16.85C4.44169 16.4167 4.18335 15.4417 4.61669 14.6917C5.37502 13.3834 4.75835 12.3167 3.25002 12.3167C2.37502 12.3167 1.66669 11.6 1.66669 10.7334Z"
                    stroke="#475467"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="text-sm text-[#475467]">Settings</span>
              </button>

              <!-- Logout -->
              <button
                type="button"
                class="w-full px-4 py-[9px] flex items-center gap-[8px] hover:bg-[#F9FAFB] transition-colors"
                @click="handleLogout"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.41669 6.30001C7.67502 3.30001 9.21669 2.07501 12.5917 2.07501H12.7C16.425 2.07501 17.9167 3.56668 17.9167 7.29168V12.725C17.9167 16.45 16.425 17.9417 12.7 17.9417H12.5917C9.24169 17.9417 7.70002 16.7333 7.42502 13.7833"
                    stroke="#475467"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.5 10H3.01666"
                    stroke="#475467"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.87502 7.20831L2.08335 9.99998L4.87502 12.7916"
                    stroke="#475467"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="text-sm text-[#475467]">Logout</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav
        class="flex items-center gap-1 sm:gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 lg:px-4"
      >
        <NuxtLink
          :to="getTabPath('apps')"
          :class="[
            'flex items-center gap-1.5 sm:gap-2 pb-[11px] pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
            isActiveTab('apps')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <DashboardNavIcon name="apps" :active="isActiveTab('apps')" />
          <span>Apps</span>
        </NuxtLink>
        <PermissionGuard :categories="[1]">
          <NuxtLink
            :to="getTabPath('kyc')"
            :class="[
              'flex items-center gap-1.5 sm:gap-2 pb-[11px] pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
              isActiveTab('kyc')
                ? 'border-[#1570EF] text-[#1570EF]'
                : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
            ]"
          >
            <DashboardNavIcon name="users" :active="isActiveTab('kyc')" />
            <span>KYC</span>
          </NuxtLink>
        </PermissionGuard>
        <NuxtLink
          :to="getTabPath('users')"
          :class="[
            'flex items-center gap-1.5 sm:gap-2 pb-3 pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
            isActiveTab('users')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <DashboardNavIcon name="users" :active="isActiveTab('users')" />
          <span>Users</span>
        </NuxtLink>

        <PermissionGuard :categories="[0, 3]">
          <NuxtLink
            :to="getTabPath('logs')"
            :class="[
              'flex items-center gap-1.5 sm:gap-2 pb-3 pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
              isActiveTab('logs')
                ? 'border-[#1570EF] text-[#1570EF]'
                : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
            ]"
          >
            <DashboardNavIcon name="logs" :active="isActiveTab('logs')" />
            <span>Logs</span>
          </NuxtLink>
        </PermissionGuard>

        <PermissionGuard :categories="[0, 3]">
          <NuxtLink
            :to="getTabPath('referrals')"
            :class="[
              'flex items-center gap-1.5 sm:gap-2 pb-3 pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
              isActiveTab('referrals')
                ? 'border-[#1570EF] text-[#1570EF]'
                : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
            ]"
          >
            <DashboardNavIcon name="users" :active="isActiveTab('referrals')" />
            <span>Referrals</span>
          </NuxtLink>
        </PermissionGuard>

        <PermissionGuard :categories="[1]">
          <NuxtLink
            :to="getTabPath('settlements')"
            :class="[
              'flex items-center gap-1.5 sm:gap-2 pb-3 pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
              isActiveTab('settlements')
                ? 'border-[#1570EF] text-[#1570EF]'
                : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
            ]"
          >
            <DashboardNavIcon
              name="settings"
              :active="isActiveTab('settlements')"
            />
            <span>Settlements</span>
          </NuxtLink>
        </PermissionGuard>

        <NuxtLink
          :to="getTabPath('settings')"
          :class="[
            'flex items-center gap-1.5 sm:gap-2 pb-3 pt-[1px] px-2 sm:px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
            isActiveTab('settings')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <DashboardNavIcon name="settings" :active="isActiveTab('settings')" />
          <span>Settings</span>
        </NuxtLink>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { decrypt } = useEncryption();

const userMenuRef = ref(null);
const isUserMenuOpen = ref(false);

const userAvatar = computed(
  () => authStore.userInfo?.photo || authStore.userInfo?.avatar || "",
);
const userInitial = computed(() => {
  const firstName = authStore.userInfo?.firstName || "";
  const lastName = authStore.userInfo?.lastName || "";
  if (firstName && lastName) {
    return `${firstName.charAt(0)}`.toUpperCase();
  }
  return firstName.charAt(0).toUpperCase() || "U";
});

const userName = computed(() => {
  const firstName = authStore.userInfo?.firstName || "";
  const lastName = authStore.userInfo?.lastName || "";
  return `${firstName} ${lastName}`.trim() || "User";
});

const userEmail = computed(() => {
  const encryptedEmail = authStore.userInfo?.email || "";
  if (!encryptedEmail) return "";
  try {
    return decrypt(encryptedEmail) || encryptedEmail;
  } catch {
    return encryptedEmail;
  }
});

const isSuperadmin = computed(() => authStore.userInfo?.userCategory === 3);

const getTabPath = (tab) => {
  const defaultMap = {
    apps: "/dashboard/apps",
    kyc: "/dashboard/kyc",
    users: "/dashboard/users",
    logs: "/dashboard/logs",
    settlements: "/settlements",
    settings: "/dashboard/settings",
  };

  const superadminMap = {
    apps: "/application-management",
    kyc: "/dashboard/kyc",
    users: "/users-management",
    logs: "/audit-logs",
    referrals: "/referral-management",
    settlements: "/settlements",
    settings: "/profile",
  };

  return (isSuperadmin.value ? superadminMap : defaultMap)[tab] || "/";
};

const isActiveTab = (tab) => {
  const targetPath = getTabPath(tab);

  if (route.path === "/" && (!route.query.tab || route.query.tab === "apps")) {
    return tab === "apps";
  }

  if (targetPath === "/") {
    return route.path === "/";
  }

  return route.path === targetPath || route.path.startsWith(`${targetPath}/`);
};

const goToSettings = () => {
  isUserMenuOpen.value = false;
  router.push(getTabPath("settings"));
};

const handleLogout = async () => {
  isUserMenuOpen.value = false;
  await authStore.logOut();
};

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
