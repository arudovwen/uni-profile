import CryptoJS from "crypto-js";
import { defineStore } from "pinia";
import { logoutUser } from "~/services/authservices";
import { getSubApps } from "~/services/userservices";

const encryptPayload = (data) => {
  const config = useRuntimeConfig();
  const secretKey = config?.public?.encryptionKey;
  if (!secretKey) return JSON.stringify(data);

  const payload = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(payload, secretKey).toString();
};

const decryptPayload = (value) => {
  const config = useRuntimeConfig();
  const secretKey = config?.public?.encryptionKey;
  if (!secretKey) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  if (!value) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(value, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
};

const encryptedStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(key);
    return value ? decryptPayload(value) : null;
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, encryptPayload(value));
  },
  removeItem: (key) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};

export const useAuthStore = defineStore(
  "matta_user",
  () => {
    const route = useRoute();
    const { encrypt } = useEncryption();
    const appList = ref([]);
    const kycStatus = ref(null);
    const mattaAuth = useEncryptedCookie(AUTH_COOKIE_NAME, defaultOptions);
    const mattaProfiles = useEncryptedCookie(
      PROFILE_COOKIE_NAME,
      defaultOptions,
    );
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

    function setKyCStatus(status) {
      let userInfo = { ...loggedUser?.value, kycStatus: status };
      setLoggedUser(userInfo);
      kycStatus.value = status;
    }

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
        (existingObj) => existingObj?.jwToken === obj?.jwToken,
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
            url: `${i.url}/auth/validate?token=${encodeURIComponent(
              encrypt(jwToken.value),
            )}&code=${encodeURIComponent(encrypt(refreshToken.value))}`,
            defaultUrl: i.url,
          }));
          setAppList(rows);
        }
      });
    }
    function removeObjectByToken(jwToken) {
      authUsers.value = authUsers?.value?.filter(
        (obj) => obj.jwToken !== jwToken,
      );
    }
    const clearAuth = () => {
      clearCookies().then(() => {
        mattaAuth.value = null;
        loggedUser.value = null;
        mattaProfiles.value = null;
        handleAppRedirect(route.params.appId, route);
      });
    };
    const logOut = async () => {
      try {
        isLoggingOut.value = true;
        const response = await logoutUser({
          token: jwToken.value,
          refreshToken: refreshToken.value,
        });
        if (response.status === 200) {
          localStorage.removeItem("matta_user");
          isLoggingOut.value = false;

          clearAuth();
        }
      } catch (error) {
        isLoggingOut.value = false;

        clearAuth();
      }
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
      setKyCStatus,
      kycStatus,
    };
  },
  {
    persist: {
      key: "matta_user",
      storage: encryptedStorage,
    },
  },
);
