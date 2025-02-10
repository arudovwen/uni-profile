import urls from "../helpers/url_helpers";
import {
  post,
  get,
  put,
  ssoPost,
  ssoGet,
  ssoPut,
  ssoDelete,
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
  return await ssoGet(`${urls.GET_SUBAPPS}`, {});
}
export async function getSubApp(id) {
  return await ssoGet(`${urls.GET_SUBAPP(id)}`, {});
}
export async function editSubApp(data) {
  return await ssoPut(`${urls.UPDATE_SUBAPP}`, data);
}

export async function sendAdminInvite(data) {
  return await ssoPost(`${urls.INVITATION}/send-admin-invite`, data);
}

export async function resendAdminInvite(data) {
  return await ssoPost(`${urls.INVITATION}/re-send-admin-invite`, data);
}

export async function getSingleInvite(id) {
  return await ssoGet(`${urls.INVITATION}/invites/${id}`, {});
}

export async function delSingleInvite(id) {
  return await ssoDelete(`${urls.INVITATION}/invites/${id}`, {});
}
export async function getAllinvites(payload) {
  return await ssoGet(
    `${urls.INVITATION}/get-invites?${new URLSearchParams(payload)}`,
    {}
  );
}

export async function getAllUsers(payload) {
  return await ssoPost(`${urls.GET_ALL_USERS}`, cleanObject(payload));
}

export async function toggleUserStatus(email) {
  return await ssoPost(`${urls.TOGGLE_USER(email)}`, {});
}


export async function getOwnerinvites(payload) {
  return await ssoGet(
    `${urls.INVITATION}/get-invites?${new URLSearchParams(payload)}`,
    {}
  );
}

export async function getOwnerMembers(payload) {
  return await ssoPost(`${urls.OWNER_GET_MEMBERS}`, cleanObject(payload));
}

export async function toggleMemberStatus(email) {
  return await ssoPost(`${urls.OWNER_TOGGLE_STATUS(email)}`, {});
}

export async function sendOwnerInvite(data) {
  return await ssoPost(`${urls.OWNER_SEND_INVITE}`, data);
}


export async function registerMember(data) {
  return await ssoPost(`${urls.OWNERS_REGISTER_MEMBER}`, data);
}

export async function ownerDisableUser(data) {
  return await ssoPost(`${urls.OWNER_DISABLE_USER}/${data}`, {});
}

export async function ownerRevokeAccess(data) {
  return await ssoPost(`${urls.OWNER_DISABLE_USER}`, data);
}