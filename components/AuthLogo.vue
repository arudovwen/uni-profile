<template>
  <img
    v-if="appInfo?.logoUrl"
    :src="appInfo.logoUrl"
    :alt="appInfo.name"
    class="w-[150px] !h-[35px] object-contain"
  />
  <img
    v-else
    src="@/assets/apps/mat.png"
    alt="sso logo"
    class="w-auto h-[25px]"
  />
</template>

<script setup>
const { app } = useRoute().params;
const { appCode } = useRoute().query;
const authStore = useAuthStore();

const appInfo = computed(() =>
  authStore.appList?.find((i) => i.code === app || i.code === appCode),
);
defineProps({
  className: {
    default: "w-auto h-8",
    type: String,
  },
  dark: {
    default: false,
  },
});
</script>
