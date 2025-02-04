// composables/useApi.js
export const useApi = (service = "sso") => {
  const { $oxideApi, $ssoApi, $mattaApi, $walletApi, $deltaApi, $orbitalApi } =
    useNuxtApp();

  const ApiService = {
    sso: $ssoApi,
    oxide: $oxideApi,
    matta: $mattaApi,
    wallet: $walletApi,
    flux: $deltaApi,
    orbital: $orbitalApi,
  };
  const get = (url, config = {}) => ApiService[service].get(url, config);
  const post = (url, data, config = {}) =>
    ApiService[service].post(url, data, config);
  const put = (url, data, config = {}) =>
    ApiService[service].put(url, data, config);
  const del = (url, config = {}) => ApiService[service].delete(url, config);

  return { get, post, put, del };
};
