// composables/useProfileApi.js
import urls from "../helpers/url_helpers";
import { useApi } from "~/composables/useApi";

export const useSettingService = () => {
  const { get, put } = useApi();

  const getProfile = async () => {
    return await get(urls.GET_PROFILE);
  };

  const getCompanyProfile = async () => {
    return await get(urls.GET_COMPANY_PROFILE);
  };

  const updateCompanyProfile = async (data) => {
    return await put(urls.BUSINESS_PROFILE, data);
  };

  const getBusinessProfile = async () => {
    return await get(urls.BUSINESS_PROFILE);
  };

  const updateBusinessProfile = async (data) => {
    return await put(urls.BUSINESS_PROFILE, data);
  };

  const getUserProfile = async () => {
    return await get(urls.USER_PROFILE);
  };

  const updateUserProfile = async (data) => {
    return await put(urls.USER_PROFILE, data);
  };

  return {
    getProfile,
    getCompanyProfile,
    updateCompanyProfile,
    getBusinessProfile,
    updateBusinessProfile,
    getUserProfile,
    updateUserProfile,
  };
};
