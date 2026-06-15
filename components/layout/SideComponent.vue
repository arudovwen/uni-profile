<template>
  <aside
    class="box-border flex flex-col items-start w-[282px] h-full bg-white border-r border-gray-200"
  >
    <div class="w-full grid gap-y-12">
      <div
        class="flex flex-col items-start p-0 py-4 pl-[24px] pr-[20px] w-full h-[30px] z-20 mb-4"
      >
        <AppLogo />
      </div>
      <nav class="flex flex-col items-start px-[16px] gap-[8px] w-full z-0">
        <ul class="grid w-full gap-y-2">
          <li
            v-for="item in mappedNavigation"
            :key="item.name"
            class="block w-full"
          >
            <router-link
              :to="item.url"
              :class="`flex flex-row items-center p-2 gap-2 w-full h-[40px] bg-blue rounded-[6px] ${
                isActive(item) && 'bg-[#1570EF] !text-[#ffffff]'
              }`"
            >
              <div class="flex flex-row items-center p-2 gap-x-3">
                <span class="">
                  <SvgsAuditSvg
                    v-if="item.key === 'audit-logs'"
                    :active="isActive(item)"
                  />
                  <SvgsUsersSvg
                    v-if="item.key === 'users-management'"
                    :active="isActive(item)"
                  />
                  <SvgsUsersSvg
                    v-if="item.key === 'users-management'"
                    :active="isActive(item)"
                  />
                  <SvgsUsersSvg
                    v-if="item.key === 'referral-management'"
                    :active="isActive(item)"
                  />
                     <SvgsRankingSvg
                    v-if="item.key === 'referral-leaderboard'"
                    :active="isActive(item)"
                  />
                  <SvgsAppSvg
                    v-if="item.key === 'my-applications'"
                    :active="isActive(item)"
                  />
                  <SvgsOrdersSvg
                    v-if="item.key === 'profile'"
                    :active="isActive(item)"
                  />

                  <SvgsAppSvg
                    v-if="item.key === 'application-management'"
                    :active="isActive(item)"
                  />
                  <SvgsNotificationSvg
                    v-if="item.key === 'notifications'"
                    :active="isActive(item)"
                  />
                  <SvgsSettingSvg
                    v-if="item.key === 'index'"
                    :active="isActive(item)"
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
  </aside>
</template>
<script setup>
const route = useRoute();
const authStore = useAuthStore();
const NavMapper = {
  0: Navigation,
  3: SuperNavigation,
  4: Navigation,
};
const mappedNavigation = computed(
  () => NavMapper[authStore?.userInfo?.userCategory]
);

const isActive = (item) => {
  return (
    route.path.includes(item.key) ||
    item?.childRoutes?.some((child) => child === route.path)
  );
};
</script>
<style scoped lang="scss"></style>
