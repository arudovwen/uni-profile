import Axios from "axios";
import { toast } from "vue3-toastify";

// Max refresh attempts
const MAX_REFRESH_ATTEMPTS = 2;
let refreshAttemptCount = 0;
let hasLoggedOut = false; // Track if logout has already been called

// Base URL for API services
const BASE_URL = "http://dev.proxy.oxidefinance.com";

// Create an Axios instance with custom configuration
const createAxiosInstance = (service) => {
  const instance = Axios.create({
    baseURL: `${BASE_URL}/${service}/`,
  });

  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    config.headers.Authorization = authStore?.jwToken
      ? `Bearer ${authStore.jwToken}`
      : config.headers.Authorization || "";
    config.headers.Accept = "application/json";
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if ([403].includes(error?.response?.status)) {
        try {
          const newAccessToken = await handleTokenRefresh();
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance.request(error.config);
        } catch (refreshError) {
          handleRefreshError();
          return Promise.reject(refreshError);
        }
      }
      if ([401].includes(error?.response?.status)) {
        toast.error(error?.response?.data?.Message || "Unauthorised access!");
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create axios instances for each service
const axiosApi = createAxiosInstance("matta");
const axiosSSO = createAxiosInstance("sso");
const marketApi = createAxiosInstance("market");
const walletApi = createAxiosInstance("wallet");
const deltaApi = createAxiosInstance("flux");
const currencyApi = createAxiosInstance("currency");
const oxideApi = createAxiosInstance("oxide");
const notificationApi = createAxiosInstance("notification");
// Handle token refresh logic
const handleTokenRefresh = async () => {
  const authStore = useAuthStore();
  if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
    authStore.signOut();
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
    throw error; // Don't clear auth here, handled later in the error handler
  }
};

// Handle errors when refreshing token
const handleRefreshError = () => {
  const authStore = useAuthStore();
  if (hasLoggedOut) return; // Ensure logout only happens once
  if (window.location.pathname !== "/checkout") {
    toast.info("Your session has expired");
    hasLoggedOut = true; // Flag logout to prevent multiple logouts
    authStore.logOut(); // Perform the logout only once
  }
};

// General API methods for each service
const createApiMethods = (apiInstance) => ({
  get: (url, config = {}) => apiInstance.get(url, config),
  post: (url, data, config = {}) => apiInstance.post(url, data, config),
  put: (url, data, config = {}) => apiInstance.put(url, data, config),
  delete: (url, config = {}) => apiInstance.delete(url, config),
});

// Create API methods for each service
export const apiMethods = createApiMethods(axiosApi);
export const marketMethods = createApiMethods(marketApi);
export const ssoMethods = createApiMethods(axiosSSO);
export const walletMethods = createApiMethods(walletApi);
export const deltaMethods = createApiMethods(deltaApi);
export const currencyMethods = createApiMethods(currencyApi);
export const oxideMethods = createApiMethods(oxideApi);
export const notificationMethods = createApiMethods(notificationApi);


// Export the API methods
export const { get, post, put, delete: del } = apiMethods;
export const marketGet = marketMethods.get;
export const marketPost = marketMethods.post;
export const marketPut = marketMethods.put;
export const marketDelete = marketMethods.delete;

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
