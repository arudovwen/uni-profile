<template>
  <div class="bg-white border-t border-b border-[#E4E7EC]">
    <ul
      class="container flex items-center justify-start py-3 overflow-auto gap-x-1"
    >
      <li
        v-for="n in NavMapper[authStore?.userInfo?.userCategory] ||
        UserNavigation"
        :key="n.name"
      >
        <NuxtLink :to="n.url">
          <button
            :class="
              route?.name?.includes(n.key)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-transparent'
            "
            class="border py-2 px-4 font-medium text-sm text-[#344054] rounded-[6px] whitespace-nowrap"
          >
            {{ n.name }}
          </button>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { Navigation, UserNavigation } from "@/utils/constants";

const authStore = useAuthStore();
const route = useRoute();

const NavMapper = {
  0: Navigation,
  1: OwnerNavigation,
  2: UserNavigation,
  4: PlatformAdminNavigation,
};
</script>
