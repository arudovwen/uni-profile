// company_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as companyHelpers from "~/services/onboardingservices";
// import urls from '~/helpers/url_helpers';
import { post, get } from "~/helpers/api_helpers";
// import store from '~/store';

// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
  post: vi.fn(),
  get: vi.fn(),
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
    COMPANY_UPDATE_PERSONAL_INFO: "mock-update-personal-info-url",
    COMPANY_UPDATE_ADDITIONAL_INFORMATION: "mock-update-additional-info-url",
    COMPANY_INVITE_USERS: "mock-invite-users-url",
    GET_ONBOARDING_INFO: "mock-get-onboarding-info-url",
    UPLOAD_FILE: "mock-upload-file-url",
    UPLOAD_DOCUMENT: "mock-upload-document-url",
    SETONBOARDING_COMPLETE: "mock-set-onboarding-complete-url",
    SET_ACCOUNT_TYPE: "mock-set-account-type-url",
  },
}));

describe("Company Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call updatePersonalInfo with the correct URL, user data, and config", async () => {
    const mockUser = { name: "John Doe" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.updatePersonalInfo(mockUser);

    expect(post).toHaveBeenCalledWith(
      "mock-update-personal-info-url",
      mockUser,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call additionalInfo with the correct URL, user data, and config", async () => {
    const mockUser = { info: "Additional info" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.additionalInfo(mockUser);

    expect(post).toHaveBeenCalledWith(
      "mock-update-additional-info-url",
      mockUser,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call inviteUsers with the correct URL, user data, and config", async () => {
    const mockUser = { email: "user@example.com" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.inviteUsers(mockUser);

    expect(post).toHaveBeenCalledWith(
      "mock-invite-users-url",
      mockUser,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getOnboarding with the correct URL and config", async () => {
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.getOnboarding();

    expect(get).toHaveBeenCalledWith(
      "mock-get-onboarding-info-url",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call uploadfile with the correct URL, data, and config", async () => {
    const mockData = { file: "mock-file" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.uploadfile(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-upload-file-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call uploaddocument with the correct URL, data, and config", async () => {
    const mockData = { document: "mock-document" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.uploaddocument(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-upload-document-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call setOnboardingcomplete with the correct URL, empty data, and config", async () => {
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.setOnboardingcomplete();

    expect(post).toHaveBeenCalledWith(
      "mock-set-onboarding-complete-url",
      "",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call setaccountype with the correct URL, data, and config", async () => {
    const mockData = { type: "business" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await companyHelpers.setaccountype(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-set-account-type-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});
