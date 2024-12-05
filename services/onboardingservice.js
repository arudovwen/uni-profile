import urls from "../helpers/url_helpers";
import { post, get, mattaPost } from "../helpers/api_helpers";
import store from "../store";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};
//Authentication

export async function updatePersonalInfo(user) {
  return await post(urls.COMPANY_UPDATE_PERSONAL_INFO, user, config);
}
export async function additionalInfo(user) {
  return await post(urls.COMPANY_UPDATE_ADDITIONAL_INFORMATION, user, config);
}
export async function inviteUsers(user) {
  return await post(urls.COMPANY_INVITE_USERS, user, config);
}
export async function getOnboarding() {
  return await get(urls.GET_ONBOARDING_INFO, config);
}

export async function uploadfile(data) {
  return await mattaPost(urls.UPLOAD_FILE, data, config);
}
export async function uploaddocument(data) {
  return await mattaPost(urls.UPLOAD_DOCUMENT, data, config);
}
export async function setOnboardingcomplete() {
  return await post(urls.SETONBOARDING_COMPLETE, "", config);
}
export async function setaccountype(data) {
  return await post(urls.SET_ACCOUNT_TYPE, data, config);
}
