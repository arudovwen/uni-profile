// composables/useWalletApi.js
import urls from "../helpers/url_helpers";
import { useApi } from "~/composables/useApi";

export const useWalletService = () => {
  const { get, post, put, del } = useApi("wallet");

  const viewSettlement = async () => {
    return await get(urls.VIEW_SETTLEMENT);
  };

  const addSettlement = async (data) => {
    return await post(urls.ADD_SETTLEMENT, data);
  };

  const autoSettlement = async (data) => {
    if (!data) return;
    return await post(urls.AUTO_SETTLEMENT, data);
  };

  const getAutoSettlement = async () => {
    return await get(urls.AUTO_SETTLEMENT_VALUE);
  };

  const updateSettlement = async (data) => {
    return await put(`${urls.UPDATE_SETTLEMENT}/${data.id}`, data);
  };

  const deleteSettlement = async (data) => {
    return await del(`${urls.DELETE_SETTLEMENT}/${data}`);
  };

  const getBanks = async () => {
    return await get(urls.GET_BANKS);
  };

  const validateAccount = async (data) => {
    return await post(urls.VALIDATE_ACCOUNT, data);
  };

  return {
    viewSettlement,
    addSettlement,
    autoSettlement,
    getAutoSettlement,
    updateSettlement,
    deleteSettlement,
    getBanks,
    validateAccount,
  };
};
