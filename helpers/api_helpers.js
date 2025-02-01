import Axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { toast } from "vue3-toastify";

const API_URL = "https://dev.gateway.oxide.matta.trade/api/";
const SSO_URL = "https://dev.sso.matta.trade/api/";
const WALLET_URL = "https://dev.wallets.matta.trade/api/";
const Matta_URL = "https://dev.gateway.matta.trade/api/";
const DELTALOG_URL = "https://dev.gateway.deltalog.co/api/";
const ORBITAL_URL = "https://dev.market.matta.trade/api/";

let isRefreshing = false;
let pendingRequests = [];
let count = 0;
// Handle token refresh logic with locking mechanism
const handleTokenRefresh = async () => {
  const authStore = useAuthStore();

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const { data } = await axiosSSO.post("/v1/Account/refreshtoken", {
        token: authStore.refresh_token,
        ipAddress: "",
      });

      authStore.setAccessToken(data.jwToken);
      authStore.setRefreshToken(data.refreshToken);

      // Resolve pending requests
      pendingRequests.forEach((callback) => callback(data.jwToken));
      pendingRequests = [];
      return data.jwToken;
    } catch (error) {
      pendingRequests.forEach((callback) => callback(null));
      pendingRequests = [];
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  // Wait for the refresh to complete
  return new Promise((resolve, reject) => {
    pendingRequests.push((newToken) => {
      if (newToken) {
        resolve(newToken);
      } else {
        reject(new Error("Token refresh failed"));
      }
    });
  });
};

// Handle errors when refreshing token
const handleRefreshError = () => {
  count++;
  if (count == 3) {
    authStore.clearAuth();
  }
  const authStore = useAuthStore();
  authStore.logOut();
};

// Create Axios instances with interceptors
const createAxiosInstance = (baseURL) => {
  const instance = Axios.create({ baseURL });
  instance.defaults.withCredentials = true;

  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    config.headers.Authorization = authStore?.jwToken
      ? `Bearer ${authStore.jwToken}`
      : "";
    config.headers.Accept = "application/json";
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        try {
          const newAccessToken = await handleTokenRefresh();
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance.request(error.config);
        } catch (refreshError) {
          handleRefreshError();
          return Promise.reject(refreshError);
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

// Axios instances
const axiosApi = createAxiosInstance(API_URL);
const axiosSSO = createAxiosInstance(SSO_URL);
const mattaApi = createAxiosInstance(Matta_URL);
const walletApi = createAxiosInstance(WALLET_URL);
const deltaApi = createAxiosInstance(DELTALOG_URL);
const orbitalApi = createAxiosInstance(ORBITAL_URL);

// General API methods
export const apiGet = (url, config = {}) => axiosApi.get(url, config);
export const apiPost = (url, data, config = {}) =>
  axiosApi.post(url, data, config);
export const apiPut = (url, data, config = {}) =>
  axiosApi.put(url, data, config);
export const apiDelete = (url, config = {}) => axiosApi.delete(url, config);

export const get = (url, config = {}) => axiosApi.get(url, config);
export const post = (url, data, config = {}) =>
  axiosApi.post(url, data, config);
export const put = (url, data, config = {}) => axiosApi.put(url, data, config);
export const del = (url, config = {}) => axiosApi.delete(url, config);

// Matta API methods
export const mattaGet = (url, config = {}) => mattaApi.get(url, config);
export const mattaPost = (url, data, config = {}) =>
  mattaApi.post(url, data, config);
export const mattaPut = (url, data, config = {}) =>
  mattaApi.put(url, data, config);
export const mattaDelete = (url, config = {}) => mattaApi.delete(url, config);

// SSO API methods
export const ssoGet = (url, config = {}) => axiosSSO.get(url, config);
export const ssoPost = (url, data, config = {}) =>
  axiosSSO.post(url, data, config);
export const ssoPut = (url, data, config = {}) =>
  axiosSSO.put(url, data, config);
export const ssoDelete = (url, config = {}) => axiosSSO.delete(url, config);

// Wallet API methods
export const walletGet = (url, config = {}) => walletApi.get(url, config);
export const walletPost = (url, data, config = {}) =>
  walletApi.post(url, data, config);
export const walletPut = (url, data, config = {}) =>
  walletApi.put(url, data, config);
export const walletDelete = (url, config = {}) => walletApi.delete(url, config);

// Deltalog API methods
export const deltaGet = (url, config = {}) => deltaApi.get(url, config);
export const deltaPost = (url, data, config = {}) =>
  deltaApi.post(url, data, config);
export const deltaPut = (url, data, config = {}) =>
  deltaApi.put(url, data, config);
export const deltaDelete = (url, config = {}) => deltaApi.delete(url, config);

// Orbital API methods
export const orbitalGet = (url, config = {}) => orbitalApi.get(url, config);
export const orbitalPost = (url, data, config = {}) =>
  orbitalApi.post(url, data, config);
export const orbitalPut = (url, data, config = {}) =>
  orbitalApi.put(url, data, config);
export const orbitalDelete = (url, config = {}) =>
  orbitalApi.delete(url, config);
