import urls from "../helpers/url_helpers";
import { post, get, put, ssoPost } from "../helpers/api_helpers";
import store from "../store";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};
//Authentication

export async function getUserInfo() {
  return await get(urls.GET_USER_INFO, config);
}

export async function changePassword(data) {
  return await ssoPost(`${urls.CHANGE_PASSWORD}`, data);
}
