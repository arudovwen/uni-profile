<template>
  <img
    v-if="appInfo?.logoUrl"
    :src="appInfo.logoUrl"
    :alt="appInfo.name"
    class="w-[150px] h-auto"
  />
 <div  v-else>
   <img v-if="!dark" src="@/assets/apps/mat.png" alt="sso logo" class="w-[120px] md:w-[150px] h-auto" />
    <img v-if="dark" src="@/assets/apps/mat-white.png" alt="sso logo" class="w-[120px] h-auto" />
 </div>
</template>

<script setup>
const { app } = useRoute().params;
const { appCode } = useRoute().query;
const authStore = useAuthStore();

const appInfo = computed(() =>
  authStore.appList.find((i) => i.code === app || i.code === appCode)
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
