import urls from "../helpers/url_helpers";
import { post, get, mattaPost } from "../helpers/api_helpers";
import store from "../store";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};
//Authentication

export async function uploadfile(data) {
  return await mattaPost(urls.UPLOAD_FILE, data, config);
}
export async function uploaddocument(data) {
  return await mattaPost(urls.UPLOAD_DOCUMENT, data, config);
}

export async function setaccountype(data) {
  return await post(urls.SET_ACCOUNT_TYPE, data, config);
}
