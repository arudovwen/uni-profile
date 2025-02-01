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

export async function oxideConfirmemail(data, config = {}) {
  return await apiPost(`${urls.OXIDE_CONFIRM_EMAIL}`, data, config);
}
export async function oxideRegisterUser(user, config = {}) {
  return await apiPost(urls.OXIDE_FLUX_REGISTER, user, config);
}
export async function oxideOnboardingSignup(user, config = {}) {
  return await apiPost(urls.OXIDE_ONBOARDING_SIGNUP, user, config);
}

export async function fluxConfirmemail(data, config = {}) {
  return await ssoPost(`${urls.FLUX_CONFIRM_EMAIL}`, data, config);
}
export async function fluxRegisterUser(data, config = {}) {
  return await deltaPost(`${urls.OXIDE_FLUX_REGISTER}`, data, config);
}
export async function fluxOnboardingSignup(user, config = {}) {
  return await deltaPost(urls.OXIDE_ONBOARDING_SIGNUP, user, config);
}

export async function confirmRegister(data, config = {}) {
  return await ssoPost(`${urls.ORBITAL_CONFIRM_EMAIL}`, data, config);
}
export async function registerUser(user, config = {}) {
  return await ssoPost(urls.REGISTER, user, config);
}
export async function orbitalOnboardingSignup(user, config = {}) {
  return await orbitalPost(urls.OXIDE_ONBOARDING_SIGNUP, user, config);
}

export async function mattaConfirmemail(data, config = {}) {
  return await mattaPost(`${urls.CONFIRM_2FA}`, data, config);
}
export async function mattaRegisterUser(user, config = {}) {
  return await mattaPost(urls.ORBITAL_REGISTER, user, config);
}
export async function mattaOnboardingSignup(user, config = {}) {
  return await mattaPost(urls.OXIDE_ONBOARDING_SIGNUP, user, config);
}
