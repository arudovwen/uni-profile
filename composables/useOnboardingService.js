// composables/useCompanyApi.js
import urls from "../helpers/url_helpers";
import { useApi } from "~/composables/useApi";

export const useOnboardingService = () => {
  const { post, get } = useApi();
  const { post: mattaPost } = useApi("matta");

  const updatePersonalInfo = async (user) => {
    return await post(urls.COMPANY_UPDATE_PERSONAL_INFO, user);
  };

  const additionalInfo = async (user) => {
    return await post(urls.COMPANY_UPDATE_ADDITIONAL_INFORMATION, user);
  };

  const inviteUsers = async (user) => {
    return await post(urls.COMPANY_INVITE_USERS, user);
  };

  const getOnboarding = async () => {
    return await get(urls.GET_ONBOARDING_INFO);
  };

  const uploadfile = async (data) => {
    return await mattaPost(urls.UPLOAD_FILE, data);
  };

  const uploaddocument = async (data) => {
    return await mattaPost(urls.UPLOAD_DOCUMENT, data);
  };

  const setOnboardingcomplete = async () => {
    return await post(urls.SETONBOARDING_COMPLETE, "");
  };

  const setaccountype = async (data) => {
    return await post(urls.SET_ACCOUNT_TYPE, data);
  };

  return {
    updatePersonalInfo,
    additionalInfo,
    inviteUsers,
    getOnboarding,
    uploadfile,
    uploaddocument,
    setOnboardingcomplete,
    setaccountype,
  };
};
