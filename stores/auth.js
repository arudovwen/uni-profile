import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { logoutUser } from "~/services/authservices";

const cookieDomain =
  process.env.NODE_ENV === "production" ? ".matta.trade" : "localhost";

export const useAuthStore = defineStore(
  "matta_auth",
  () => {
    const loggedUser = ref(null);
    const isLoggingOut = ref(false);
    const authUsers = ref([]);
    const hasPin = ref(false);
    const language = ref(window?.navigator?.language);

    const isLoggedIn = computed(() => !!loggedUser.value);
    const refresh_token = computed(() => loggedUser?.value?.refreshToken);
    const access_token = computed(() => loggedUser?.value?.jwToken);
    const roles = computed(() => loggedUser?.value?.roles);
    const userId = computed(() => loggedUser?.value?.id);
    const businessId = computed(() => loggedUser?.value?.businessId);
    const userInfo = computed(() => loggedUser?.value);

    function setLoggedUser(data) {
      loggedUser.value = { ...data, access_token: data.jwToken };
      saveAuthUser(data);
    }

    function setHasPin(data) {
      hasPin.value = data;
    }
    function setAccessToken(value) {
      let userInfo = { ...loggedUser?.value, access_token: value };
      setLoggedUser(userInfo);
    }
    function setRefreshToken(value) {
      let userInfo = { ...loggedUser?.value, refresh_token: value };
      setLoggedUser(userInfo);
    }
    function updateUser(value) {
      let userInfo = { ...loggedUser?.value, fullName: value };
      setLoggedUser(userInfo);
    }
    function updateAccountType(value) {
      let userInfo = { ...loggedUser?.value, accountType: value };

      setLoggedUser(userInfo);
    }
    function updateUserInfo(data) {
      let userInfo = { ...loggedUser?.value, ...data };
      setLoggedUser(userInfo);
    }
    function saveAuthUser(obj) {
      const exists = authUsers.value.some(
        (existingObj) => existingObj?.access_token === obj?.access_token
      );
      if (exists) {
        return;
      }
      authUsers.value.push(obj);
    }
    function removeObjectByToken(access_token) {
      authUsers.value = authUsers?.value?.filter(
        (obj) => obj.access_token !== access_token
      );
    }
    const logOut = async () => {
      const route = useRoute();
      try {
        isLoggingOut.value = true;
        const response = await logoutUser({
          token: access_token.value,
          refreshToken: refresh_token.value,
        });
        if (response.status === 200) {
          localStorage.clear();
          isLoggingOut.value = false;
          authUsers.value = [];
          removeObjectByToken(access_token.value);
          clearCookies().then(() => {
            loggedUser.value = null;
            handleAppRedirect(route.params.appId);
          });
        }
      } catch (error) {
        isLoggingOut.value = false;
        // localStorage.clear();
        removeObjectByToken(access_token.value);
        clearCookies().then(() => {
          loggedUser.value = null;
          handleAppRedirect(route.params.appId);
        });
      }
    };

    const clearAuth = () => {
      removeObjectByToken(access_token.value);
      clearCookies().then(() => {
        loggedUser.value = null;
        handleAppRedirect(route.params.appId);
      });
    };
    return {
      updateUser,
      isLoggedIn,
      refresh_token,
      access_token,
      roles,
      userId,
      userInfo,
      setRefreshToken,
      setAccessToken,
      updateAccountType,
      updateUserInfo,
      setLoggedUser,
      logOut,
      loggedUser,
      businessId,
      language,
      setHasPin,
      hasPin,
      authUsers,
      isLoggingOut,
      clearAuth
    };
  },
  {
    persist: {
      storage: persistedState.cookiesWithOptions({
        domain: cookieDomain,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }),
    },
  }
);
