import urls from "../helpers/url_helpers";
import {
  post,
  get,
  put,
  ssoPost,
  ssoGet,
  ssoPut,
} from "../helpers/api_helpers";
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
export async function addCustomer(data) {
  return await ssoPost(`${urls.CHANGE_PASSWORD}`, data);
}

export async function addSubApp(data) {
  return await ssoPost(`${urls.ADD_SUBAPP}`, data);
}

export async function getSubApps(data) {
  return await ssoGet(`${urls.GET_SUBAPPS}`, data);
}
export async function getSubApp(data) {
  return await ssoGet(`${urls.GET_SUBAPP(id)}`, data);
}
export async function editSubApp(data) {
  return await ssoPut(`${urls.UPDATE_SUBAPP}`, data);
}
