// plugins/axios.js
import axios from "axios";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const API_BASE_URL = config.public.API_BASE_URL;

  // Reactive state for token refresh
  const isRefreshing = ref(false);
  const pendingRequests = ref([]);
  const refreshCount = ref(0);

  // Handle token refresh logic
  const handleTokenRefresh = async () => {
    if (!isRefreshing.value) {
      isRefreshing.value = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/sso/v1/Account/refreshtoken`, {
          token: authStore.refreshToken,
          ipAddress: "",
        });

        authStore.setAccessToken(data.jwToken);
        authStore.setRefreshToken(data.refreshToken);

        // Resolve pending requests
        pendingRequests.value.forEach((callback) => callback(data.jwToken));
        pendingRequests.value = [];
        return data.jwToken;
      } catch (error) {
        pendingRequests.value.forEach((callback) => callback(null));
        pendingRequests.value = [];
        throw error;
      } finally {
        isRefreshing.value = false;
      }
    }

    // Wait for the refresh to complete
    return new Promise((resolve, reject) => {
      pendingRequests.value.push((newToken) => {
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
    refreshCount.value++;
    if (refreshCount.value === 3) {
      authStore.clearAuth();
      authStore.logOut();
    }
  };

  // Create Axios instances with interceptors
  const createAxiosInstance = (service) => {
    const instance = axios.create({
      baseURL: `${API_BASE_URL}/${service}/`,
      withCredentials: false,
    });

    instance.interceptors.request.use((config) => {
      config.headers.Authorization = authStore?.jwToken
        ? `Bearer ${authStore.jwToken}`
        : "";
      config.headers.Accept = "application/json";
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
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
  const oxideApi = createAxiosInstance("oxide");
  const ssoApi = createAxiosInstance("sso");
  const mattaApi = createAxiosInstance("matta");
  const walletApi = createAxiosInstance("wallet");
  const fluxApi = createAxiosInstance("flux");
  const orbitalApi = createAxiosInstance("market");

  // Provide Axios instances to the Nuxt app
  nuxtApp.provide("oxideApi", oxideApi);
  nuxtApp.provide("ssoApi", ssoApi);
  nuxtApp.provide("mattaApi", mattaApi);
  nuxtApp.provide("walletApi", walletApi);
  nuxtApp.provide("fluxApi", fluxApi);
  nuxtApp.provide("orbitalApi", orbitalApi);
});