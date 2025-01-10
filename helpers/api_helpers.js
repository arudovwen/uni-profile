import Axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { toast } from "vue3-toastify";

const API_URL = "https://dev.gateway.oxide.matta.trade/api/";
const SSO_URL = "https://dev.sso.matta.trade/api/";
const WALLET_URL = "https://dev.wallets.matta.trade/api/";
const Matta_URL = "https://dev.gateway.matta.trade/api/";
const DELTALOG_URL = "https://dev.gateway.deltalog.co/api/";
const ORBITAL_URL = "https://dev.market.matta.trade/api/";

const createAxiosInstance = (baseURL) => {
  const instance = Axios.create({ baseURL });
  instance.defaults.withCredentials = true;
  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    config.headers.Authorization = authStore?.access_token
      ? `Bearer ${authStore.access_token}`
      : "";
    config.headers.Accept = "application/json";
    return config;
  });
  return instance;
};

const axiosApi = createAxiosInstance(API_URL);
const axiosSSO = createAxiosInstance(SSO_URL);
const mattaApi = createAxiosInstance(Matta_URL);
const walletApi = createAxiosInstance(WALLET_URL);
const deltaApi = createAxiosInstance(DELTALOG_URL);
const orbitalAPi = createAxiosInstance(ORBITAL_URL);

// Handle token refresh logic
const handleTokenRefresh = async () => {
  const authStore = useAuthStore();
  try {
    const { data } = await axiosApi.post("/v1/Account/refreshtoken", {
      token: authStore.refresh_token,
      ipAddress: "",
    });

    authStore.setAccessToken(data.jwToken);
    authStore.setRefreshToken(data.refreshToken);
    axiosApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.jwToken}`;
    return data.jwToken;
  } catch (error) {
    throw error;
  }
};

// Response interceptor for handling token refresh
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 403) {
      try {
        const newAccessToken = await handleTokenRefresh();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosApi.request(error.config);
      } catch (refreshError) {
        handleRefreshError(refreshError);
        return Promise.reject(refreshError);
      }
    } else {
      return Promise.reject(error);
    }
  }
);
axiosSSO.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 403) {
      try {
        const newAccessToken = await handleTokenRefresh();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosSSO.request(error.config);
      } catch (refreshError) {
        handleRefreshError(refreshError);
        return Promise.reject(refreshError);
      }
    } else if (error?.response?.status === 401) {
      handleRefreshError();
    } else {
      return Promise.reject(error);
    }
  }
);

// Handle errors when refreshing token
const handleRefreshError = (error) => {
  const authStore = useAuthStore();
  authStore.setLoggedUser(null);
  window.location.href = `/auth/login?info=session_expired&redirected_from=${window.location.href}`;
};

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

// General API methods for mattaApi
export const mattaGet = (url, config = {}) => mattaApi.get(url);
export const mattaPost = (url, data, config = {}) =>
  mattaApi.post(url, data, config);
export const mattaPut = (url, data, config = {}) => mattaApi.put(url, data);
export const mattaDelete = (url, config = {}) => mattaApi.delete(url, config);

// General API methods for ssoApi
export const ssoGet = (url, config = {}) => axiosSSO.get(url, config);
export const ssoPost = (url, data, config = {}) =>
  axiosSSO.post(url, data, config);
export const ssoPut = (url, data, config = {}) =>
  axiosSSO.put(url, data, config);
export const ssoDelete = (url, config = {}) => axiosSSO.delete(url, config);

// General API methods for mattaApi
export const walletGet = (url, config = {}) => walletApi.get(url);
export const walletPost = (url, data, config = {}) =>
  walletApi.post(url, data, config);
export const walletPut = (url, data, config = {}) => walletApi.put(url, data);
export const walletDelete = (url, config = {}) => walletApi.delete(url, config);

// General API methods for deltalog
export const deltaGet = (url, config = {}) => deltaApi.get(url);
export const deltaPost = (url, data, config = {}) =>
  deltaApi.post(url, data, config);
export const deltaPut = (url, data, config = {}) => deltaApi.put(url, data);
export const delataDelete = (url, config = {}) => deltaApi.delete(url, config);

// General API methods for ORBITAL
export const orbitalGet = (url, config = {}) => orbitalAPi.get(url);
export const orbitalPost = (url, data, config = {}) =>
  orbitalAPi.post(url, data, config);
export const orbitalPut = (url, data, config = {}) => orbitalAPi.put(url, data);
export const orbitalDelete = (url, config = {}) =>
  orbitalAPi.delete(url, config);
