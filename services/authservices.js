import urls from "../helpers/url_helpers";
import { apiPost, ssoPost } from "../helpers/api_helpers";

//Authentication
export async function loginUser(user, config = {}) {
  return await ssoPost(urls.LOGIN_USER, user, config);
}
export async function loginUser2FA(user, config = {}) {
  return await ssoPost(urls.LOGIN_USER_2FA, user, config);
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
export async function registerUser(user, config = {}) {
  return await apiPost(urls.REGISTER, user, config);
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
export async function confirmemail(data, config = {}) {
  return await apiPost(`${urls.CONFIRM_EMAIL}`, data, config);
}
export async function socialregister(data) {
  return await apiPost(urls.SOCIAL_REGISTER, data);
}

export async function sociallogin(data) {
  return await apiPost(urls.SOCIAL_LOGIN, data);
}
export async function sendMessage(data) {
  return await apiPost(urls.CONTACT_USER, data);
}
