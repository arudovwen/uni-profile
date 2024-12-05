import urls from "../helpers/url_helpers";
import { get, post, del, put, walletGet, walletDelete, walletPut, walletPost } from "../helpers/api_helpers";
import store from "../store";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};

export const viewSettlement = () => {
  return walletGet(`${urls.VIEW_SETTLEMENT}`, config);
};

export const addSettlement = (data) => {
  return walletPost(`${urls.ADD_SETTLEMENT}`, data, config);
};

export const autoSettlement = (data) => {
  if (!data) return;
  return walletPost(`${urls.AUTO_SETTLEMENT}`, data, config);
};
export const getAutoSettlement = () => {
  return walletGet(`${urls.AUTO_SETTLEMENT_VALUE}`, config);
};
export const updateSettlement = (data) => {
  return walletPut(`${urls.UPDATE_SETTLEMENT}/${data.id}`, data, config);
};

export const deleteSettlement = (data) => {
  return walletDelete(`${urls.DELETE_SETTLEMENT}/${data}`, config);
};

export const getBanks = () => {
  return walletGet(
    `${urls.GET_BANKS}`,

    config
  );
};

export const validateAccount = (data) => {
  return walletPost(`${urls.VALIDATE_ACCOUNT}`, data, config);
};