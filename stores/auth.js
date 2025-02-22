import { defineStore } from "pinia";
import { logoutUser } from "~/services/authservices";
import { getSubApps } from "~/services/userservices";


export const useAuthStore = defineStore(
  "matta_user",
  () => {
    const { encrypt } = useEncryption();
    const appList = ref([]);
    const mattaAuth = useCookie("mattaAuth", defaultOptions);

    const loggedUser = ref(null);
    const isLoggingOut = ref(false);
    const authUsers = ref([]);
    const hasPin = ref(false);
    const language = ref(window?.navigator?.language);

    const isLoggedIn = computed(() => !!mattaAuth.value);
    const refreshToken = computed(() => mattaAuth?.value?.refreshToken);
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
      let userInfo = { ...loggedUser?.value, refreshToken: value };
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
    function getAppsData() {
      getSubApps().then((res) => {
        if (res.status === 200) {
          const rows = res.data.data.map((i) => ({
            ...i,
            url: `${i.url}/auth/validate?token=${encodeURIComponent(encrypt(jwToken.value))}&code=${encodeURIComponent(encrypt(authStore.refreshToken))}`,
            defaultUrl: i.url,
          }));
          setAppList(rows);
        }
      });
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
          refreshToken: refreshToken.value,
        });
        if (response.status === 200) {
          localStorage.clear();
          isLoggingOut.value = false;

          clearCookies().then(() => {
            mattaAuth.value = null;
            loggedUser.value = null;
            handleAppRedirect(route.params.appId);
          });
        }
      } catch (error) {
        isLoggingOut.value = false;

        clearCookies().then(() => {
          mattaAuth.value = null;
          loggedUser.value = null;
          handleAppRedirect(route.params.appId);
        });
      }
    };

    const clearAuth = () => {
      clearCookies().then(() => {
        mattaAuth.value = null;
        loggedUser.value = null;
        handleAppRedirect(route.params.appId);
      });
    };
    return {
      updateUser,
      isLoggedIn,
      refreshToken,
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
      getAppsData,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
