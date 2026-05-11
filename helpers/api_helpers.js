import Axios from "axios";
import { toast } from "vue3-toastify";

const MAX_REFRESH_ATTEMPTS = 2;
let refreshAttemptCount = 0;
let hasLoggedOut = false;
// Cache the resolved base URL so useRuntimeConfig is only called once
let _cachedBaseUrl = null;
const getBaseUrl = () => {
  if (_cachedBaseUrl) return _cachedBaseUrl;
  try {
    const config = useRuntimeConfig();
    _cachedBaseUrl = config?.public?.API_BASE_URL || "";
    return _cachedBaseUrl;
  } catch {
    return "";
  }
};
const isBrowser = typeof window !== "undefined";

const SENSITIVE_FIELDS = [
  "email",
  "password",
  "confirmPassword",
  "newPassword",
  "oldPassword",
];

const defaultEncryption = {
  encrypt: (value) => value,
  decrypt: (value) => value,
};

const getEncryption = () => {
  if (typeof useEncryption !== "function") {
    return defaultEncryption;
  }

  try {
    const encryption = useEncryption();
    if (
      encryption &&
      typeof encryption.encrypt === "function" &&
      typeof encryption.decrypt === "function"
    ) {
      return encryption;
    }
  } catch {
    // useEncryption not available outside Nuxt context
  }

  return defaultEncryption;
};

const getAuthStore = () => {
  if (typeof useAuthStore !== "function") {
    return null;
  }

  try {
    return useAuthStore();
  } catch {
    return null;
  }
};

const normalizeHeaders = (headers = {}) => ({
  ...headers,
  Accept: "application/json",
});

const encryptFields = (payload, encrypt) => {
  if (!payload || typeof payload !== "object") return payload;

  const data = Array.isArray(payload) ? [...payload] : { ...payload };

  SENSITIVE_FIELDS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key]) {
      data[key] = encrypt(data[key]);
    }
  });

  return data;
};

const decryptFields = (payload, decrypt) => {
  if (!payload || typeof payload !== "object") return payload;

  const data = Array.isArray(payload) ? [...payload] : { ...payload };

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value === null || value === undefined) return;

    if (SENSITIVE_FIELDS.includes(key)) {
      try {
        data[key] = decrypt(value);
      } catch {
        data[key] = value;
      }
    } else if (typeof value === "object") {
      data[key] = decryptFields(value, decrypt);
    }
  });

  return data;
};

const createAxiosInstance = (service, baseUrl) => {
  // Create instance without a baseURL — resolved lazily per-request
  // because useRuntimeConfig() is not available at module load time.
  const instance = Axios.create();

  instance.interceptors.request.use((config = {}) => {
    // Lazily resolve base URL on first request (Nuxt context is now available)
    if (!config.baseURL) {
      const resolvedBaseUrl = baseUrl || getBaseUrl();
      config.baseURL = `${resolvedBaseUrl}/${service}/`;
    }

    const { encrypt } = getEncryption();
    const authStore = getAuthStore();
    config.headers = normalizeHeaders(config.headers);

    if (authStore?.jwToken) {
      config.headers.Authorization = `Bearer ${authStore.jwToken}`;
    }

    if (config.data && !(config.data instanceof FormData)) {
      config.data = encryptFields(config.data, encrypt);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (response?.data && typeof response.data === "object") {
        const { decrypt } = getEncryption();
        response.data = decryptFields(response.data, decrypt);
      }
      return response;
    },
    async (error) => {
      const status = error?.response?.status;
      const config = error?.config;

      if (status === 403 && config) {
        try {
          if (isBrowser && window.location.href.includes("/auth/logout")) {
            const authStore = getAuthStore();
            authStore?.clearAuth?.();
            return Promise.reject(error);
          }

          const newAccessToken = await handleTokenRefresh();
          config.headers = normalizeHeaders(config.headers);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance.request(config);
        } catch (refreshError) {
          handleRefreshError();
          return Promise.reject(refreshError);
        }
      }

      if (status === 401) {
        toast.error(error?.response?.data?.Message || "Unauthorized access!");
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

const marketApi = createAxiosInstance("market");
const ssoApi = createAxiosInstance("sso");
const mattaApi = createAxiosInstance("matta");
const walletApi = createAxiosInstance("wallet");
const fluxApi = createAxiosInstance("flux");
const currencyApi = createAxiosInstance("currency");
const oxideApi = createAxiosInstance("oxide");
const polymerApi = createAxiosInstance("polymer");
const notificationApi = createAxiosInstance("notification");
const oxideProApi = createAxiosInstance("oxidepro");

const handleTokenRefresh = async () => {
  const authStore = getAuthStore();
  if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
    authStore?.clearAuth?.() ?? authStore?.signOut?.();
    throw new Error("Max refresh attempts reached");
  }

  if (!authStore?.refreshToken) {
    authStore?.clearAuth?.() ?? authStore?.signOut?.();
    throw new Error("No refresh token available");
  }

  try {
    refreshAttemptCount += 1;

    const { data } = await marketApi.post("/v1/Account/refreshtoken", {
      token: authStore.refreshToken,
      ipAddress: "",
    });

    authStore?.setAccessToken?.(data.jwToken);
    authStore?.setRefreshToken?.(data.refreshToken);
    marketApi.defaults.headers.common["Authorization"] = `Bearer ${data.jwToken}`;
    refreshAttemptCount = 0;
    return data.jwToken;
  } catch (error) {
    refreshAttemptCount = 0;
    authStore?.signOut?.() ?? authStore?.clearAuth?.();
    throw error;
  }
};

const handleRefreshError = () => {
  const authStore = getAuthStore();
  if (hasLoggedOut) return;

  if (!isBrowser || window.location.pathname === "/checkout") return;

  toast.info("Your session has expired");
  hasLoggedOut = true;
  authStore?.logOut?.() ?? authStore?.signOut?.() ?? authStore?.clearAuth?.();
};

const createApiMethods = (apiInstance) => ({
  get: (url, config = {}) => apiInstance.get(url, config),
  post: (url, data, config = {}) => apiInstance.post(url, data, config),
  put: (url, data, config = {}) => apiInstance.put(url, data, config),
  delete: (url, config = {}) => apiInstance.delete(url, config),
});

const marketMethods = createApiMethods(marketApi);
const mattaMethods = createApiMethods(mattaApi);
const ssoMethods = createApiMethods(ssoApi);
const walletMethods = createApiMethods(walletApi);
const fluxMethods = createApiMethods(fluxApi);
const currencyMethods = createApiMethods(currencyApi);
const oxideMethods = createApiMethods(oxideApi);
const notificationMethods = createApiMethods(notificationApi);
const polymerMethods = createApiMethods(polymerApi);
const oxideProMethods = createApiMethods(oxideProApi);

export const { get, post, put, delete: del } = marketMethods;
export const mattaGet = mattaMethods.get;
export const mattaPost = mattaMethods.post;
export const mattaPut = mattaMethods.put;
export const mattaDelete = mattaMethods.delete;

export const fluxGet = fluxMethods.get;
export const fluxPost = fluxMethods.post;
export const fluxPut = fluxMethods.put;
export const fluxDelete = fluxMethods.delete;

export const ssoGet = ssoMethods.get;
export const ssoPost = ssoMethods.post;
export const ssoPut = ssoMethods.put;
export const ssoDelete = ssoMethods.delete;

export const walletGet = walletMethods.get;
export const walletPost = walletMethods.post;
export const walletPut = walletMethods.put;
export const walletDelete = walletMethods.delete;

export const orbitalGet = marketMethods.get;
export const orbitalPost = marketMethods.post;
export const orbitalPut = marketMethods.put;
export const orbitalDelete = marketMethods.delete;

export const currencyGet = currencyMethods.get;
export const currencyPost = currencyMethods.post;
export const currencyPut = currencyMethods.put;
export const currencyDelete = currencyMethods.delete;

export const oxideGet = oxideMethods.get;
export const oxidePost = oxideMethods.post;
export const oxidePut = oxideMethods.put;
export const oxideDelete = oxideMethods.delete;

export const polymerGet = polymerMethods.get;
export const polymerPost = polymerMethods.post;
export const polymerPut = polymerMethods.put;
export const polymerDelete = polymerMethods.delete;

export const notificationGet = notificationMethods.get;
export const notificationPost = notificationMethods.post;
export const notificationPut = notificationMethods.put;
export const notificationDelete = notificationMethods.delete;

export const oxideProGet = oxideProMethods.get;
export const oxideProPost = oxideProMethods.post;
export const oxideProPut = oxideProMethods.put;
export const oxideProDelete = oxideProMethods.delete;
