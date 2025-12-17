// composables/useAuthApi.js
import urls from "../helpers/url_helpers";
import { useApi } from "~/composables/useApi";

export const useAuthService = () => {
  const { post } = useApi();

  const loginUser = async (user, config = {}) => {
    return await post(urls.LOGIN_USER, cleanObject(user), config);
  };

  const loginUser2FA = async (user, config = {}) => {
    return await post(urls.LOGIN_USER_2FA, cleanObject(user), config);
  };

  const confirm2FA = async (user, config = {}) => {
    return await post(urls.CONFIRM_2FA, user, config);
  };

  const logoutUser = async (user, config = {}) => {
    return await post(urls.LOGIN_OUT, user, config);
  };

  const logOut = () => {
    const authStore = useAuthStore();
    authStore.logOut();
  };

  const forgotPassword = async (user, config = {}) => {
    return await post(urls.FORGOT_PASSWORD, cleanObject(user), config);
  };

  const resendVerification = async (data, config = {}) => {
    return await post(urls.RESEND_VERIFICATION, cleanObject(data), config);
  };

  const resetPassword = async (user, config = {}) => {
    return await post(urls.RESET_PASSWORD, cleanObject(user), config);
  };

  const resend2FA = async (data, config = {}) => {
    return await post(urls.RESEND_2FA_OTP, data, config);
  };

  const confirmAuthEmail = async (data, config = {}) => {
    return await post(urls.FLUX_CONFIRM_EMAIL, data, config);
  };

  const confirmRegister = async (data, config = {}) => {
    return await post(urls.ORBITAL_CONFIRM_EMAIL, data, config);
  };

  const registerUser = async (user, config = {}) => {
    return await post(urls.REGISTER, user, config);
  };

  return {
    loginUser,
    loginUser2FA,
    confirm2FA,
    logoutUser,
    logOut,
    forgotPassword,
    resendVerification,
    resetPassword,
    resend2FA,
    confirmAuthEmail,
    confirmRegister,
    registerUser,
  };
};
