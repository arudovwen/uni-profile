import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authMarketHelpers from "~/services/settingservices";
import { get, post, ssoGet, ssoPut } from "../helpers/api_helpers"; // ✅ match real import path
import store from "~/store";

// ✅ Mock the correct module with ALL used functions
vi.mock("../helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
  ssoGet: vi.fn(),
  ssoPost: vi.fn(),
  ssoPut: vi.fn(),
}));

vi.mock("~/store", () => ({
  default: {
    getters: {
      accessToken: "mock-access-token",
      userId: 1,
    },
  },
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    GET_PROFILE: "mock-get-profile-url",
    GET_COMPANY_PROFILE: "mock-get-company-profile-url",
    UPDATE_PROFILE: "mock-update-profile-url",
    CHANGE_PASSWORD: "mock-change-password-url",
    SET_TIMEZONE: "mock-set-timezone-url",
    DELETE_ACCOUNT: "mock-delete-account-url",
    STOREFRONT_STAT: "mock-storefront-stat-url",
    STOREFRONT_TRENDING_PRODUCT: "mock-storefront-trending-product-url",
  },
}));

describe("Auth and Market Helper Functions", () => {
  const mockAccessToken = "mock-access-token";
  const expectedConfig = {
    headers: { Authorization: `Bearer ${mockAccessToken}` },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getProfile with the correct URL and config", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" }); // ✅ ssoGet not get

    const response = await authMarketHelpers.getProfile();

    expect(ssoGet).toHaveBeenCalledWith("mock-get-profile-url", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getCompanyProfile with the correct URL and config", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" }); // ✅ ssoGet not get

    const response = await authMarketHelpers.getCompanyProfile();

    expect(ssoGet).toHaveBeenCalledWith("mock-get-company-profile-url", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateProfile with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.updateProfile(mockData);

    expect(post).toHaveBeenCalledWith("mock-update-profile-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call changepassword with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.changepassword(mockData);

    expect(post).toHaveBeenCalledWith("mock-change-password-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call settimezone with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.settimezone(mockData);

    expect(post).toHaveBeenCalledWith("mock-set-timezone-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call deleteaccount with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.deleteaccount(mockData);

    expect(post).toHaveBeenCalledWith("mock-delete-account-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getesfrontstats with the correct URL and query params", async () => {
    const mockParams = { StartDate: "2023-01-01", EndDate: "2023-01-31" };
    get.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.getesfrontstats(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-storefront-stat-url?StartDate=${mockParams.StartDate}&EndDate=${mockParams.EndDate}`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getstorefronttrending with the correct URL and query params", async () => {
    const mockParams = { StartDate: "2023-01-01", EndDate: "2023-01-31", top: 5 };
    get.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.getstorefronttrending(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-storefront-trending-product-url?StartDate=${mockParams.StartDate}&EndDate=${mockParams.EndDate}&top=${mockParams.top}`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});