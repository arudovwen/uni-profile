import { marketPost, oxidePost, polymerPost } from "~/helpers/api_helpers";
import urls from "../helpers/url_helpers";
import {
  ssoPost,
  ssoGet,
  mattaGet,
  mattaPost,
  deltaPost,
  orbitalPost,
  oxideProPost,
} from "../services/api_services";
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
export async function getTokenInfo(config = {}) {
  return await ssoPost(`${urls.GET_TOKEN_INFORMATION}`, {}, config);
}
export async function registerInvitedUser(user, config = {}) {
  return await ssoPost(urls.REGISTER_INVITED_USER, user, config);
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

// Matta Register endpoint
export async function registerUser(user, config = {}) {
  // return await mattaPost(urls.REGISTER, user, config);
  return await ssoPost(urls.REGISTER, user, config);
}

// Confirm Email endpoint (POST with email and code)
export async function confirmEmail(email, code, config = {}) {
  return await ssoPost(urls.MATTA_CONFIRM_EMAIL, { code, email }, config);
}

// Matta Resend 2FA code endpoint
export async function resendEmailVerification(email, config = {}) {
  return await ssoPost(urls.MATTA_RESEND_2FA, { email }, config);
}

export async function signUpWithMatta(data, config = {}) {
  return await ssoPost(`${urls.SIGN_UP_WITH_MATTA}`, data, config);
}

export async function signUpWithMattaOrbital(data, config = {}) {
  return await marketPost(`${urls.SIGN_UP_WITH_MATTA_ORBITAL}`, data, config);
}

export async function signUpWithMattaFlux(data, config = {}) {
  return await deltaPost(`${urls.SIGN_UP_WITH_MATTA_FLUX}`, data, config);
}
export async function signUpWithMattaOxidePro(data, config = {}) {
  return await oxidePost(
    `${urls.SIGN_UP_WITH_MATTA_OXIDE_PRO}?tenant=${data.tenant}&slug=${data.slug}`,
    data,
    config,
  );
}

export async function signUpWithMattaPolymer(data, config = {}) {
  return await polymerPost(`${urls.SIGN_UP_WITH_MATTA_POLYMER}`, data, config);
}

export async function getUserApps(version = "1", params = {}, config = {}) {
  const queryString = new URLSearchParams(params).toString();
  return await ssoGet(
    `${urls.GET_USER_APPS(version)}${queryString ? `?${queryString}` : ""}`,
    config,
  );
}
