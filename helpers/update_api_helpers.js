import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { useAuthStore } from "~/stores/auth";
import { toast } from "vue3-toastify";

// Setup cache (if needed)
// const axios = setupCache(Axios);

// Function to create an Axios instance with a variable base URL
export const createApiClient = (baseURL) => {
  const axiosApi = Axios.create({
    baseURL,
  });

  axiosApi.defaults.withCredentials = true;
  axiosApi.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    config.headers.Authorization = authStore?.jwToken
      ? `Bearer ${authStore?.jwToken}`
      : "";
    config.headers.Accept = "application/json";
    return config;
  });

  const handleTokenRefresh = async () => {
    const authStore = useAuthStore();
    try {
      const refreshResponse = await axiosApi.post("/v1/Account/refreshtoken", {
        token: authStore.refresh_token,
        ipAddress: "",
      });

      const newAccessToken = refreshResponse.data.jwToken;
      const newRefreshToken = refreshResponse.data.refreshToken;
      authStore.setAccessToken(newAccessToken);
      authStore.setRefreshToken(newRefreshToken);
      axiosApi.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      return newAccessToken;
    } catch (refreshError) {
      throw refreshError;
    }
  };

  axiosApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 403) {
        try {
          const newAccessToken = await handleTokenRefresh();
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosApi.request(error.config);
        } catch (refreshError) {
          const authStore = useAuthStore();
          if (window.location.pathname !== "/checkout") {
            toast.info("Your session has expired");
            authStore.setLoggedUser(null);
            window.location.href = `/auth/login?info=session_expired&redirected_from=${window.location.href}`;
          }
          return Promise.reject(refreshError);
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return {
    get: (url, config = {}) => axiosApi.get(url, config),
    post: (url, data, config = {}) => axiosApi.post(url, data, config),
    put: (url, data, config = {}) => axiosApi.put(url, data, config),
    del: (url, config = {}) => axiosApi.delete(url, config),
  };
};

// Example usage
// const API_URL = "https://dev.gateway.matta.trade/api/";
// const apiClient = createApiClient(API_URL);