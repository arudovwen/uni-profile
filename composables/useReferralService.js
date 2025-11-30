// composables/useReferralService.js
import urls from "../helpers/url_helpers";
import { useApi } from "~/composables/useApi";

export const useReferralService = () => {
  const { post, put, get } = useApi();

  const createReferral = async (data) => {
    return await post(urls.CREATE_REFERRAL, data);
  };

  const updateReferral = async (data) => {
    return await put(urls.UPDATE_REFERRAL, data);
  };

  const getReferral = async (id) => {
    return await get(urls.GET_REFERRAL(id));
  };

  const getReferrals = async () => {
    return await get(urls.GET_REFERRALS);
  };

  return {
    createReferral,
    updateReferral,
    getReferral,
    getReferrals,
  };
};
