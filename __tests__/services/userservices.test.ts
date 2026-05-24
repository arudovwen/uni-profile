import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getUserInfo,
  changePassword,
  addCustomer,
  addSubApp,
  getSubApps,
  getSubApp,
  editSubApp,
  deleteSubApp,
  uploadAppLogo,
  adminToggleAccess,
  sendAdminInvite,
  resendAdminInvite,
  getSingleInvite,
  delSingleInvite,
  getAllinvites,
  getAllUsers,
  toggleUserStatus,
  getOwnerinvites,
  getCentralAdminUsers,
  getOwnerMembers,
  toggleMemberStatus,
  sendOwnerInvite,
  registerMember,
  ownerDisableUser,
  ownerRevokeAccess,
  resendOwnerInvite,
  delOwnerInvite,
  updateMemberAccess,
  ownerToggleAppAccess,
  generateReferralCode,
  createReferral,
  updateReferral,
  getReferral,
  getReferrals,
  getReferralByCode,
  getReferralLeaderboard,
  updateReferralStatus,
  deleteReferral,
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getRefferralByUser,
  checkReferralCodeUniqueness,
} from "~/services/userservices";
import urls from "~/helpers/url_helpers";
import { get, post, put, ssoPost, ssoGet, ssoPut, ssoDelete } from "~/helpers/api_helpers";

vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  ssoPost: vi.fn(),
  ssoGet: vi.fn(),
  ssoPut: vi.fn(),
  ssoDelete: vi.fn(),
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    GET_USER_INFO: "v1/user-info",
    CHANGE_PASSWORD: "v1/change-password",
    ADD_SUBAPP: "v1/subapp/add",
    GET_SUBAPPS: "v1/subapp/all",
    GET_SUBAPP: (id: string | number) => `v1/subapp/${id}`,
    UPDATE_SUBAPP: "v1/subapp/update",
    DELETE_SUBAPP: (id: string | number) => `v1/subapp/delete/${id}`,
    UPLOAD_FILE: "v1/file/upload",
    REGISTER_APP_REVOKE: "v1/app/revoke",
    INVITATION: "v1/invitation",
    GET_ALL_USERS: "v1/users/all",
    TOGGLE_USER: "v1/users/toggle",
    CENRTAL_ADMIN_GET_USERS: "v1/central/users",
    OWNER_GET_MEMBERS: "v1/owner/members",
    OWNER_TOGGLE_STATUS: "v1/owner/toggle",
    OWNER_SEND_INVITE: "v1/owner/invite",
    OWNERS_REGISTER_MEMBER: "v1/owner/register",
    OWNER_DISABLE_USER: "v1/owner/disable",
    OWNER_REVOKE_ACCESS: "v1/owner/revoke",
    GENERATE_REFERRAL_CODE: "v1/referral/generate",
    CREATE_REFERRAL: "v1/referral/create",
    UPDATE_REFERRAL: "v1/referral/update",
    GET_REFERRAL: (id: string | number) => `v1/referral/${id}`,
    GET_REFERRALS: "v1/referrals",
    GET_REFERRAL_LEADERBOARD: "v1/referral/leaderboard",
    DELETE_REFERRAL: (id: string | number, v: string) => `v${v}/referral/delete/${id}`,
  },
}));

global.cleanObject = (obj: any) => {
  if (!obj) return {};
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === null || newObj[key] === undefined || newObj[key] === "") {
      delete newObj[key];
    }
  });
  return newObj;
};

describe("User Services Unified Suite", () => {
  const config = {};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserInfo calls get", async () => {
    await getUserInfo();
    expect(get).toHaveBeenCalledWith(urls.GET_USER_INFO, config);
  });

  it("changePassword calls ssoPost", async () => {
    const payload = { password: "123" };
    await changePassword(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.CHANGE_PASSWORD}`, payload);
  });

  it("addCustomer calls ssoPost with change password endpoint", async () => {
    const payload = { customer: "test" };
    await addCustomer(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.CHANGE_PASSWORD}`, payload);
  });

  it("addSubApp calls ssoPost", async () => {
    const payload = { name: "app" };
    await addSubApp(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.ADD_SUBAPP}`, payload);
  });

  it("getSubApps calls ssoGet with matching search params", async () => {
    const payload = { page: "1", size: "10" };
    await getSubApps(payload);
    expect(ssoGet).toHaveBeenCalledWith(`${urls.GET_SUBAPPS}?page=1&size=10`, {});
  });

  it("getSubApp calls ssoGet matching identifier functional asset", async () => {
    await getSubApp("45");
    expect(ssoGet).toHaveBeenCalledWith("v1/subapp/45", {});
  });

  it("editSubApp calls ssoPut", async () => {
    const payload = { id: 1 };
    await editSubApp(payload);
    expect(ssoPut).toHaveBeenCalledWith(`${urls.UPDATE_SUBAPP}`, payload);
  });

  it("deleteSubApp calls ssoDelete", async () => {
    await deleteSubApp("12");
    expect(ssoDelete).toHaveBeenCalledWith("v1/subapp/delete/12", {});
  });

  it("uploadAppLogo calls ssoPost matching correct object configuration format", async () => {
    await uploadAppLogo("base64string");
    expect(ssoPost).toHaveBeenCalledWith(`${urls.UPLOAD_FILE}`, { base64: "base64string" });
  });

  it("adminToggleAccess calls ssoPost", async () => {
    const payload = { id: "test" };
    await adminToggleAccess(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.REGISTER_APP_REVOKE}`, payload);
  });

  it("sendAdminInvite calls ssoPost", async () => {
    const payload = { email: "test" };
    await sendAdminInvite(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.INVITATION}/send-admin-invite`, payload);
  });

  it("resendAdminInvite calls ssoPost", async () => {
    const payload = { email: "test" };
    await resendAdminInvite(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.INVITATION}/re-send-admin-invite`, payload);
  });

  it("getSingleInvite calls ssoGet", async () => {
    await getSingleInvite("7");
    expect(ssoGet).toHaveBeenCalledWith(`${urls.INVITATION}/invites/7`, {});
  });

  it("delSingleInvite calls ssoDelete", async () => {
    await delSingleInvite("7");
    expect(ssoDelete).toHaveBeenCalledWith(`${urls.INVITATION}/invites/7`, {});
  });

  it("getAllinvites calls ssoGet with matching payload parameters", async () => {
    await getAllinvites({ filter: "active" });
    expect(ssoGet).toHaveBeenCalledWith(`${urls.INVITATION}/get-invites?filter=active`, {});
  });

  it("getAllUsers calls ssoPost with cleanObject data structural transformation", async () => {
    const payload = { role: "admin", empty: null };
    await getAllUsers(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.GET_ALL_USERS}`, { role: "admin" });
  });

  it("toggleUserStatus calls ssoPost passing correct data map schema", async () => {
    await toggleUserStatus("test@mail.com");
    expect(ssoPost).toHaveBeenCalledWith(`${urls.TOGGLE_USER}`, { email: "test@mail.com" });
  });

  it("getOwnerinvites calls ssoGet", async () => {
    await getOwnerinvites({ status: "pending" });
    expect(ssoGet).toHaveBeenCalledWith(`${urls.INVITATION}/get-invites?status=pending`, {});
  });

  it("getCentralAdminUsers calls ssoGet cleaning input keys parameters", async () => {
    await getCentralAdminUsers({ group: "core", removing: "" });
    expect(ssoGet).toHaveBeenCalledWith(`${urls.CENRTAL_ADMIN_GET_USERS}?group=core`, {});
  });

  it("getOwnerMembers calls ssoPost", async () => {
    await getOwnerMembers({ active: "true" });
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNER_GET_MEMBERS}`, { active: "true" });
  });

  it("toggleMemberStatus calls ssoPost payload map format", async () => {
    await toggleMemberStatus("member@test.com");
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNER_TOGGLE_STATUS}`, { email: "member@test.com" });
  });

  it("sendOwnerInvite calls ssoPost", async () => {
    const payload = { invitee: "test" };
    await sendOwnerInvite(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNER_SEND_INVITE}`, payload);
  });

  it("registerMember calls ssoPost", async () => {
    const payload = { user: "new" };
    await registerMember(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNERS_REGISTER_MEMBER}`, payload);
  });

  it("ownerDisableUser calls ssoPost matching exact template route syntax link parameter", async () => {
    await ownerDisableUser("usr_123");
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNER_DISABLE_USER}/usr_123`, {});
  });

  it("ownerRevokeAccess calls ssoPost", async () => {
    const payload = { app: "crm" };
    await ownerRevokeAccess(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNER_REVOKE_ACCESS}`, payload);
  });

  it("resendOwnerInvite calls ssoPost matching expected standard string route link", async () => {
    const payload = { token: "abc" };
    await resendOwnerInvite(payload);
    expect(ssoPost).toHaveBeenCalledWith("v1/owner/re-send-invite", payload);
  });

  it("delOwnerInvite calls ssoPost matching exact structural literal context string template", async () => {
    await delOwnerInvite("id_99");
    expect(ssoPost).toHaveBeenCalledWith("v1/owner/invites/cancel/id_99", {});
  });

  it("updateMemberAccess calls ssoPost targeting standard register route endpoint", async () => {
    const payload = { access: "write" };
    await updateMemberAccess(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNERS_REGISTER_MEMBER}`, payload);
  });

  it("ownerToggleAppAccess calls ssoPost fallback configuration route mapping destination", async () => {
    const payload = { block: "true" };
    await ownerToggleAppAccess(payload);
    expect(ssoPost).toHaveBeenCalledWith(`${urls.OWNER_REVOKE_ACCESS}`, payload);
  });

  it("generateReferralCode calls ssoGet", async () => {
    await generateReferralCode();
    expect(ssoGet).toHaveBeenCalledWith(urls.GENERATE_REFERRAL_CODE, config);
  });

  it("createReferral calls ssoPost", async () => {
    const payload = { code: "abc" };
    await createReferral(payload);
    expect(ssoPost).toHaveBeenCalledWith(urls.CREATE_REFERRAL, payload);
  });

  it("updateReferral calls ssoPut", async () => {
    const payload = { id: "1" };
    await updateReferral(payload);
    expect(ssoPut).toHaveBeenCalledWith(urls.UPDATE_REFERRAL, payload);
  });

  it("getReferral calls ssoGet resolving route path functional method", async () => {
    await getReferral("ref_10");
    expect(ssoGet).toHaveBeenCalledWith("v1/referral/ref_10", {});
  });

  it("getReferrals calls ssoGet handling input object conversions mappings", async () => {
    await getReferrals({ track: "marketing" });
    expect(ssoGet).toHaveBeenCalledWith(`${urls.GET_REFERRALS}?track=marketing`, {});
  });

  it("getReferralByCode calls ssoPost mapping raw input object configuration payload", async () => {
    await getReferralByCode("SAVE20");
    expect(ssoPost).toHaveBeenCalledWith("admin/v1/referalls/get-all", { referralCode: "SAVE20" });
  });

  it("getReferralLeaderboard calls ssoPost cleaning params payload mapping structured keys", async () => {
    await getReferralLeaderboard({ filter: "all", clearItem: null });
    expect(ssoPost).toHaveBeenCalledWith(`${urls.GET_REFERRAL_LEADERBOARD}`, { filter: "all" }, {});
  });

  it("updateReferralStatus calls ssoPost mapping text tracking values", async () => {
    await updateReferralStatus("PROMO", "disabled");
    expect(ssoPost).toHaveBeenCalledWith("admin/v1/referalls/update-status", { referralCode: "PROMO", status: "disabled" });
  });

  it("deleteReferral calls ssoDelete mapping variable functional parameters outputs", async () => {
    await deleteReferral("8", "3");
    expect(ssoDelete).toHaveBeenCalledWith("v3/referral/delete/8", {});
  });

  it("getDepartments calls ssoGet cleaning fields keys map entries definitions", async () => {
    await getDepartments({ dept: "HR", skipItem: undefined });
    expect(ssoGet).toHaveBeenCalledWith("admin/v1/referalls/department/get-all?dept=HR", {});
  });

  it("addDepartment calls ssoPost tracking string mapping", async () => {
    const payload = { title: "Dev" };
    await addDepartment(payload);
    expect(ssoPost).toHaveBeenCalledWith("admin/v1/referalls/department/add", payload);
  });

  it("updateDepartment calls ssoPost testing framework endpoints tracking", async () => {
    const payload = { key: "Fin" };
    await updateDepartment(payload);
    expect(ssoPost).toHaveBeenCalledWith("admin/v1/referalls/department/edit", payload);
  });

  it("deleteDepartment calls ssoDelete resolving exact asset reference format path", async () => {
    await deleteDepartment("dep_5");
    expect(ssoDelete).toHaveBeenCalledWith("admin/v1/referalls/department/delete/dep_5", {});
  });

  it("getRefferralByUser calls ssoGet endpoint", async () => {
    await getRefferralByUser();
    expect(ssoGet).toHaveBeenCalledWith("admin/v1/referalls/get-referral-by-user", {});
  });

  it("checkReferralCodeUniqueness returns true if code does not match existing collection contents", async () => {
    ssoGet.mockResolvedValue({
      data: { data: [{ referralCode: "FIRST", id: "1" }] },
    });
    const unique = await checkReferralCodeUniqueness("SECOND");
    expect(unique).toBe(true);
  });

  it("checkReferralCodeUniqueness returns false if target matching casing duplicates elements are identified", async () => {
    ssoGet.mockResolvedValue({
      data: { data: [{ referralCode: "MATCH", id: "1" }] },
    });
    const unique = await checkReferralCodeUniqueness("match");
    expect(unique).toBe(false);
  });

  it("checkReferralCodeUniqueness returns false on exception execution block occurrences", async () => {
    ssoGet.mockRejectedValue(new Error("Network Error"));
    const unique = await checkReferralCodeUniqueness("ANYTHING");
    expect(unique).toBe(false);
  });
});