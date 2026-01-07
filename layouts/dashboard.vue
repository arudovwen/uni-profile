<template>
  <div class="min-h-screen bg-[#F9FAFB] font-Avenir">
    <!-- Header -->
    <div class="bg-white border-b border-[#E5E7EB]">
      <header class="bg-white max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-0">
        <!-- Top Bar with Logo and Avatar -->
        <div class="flex items-center justify-between py-4">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <AuthLogo />
          </NuxtLink>

          <!-- User Avatar -->
          <div
            class="w-8 h-8 sm:w-[30px] sm:h-[30px] rounded-full overflow-hidden bg-gradient-to-br from-[#1570EF] to-[#0F5BD3]"
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
          </div>
        </div>

        <!-- Navigation Tabs -->
        <nav
          class="flex items-center gap-1 sm:gap-[10px] overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <NuxtLink
            to="/"
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

          <NuxtLink
            to="/?tab=users"
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

          <NuxtLink
            to="/?tab=logs"
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

          <NuxtLink
            to="/?tab=settings"
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

    <!-- Main Content -->
    <main class="px-4 sm:px-6 lg:px-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const route = useRoute();
const auth = computed(() => route.params.auth || "auth");

const userAvatar = ref("");
const userInitial = computed(() => "A");

const isActiveTab = (tab) => {
  if (tab === "apps") {
    return !route.query.tab || route.query.tab === "apps";
  }
  return route.query.tab === tab;
};
</script>
