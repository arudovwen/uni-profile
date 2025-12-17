import Axios from "axios";
import { toast } from "vue3-toastify";

// Max refresh attempts
const MAX_REFRESH_ATTEMPTS = 2;
let refreshAttemptCount = 0;

// Base URL for API services
const BASE_URL = "https://dev.gateway.matta.trade";
const SENSITIVE_FIELDS = [
  "email",
  "password",
  "confirmPassword",
  "newPassword",
  "oldPassword",
];


// Encrypt selected fields
const encryptFields = (payload, encrypt) => {
  if (!payload || typeof payload !== "object") return payload;

  const data = { ...payload };

  SENSITIVE_FIELDS.forEach((key) => {
    if (data[key]) {
      data[key] = encrypt(data[key]);
    }
  });

  return data;
};

// Decrypt selected fields (recursive-safe)
const decryptFields = (payload, decrypt) => {
  if (!payload || typeof payload !== "object") return payload;

  const data = Array.isArray(payload) ? [...payload] : { ...payload };

  Object.keys(data).forEach((key) => {
    if (SENSITIVE_FIELDS.includes(key) && data[key]) {
      try {
        data[key] = decrypt(data[key]);
      } catch {
        /* ignore if not encrypted */
      }
    } else if (typeof data[key] === "object") {
      data[key] = decryptFields(data[key], decrypt);
    }
  });

  return data;
};

// Create an Axios instance with custom configuration
const createAxiosInstance = (service) => {
  const { encrypt, decrypt } = useEncryption();
  const instance = Axios.create({
    baseURL: `${BASE_URL}/${service}/`,
  });

  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    config.headers.Authorization = authStore?.jwToken
      ? `Bearer ${authStore.jwToken}`
      : config.headers.Authorization || "";

    config.headers.Accept = "application/json";
 
    // 🔐 Encrypt sensitive fields (skip FormData)
    if (config.data && !(config.data instanceof FormData)) {
      config.data = encryptFields(config.data, encrypt);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // 🔓 Decrypt sensitive fields in response
      if (response?.data && typeof response.data === "object") {
        response.data = decryptFields(response.data, decrypt);
      }
      return response;
    },
    async (error) => {
      const status = error?.response?.status;

      if (status === 403) {
        try {
          if (window.location.href.includes("/auth/logout")) {
            useAuthStore().clearAuth();
            return Promise.reject(error);
          }

          const newAccessToken = await handleTokenRefresh();
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance.request(error.config);
        } catch (refreshError) {
          handleRefreshError();
          return Promise.reject(refreshError);
        }
      }

      if (status === 401) {
        toast.error(error?.response?.data?.Message || "Unauthorised access!");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosApi = createAxiosInstance("market");
const axiosSSO = createAxiosInstance("sso");
const mattaApi = createAxiosInstance("matta");
const walletApi = createAxiosInstance("wallet");
const deltaApi = createAxiosInstance("flux");
const currencyApi = createAxiosInstance("currency");
const oxideApi = createAxiosInstance("oxide");
const notificationApi = createAxiosInstance("notification");

// Handle token refresh logic
const handleTokenRefresh = async () => {
  const authStore = useAuthStore();
  if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
    authStore.clearAuth();
    throw new Error("Max refresh attempts reached");
  }

  try {
    refreshAttemptCount += 1;

    const { data } = await axiosApi.post("/v1/Account/refreshtoken", {
      token: authStore.refreshToken,
      ipAddress: "",
    });

    authStore.setAccessToken(data.jwToken);
    authStore.setRefreshToken(data.refreshToken);
    axiosApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.jwToken}`;
    return data.jwToken;
  } catch (error) {
    authStore.signOut();
    throw error;
  }
};

// Handle errors when refreshing token
const handleRefreshError = () => {
  const authStore = useAuthStore();
  authStore.logOut();
};

const createApiMethods = (apiInstance) => ({
  get: (url, config = {}) => apiInstance.get(url, config),
  post: (url, data, config = {}) => apiInstance.post(url, data, config),
  put: (url, data, config = {}) => apiInstance.put(url, data, config),
  delete: (url, config = {}) => apiInstance.delete(url, config),
});

const apiMethods = createApiMethods(axiosApi);
const mattaMethods = createApiMethods(mattaApi);
const ssoMethods = createApiMethods(axiosSSO);
const walletMethods = createApiMethods(walletApi);
const deltaMethods = createApiMethods(deltaApi);
export const currencyMethods = createApiMethods(currencyApi);
export const oxideMethods = createApiMethods(oxideApi);
export const notificationMethods = createApiMethods(notificationApi);

// Export the API methods
export const { get, post, put, delete: del } = apiMethods;
export const mattaGet = mattaMethods.get;
export const mattaPost = mattaMethods.post;
export const mattaPut = mattaMethods.put;
export const mattaDelete = mattaMethods.delete;

export const ssoGet = ssoMethods.get;
export const ssoPost = ssoMethods.post;
export const ssoPut = ssoMethods.put;
export const ssoDelete = ssoMethods.delete;

export const walletGet = walletMethods.get;
export const walletPost = walletMethods.post;
export const walletPut = walletMethods.put;
export const walletDelete = walletMethods.delete;

export const deltaGet = deltaMethods.get;
export const deltaPost = deltaMethods.post;
export const deltaPut = deltaMethods.put;
export const deltaDelete = deltaMethods.delete;


export const currencyGet = currencyMethods.get;
export const currencyPost = currencyMethods.post;
export const currencyPut = currencyMethods.put;
export const currencyDelete = currencyMethods.delete;

export const oxideGet = oxideMethods.get;
export const oxidePost = oxideMethods.post;
export const oxidePut = oxideMethods.put;
export const oxideDelete = oxideMethods.delete;


export const notificationGet = notificationMethods.get;
export const notificationPost = notificationMethods.post;
export const notificationPut = notificationMethods.put;
export const notificationDelete = notificationMethods.delete;
