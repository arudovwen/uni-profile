<template>
  <img
    v-if="appInfo?.logoUrl"
    :src="appInfo.logoUrl"
    :alt="appInfo.name"
    class="w-auto h-12"
  />
  <img
    v-else
    src="@/assets/apps/ssologo.png"
    alt="sso logo"
    class="w-auto h-12"
  />
</template>

<script setup>
const { app } = useRoute().params;
const authStore = useAuthStore();

const appInfo = computed(() => authStore.appList.find((i) => i.code === app));
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
