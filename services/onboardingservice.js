import urls from "../helpers/url_helpers";
// import { post } from "../helpers/api_helpers";
import store from "../store";
import { ssoPost, post } from "./api_services";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};
//Authentication

export async function uploadfile(data) {
  return await ssoPost(urls.UPLOAD_FILE, data, config);
}
export async function uploaddocument(data) {
  return await ssoPost(urls.UPLOAD_DOCUMENT, data, config);
}

export async function setaccountype(data) {
  return await post(urls.SET_ACCOUNT_TYPE, data, config);
}
