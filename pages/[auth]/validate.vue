<template>
  <div class="flex justify-center items-center p-10 h-screen w-screen">
    <div class="text-center flex flex-col justify-center items-center gap-y-6">
      <AppLoaderV2 />
      <span class="text-sm text-center block">Signing you in</span>
    </div>
  </div>
</template>

<script setup>
import { getTokenInfo } from "~/services/authservices";

const { decrypt } = useEncryption();
const route = useRoute();
const { token, code } = route.query;
const authStore = useAuthStore();

onMounted(async () => {
  const decryptedRefresh = decrypt(code);
  const decryptedToken = decrypt(token);
  const config = {
    headers: { Authorization: `Bearer ${decryptedToken}` },
  };
  const response = await getTokenInfo(config);
  if (response.status === 200) {
    const userData = {
      ...response.data.data,
      jwToken: decryptedToken,
      refreshToken: decryptedRefresh,
    };
    authStore.setLoggedUser(userData);
    saveAuthProfile(userData);
    handleFinalRedirect(userData);
    return;
  }
});
</script>
