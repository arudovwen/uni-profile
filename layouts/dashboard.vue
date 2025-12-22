<template>
  <div class="min-h-screen bg-[#F9FAFB] font-Avenir">
    <!-- Header -->
    <header class="bg-white border-b border-[#E5E7EB]">
      <!-- Top Bar with Logo and Avatar -->
      <div class="flex items-center justify-between px-8 py-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <svg
            class="w-8 h-8 text-[#1570EF]"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path
              d="M16 4c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z"
            />
            <circle cx="12" cy="14" r="2" />
            <circle cx="20" cy="14" r="2" />
          </svg>
          <span class="text-xl font-semibold text-[#1570EF]">Matta</span>
        </NuxtLink>

        <!-- User Avatar -->
        <div class="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#1570EF] to-[#0F5BD3]">
          <img
            v-if="userAvatar"
            :src="userAvatar"
            alt="User"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-white font-semibold"
          >
            {{ userInitial }}
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex items-center gap-6 px-8">
        <NuxtLink
          to="/dashboard"
          :class="[
            'flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors',
            isActiveTab('apps')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span>Apps</span>
        </NuxtLink>

        <NuxtLink
          to="/dashboard?tab=users"
          :class="[
            'flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors',
            isActiveTab('users')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>Users</span>
        </NuxtLink>

        <NuxtLink
          to="/dashboard?tab=logs"
          :class="[
            'flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors',
            isActiveTab('logs')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Logs</span>
        </NuxtLink>

        <NuxtLink
          to="/dashboard?tab=settings"
          :class="[
            'flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors',
            isActiveTab('settings')
              ? 'border-[#1570EF] text-[#1570EF]'
              : 'border-transparent text-[#475467] hover:text-[#2F2F2F]',
          ]"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Settings</span>
        </NuxtLink>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="p-8">
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
