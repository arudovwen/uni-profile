import urls from "../helpers/url_helpers";
import { apiPost, deltaPost, mattaGet, mattaPost, orbitalPost, ssoPost } from "../helpers/api_helpers";

//Authentication
export async function loginUser(user, config = {}) {
  return await ssoPost(urls.LOGIN_USER, cleanObject(user), config);
}
export async function loginUser2FA(user, config = {}) {
  return await ssoPost(urls.LOGIN_USER_2FA, cleanObject(user), config);
}
export async function confirm2FA(user, config = {}) {
  return await ssoPost(`${urls.CONFIRM_2FA}`, user, config);
}
export async function logoutUser(user, config = {}) {
  return await ssoPost(urls.LOGIN_OUT, user, config);
}
export async function logOut() {
  const authStore = useAuthStore();
  // googleLogout();
  authStore.logOut();
}

export async function registerInvitedUser(user, config = {}) {
  return await apiPost(urls.REGISTER_INVITED_USER, user, config);
}
export async function forgotPassword(user, config = {}) {
  return await ssoPost(urls.FORGOT_PASSWORD, user, config);
}
export async function resendVerification(data, config = {}) {
  return await ssoPost(urls.RESEND_VERIFICATION, data, config);
}

export async function resetPassword(user, config = {}) {
  return await ssoPost(urls.RESET_PASSWORD, user, config);
}
export async function resend2FA(data, config = {}) {
  return await ssoPost(urls.RESEND_2FA_OTP, data, config);
}

export async function fluxConfirmemail(data, config = {}) {
  return await ssoPost(`${urls.FLUX_CONFIRM_EMAIL}`, data, config);
}

export async function confirmRegister(data, config = {}) {
  return await ssoPost(`${urls.ORBITAL_CONFIRM_EMAIL}`, data, config);
}
export async function registerUser(user, config = {}) {
  return await ssoPost(urls.REGISTER, user, config);
}
