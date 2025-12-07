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
  return await ssoGet(`${urls.GET_SUBAPPS}?${new URLSearchParams(data)}`, {});
}
export async function getSubApp(id) {
  return await ssoGet(`${urls.GET_SUBAPP(id)}`, {});
}
export async function editSubApp(data) {
  return await ssoPut(`${urls.UPDATE_SUBAPP}`, data);
}

export async function adminToggleAccess(data) {
  return await ssoPost(`${urls.REGISTER_APP_REVOKE}`, data);
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
  return await ssoPost(`${urls.TOGGLE_USER}`, { email });
}

export async function getOwnerinvites(payload) {
  return await ssoGet(
    `${urls.INVITATION}/get-invites?${new URLSearchParams(payload)}`,
    {}
  );
}
export async function getCentralAdminUsers(payload) {
  return await ssoGet(
    `${urls.CENRTAL_ADMIN_GET_USERS}?${new URLSearchParams(
      cleanObject(payload)
    )}`,
    {}
  );
}

export async function getOwnerMembers(payload) {
  return await ssoPost(`${urls.OWNER_GET_MEMBERS}`, cleanObject(payload));
}

export async function toggleMemberStatus(email) {
  return await ssoPost(`${urls.OWNER_TOGGLE_STATUS}`, { email });
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
  return await ssoPost(`${urls.OWNER_REVOKE_ACCESS}`, data);
}

export async function resendOwnerInvite(data) {
  return await ssoPost(`v1/owner/re-send-invite`, data);
}

export async function delOwnerInvite(id) {
  return await ssoPost(`v1/owner/invites/cancel/${id}`, {});
}

export async function generateReferralCode() {
  return await ssoGet(urls.GENERATE_REFERRAL_CODE, config);
}

export async function createReferral(data) {
  return await ssoPost(urls.CREATE_REFERRAL, data);
}

export async function updateReferral(data) {
  return await ssoPut(urls.UPDATE_REFERRAL, data);
}

export async function getReferral(id) {
  return await ssoGet(urls.GET_REFERRAL(id), {});
}

export async function getReferrals(queryParams) {
  return await ssoGet(
    `${urls.GET_REFERRALS}?${new URLSearchParams(queryParams)}`,
    {}
  );
}

export async function getReferralByCode(referralCode) {
  return await ssoPost(`admin/v1/referalls/get-all`, {
    referralCode,
  });
}
export async function getReferralLeaderboard(queryParams) {
  return await ssoGet(
    `${urls.GET_REFERRAL_LEADERBOARD}?${new URLSearchParams(
      cleanObject(queryParams)
    )}`,
    {}
  );
}

export async function updateReferralStatus(referralCode, status) {
  return await ssoPost(`admin/v1/referalls/update-status`, {
    referralCode,
    status,
  });
}

export async function deleteReferral(id, version = "1") {
  return await ssoDelete(urls.DELETE_REFERRAL(id, version), {});
}

export async function getDepartments(queryParams) {
  return await ssoGet(
    `admin/v1/referalls/department/get-all?${new URLSearchParams(
      cleanObject(queryParams)
    )}`,
    {}
  );
}

export async function addDepartment(payload) {
  return await ssoPost(`admin/v1/referalls/department/add`, payload);
}
export async function updateDepartment(payload) {
  return await ssoPost(`admin/v1/referalls/department/edit`, payload);
}

export async function deleteDepartment(id) {
  return await ssoDelete(`admin/v1/referalls/department/delete/${id}`, {});
}

export async function getRefferralByUser() {
  return await ssoGet(`admin/v1/referalls/get-referral-by-user`, {});
}
export async function checkReferralCodeUniqueness(
  referralCode,
  excludeId = null
) {
  try {
    const response = await getReferrals({});
    const codes = response.data?.data || [];

    // Check if code exists (case-insensitive)
    const exists = codes.some(
      (item) =>
        item.referralCode?.toLowerCase() === referralCode.toLowerCase() &&
        (!excludeId || item.id !== excludeId)
    );

    return !exists; // Return true if unique, false if duplicate
  } catch (error) {
    console.error("Error checking referral code uniqueness:", error);
    return false;
  }
}
