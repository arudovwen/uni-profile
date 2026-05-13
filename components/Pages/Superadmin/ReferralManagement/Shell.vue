<template>
  <div class="font-Avenir overflow-hidden">
    <div class="w-full rounded-lg overflow-hidden">
      <div class="pt-6">
        <DashboardPageHeader
          title="Referral Management System"
          subtitle="Manage all referral codes and leaderboard"
        >
          <template #right>
            <div class="flex flex-wrap gap-3">
              <AppButton
                text="New Campaign Code"
                :icon="`humbleicons:plus`"
                :btnClass="`!bg-white h-10 border border-gray-200 !text-[14px] !py-2.5 !leading-5 text-primary `"
                iconClass="text-sm md:text-base"
                @click="navigateTo('/referral-management/create?refType=2')"
              />
              <AppButton
                text="New Referral Code"
                :icon="`humbleicons:plus`"
                :btnClass="`!bg-[#165EF0] h-10 border-[#165EF0] !text-[14px] !py-2.5 !leading-5 text-white `"
                iconClass="text-sm md:text-base"
                @click="navigateTo('/referral-management/create?refType=0')"
              />
            </div>
          </template>
        </DashboardPageHeader>
      </div>

      <div class="px-0">
        <AppTab :tabs="tabs" :active="active" @set-active="handleTabChange" />
      </div>

      <div class="pb-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

const active = computed(() =>
  route.path.endsWith("/leaderboard") ? "leaderboard" : "management",
);

const tabs = [
  {
    title: "Referral Management",
    key: "management",
  },
  {
    title: " Leaderboard",
    key: "leaderboard",
  },
];

const handleTabChange = (key) => {
  navigateTo(key === "leaderboard" ? "/referral-management/leaderboard" : "/referral-management/management");
};
</script>
