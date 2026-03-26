import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  getUserInfo,
  sendAdminInvite,
  getAllinvites,
  toggleUserStatus,
  generateReferralCode,
  createReferral,
  getReferrals,
  getReferralByCode,
  updateReferralStatus,
  deleteReferral,
  getDepartments,
  addDepartment,
  checkReferralCodeUniqueness
} from "~/services/userservices"; 

import urls from "~/helpers/url_helpers";
import { get, ssoPost, ssoGet, ssoDelete } from "../services/api_services";

vi.mock("../services/api_services", () => ({
  get: vi.fn(),
  ssoPost: vi.fn(),
  ssoGet: vi.fn(),
  ssoPut: vi.fn(),
  ssoDelete: vi.fn(),
}));

vi.mock("~/store", () => ({
  default: {
    getters: {
      accessToken: "mock-access-token",
    },
  },
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    GET_USER_INFO: "v1/user-info",
    INVITATION: "v1/auth/invitation",
    TOGGLE_USER: "v1/auth/toggle",
    GENERATE_REFERRAL_CODE: "v1/referral/generate",
    CREATE_REFERRAL: "v1/referral/create",
    GET_REFERRALS: "v1/referrals",
    DELETE_REFERRAL: (id, v) => `v${v}/referral/delete/${id}`,
  },
}));

describe("User Services Unified Suite", () => {
  const mockConfig = {
    headers: { Authorization: `Bearer mock-access-token` },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication & Invites", () => {
    it("getUserInfo calls get with auth config", async () => {
      get.mockResolvedValue({ data: { id: 1 } });
      await getUserInfo();
      expect(get).toHaveBeenCalledWith(urls.GET_USER_INFO, mockConfig);
    });

    it("sendAdminInvite calls ssoPost with data", async () => {
      const payload = { email: "admin@matta.trade" };
      await sendAdminInvite(payload);
      expect(ssoPost).toHaveBeenCalledWith(`${urls.INVITATION}/send-admin-invite`, payload);
    });

    it("toggleUserStatus sends email in body", async () => {
      const email = "user@test.com";
      await toggleUserStatus(email);
      expect(ssoPost).toHaveBeenCalledWith(urls.TOGGLE_USER, { email });
    });
  });

  describe("Referral Management", () => {
    it("generateReferralCode calls ssoGet with auth config", async () => {
      await generateReferralCode();
      expect(ssoGet).toHaveBeenCalledWith(urls.GENERATE_REFERRAL_CODE, mockConfig);
    });

    it("getReferrals handles query params", async () => {
      const params = { page: 1 };
      await getReferrals(params);
      expect(ssoGet).toHaveBeenCalledWith(`${urls.GET_REFERRALS}?page=1`, {});
    });

    it("getReferralByCode sends referralCode in post body", async () => {
      await getReferralByCode("CODE123");
      expect(ssoPost).toHaveBeenCalledWith(
        "admin/v1/referalls/get-all", 
        { referralCode: "CODE123" }
      );
    });

    it("deleteReferral uses versioning correctly", async () => {
      await deleteReferral("99", "2");
      expect(ssoDelete).toHaveBeenCalledWith("v2/referral/delete/99", {});
    });

    it("checkReferralCodeUniqueness returns false for duplicates", async () => {
      ssoGet.mockResolvedValue({
        data: { data: [{ referralCode: "TAKEN", id: "1" }] }
      });
      const result = await checkReferralCodeUniqueness("taken");
      expect(result).toBe(false);
    });
  });

  describe("Department Management", () => {
    it("getDepartments calls specific admin endpoint", async () => {
      await getDepartments({ search: "IT" });
      expect(ssoGet).toHaveBeenCalledWith(
        expect.stringContaining("admin/v1/referalls/department/get-all"),
        {}
      );
    });

    it("addDepartment posts payload", async () => {
      const dept = { name: "Sales" };
      await addDepartment(dept);
      expect(ssoPost).toHaveBeenCalledWith("admin/v1/referalls/department/add", dept);
    });
  });
});