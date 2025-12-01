<template>
  <NuxtLayout>
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
        <AppButton
          text="New Referral Code"
          :icon="`humbleicons:plus`"
          :btnClass="`!bg-[#165EF0] h-10 border-[#165EF0] !text-[14px] !py-2.5 !leading-5 text-white `"
          iconClass="text-sm md:text-base"
          @click="navigateTo('/referral-management/create')"
        />
      </div>
      <div class="px-6">
        <AppTab
          :tabs="tabs"
          :active="active"
          @set-active="(value) => (active = value)"
        />
      </div>
      <div v-if="active === 'management'">
        <PagesSuperadminReferralManagement />
      </div>
      <div v-if="active === 'leaderboard'">
        <PagesSuperadminReferralManagementLeaderboard
          customClass="py-0"
          hideHeader
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
const active = ref("management");
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
</script>
