import { defineStore } from "pinia";
import { logoutUser } from "~/services/authservices";

const cookieDomain =
  process.env.NODE_ENV === "production" ? ".matta.trade" : "localhost";

export const useAuthStore = defineStore(
  "matta_auth",
  () => {
    const appList = ref([]);
    const mattaAuth = useCookie("mattaAuth");
    const loggedUser = ref(null);
    const isLoggingOut = ref(false);
    const authUsers = ref([]);
    const hasPin = ref(false);
    const language = ref(window?.navigator?.language);

    const isLoggedIn = computed(() => !!mattaAuth.value);
    const refresh_token = computed(() => mattaAuth?.value?.refreshToken);
    const jwToken = computed(() => mattaAuth?.value?.jwToken);
    const roles = computed(() => mattaAuth?.value?.roles);
    const userId = computed(() => mattaAuth?.value?.id);
    const businessId = computed(() => mattaAuth?.value?.businessId);
    const userInfo = computed(() => mattaAuth?.value);

    function setAppList(data) {
      appList.value = data;
    }
    function setLoggedUser(data) {
      loggedUser.value = { ...data };
    }

    function setHasPin(data) {
      hasPin.value = data;
    }
    function setAccessToken(value) {
      let userInfo = { ...loggedUser?.value, jwToken: value };
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
        (existingObj) => existingObj?.jwToken === obj?.jwToken
      );
      if (exists) {
        return;
      }
      authUsers.value.push(obj);
    }
    function removeObjectByToken(jwToken) {
      authUsers.value = authUsers?.value?.filter(
        (obj) => obj.jwToken !== jwToken
      );
    }
    const logOut = async () => {
    
      const route = useRoute();
      try {
        isLoggingOut.value = true;
        const response = await logoutUser({
          token: jwToken.value,
          refreshToken: refresh_token.value,
        });
        if (response.status === 200) {
          localStorage.clear();
          isLoggingOut.value = false;
          mattaAuth.value = null
          clearCookies().then(() => {
            loggedUser.value = null;
            handleAppRedirect(route.params.appId);
          });
        }
      } catch (error) {
        isLoggingOut.value = false;
        mattaAuth.value = null
        clearCookies().then(() => {
          loggedUser.value = null;
          handleAppRedirect(route.params.appId);
        });
      }
    };

    const clearAuth = () => {
      mattaAuth.value = null
      clearCookies().then(() => {
        loggedUser.value = null;
        handleAppRedirect(route.params.appId);
      });
    };
    return {
      updateUser,
      isLoggedIn,
      refresh_token,
      jwToken,
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
      clearAuth,
      saveAuthUser,
      appList,
      setAppList,
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
