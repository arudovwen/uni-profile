import Axios from "axios";

// Max refresh attempts
const MAX_REFRESH_ATTEMPTS = 3;
let refreshAttemptCount = 0;

// Base URL for API services
const BASE_URL = "https://dev.gateway.matta.trade";

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
      if ([401, 403].includes(error?.response?.status)) {
        try {
          const newAccessToken = await handleTokenRefresh();
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance.request(error.config);
        } catch (refreshError) {
          handleRefreshError();
          return Promise.reject(refreshError);
        }
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
      token: authStore.refresh_token,
      ipAddress: "",
    });

    authStore.setAccessToken(data.jwToken);
    authStore.setRefreshToken(data.refreshToken);
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${data.jwToken}`;
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
