<template>
  <div class="py-5 bg-white rounded-lg">
    <div class="flex flex-row justify-between px-6 py-5 mb-6">
      <div class="flex flex-col gap-1">
        <span
          class="font-semibold text-[18px] leading-[28px] tracking-[0%] text-[#101828]"
        >
          Referral Management System
        </span>
        <span
          class="font-normal text-[14px] leading-[20px] tracking-[0%] text-[#475467]"
          >Manage all referral codes and leaderboard
        </span>
      </div>
      <div class="flex gap-x-4">
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
    </div>
    <div class="px-6">
      <AppTab :tabs="tabs" :active="active" />
    </div>
    <slot />
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
    to: "/referral-management/management",
  },
  {
    title: " Leaderboard",
    key: "leaderboard",
    to: "/referral-management/leaderboard",
  },
];
</script>
