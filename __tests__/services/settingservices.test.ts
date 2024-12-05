// auth_market_helpers.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authMarketHelpers from "~/services/settingservices";
// import urls from "~/helpers/url_helpers";
import { get, post } from "~/helpers/api_helpers";
import store from "~/store";

// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
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
    GET_BUYER_PROFILE: "mock-get-buyer-profile-url",
    UPDATE_BUYER_PROFILE: "mock-update-buyer-profile-url",
    ADMIN_GET_COMPANY_PROFILE: "mock-admin-get-company-profile-url",
    ADMIN_STATUS_UPDATE: "mock-admin-status-update-url",
    UPDATE_PROFILE: "mock-update-profile-url",
    UPDATE_DOCUMENTS: "mock-update-documents-url",
    UPDATE_DIRECTORS: "mock-update-directors-url",
    CHANGE_PASSWORD: "mock-change-password-url",
    UPDATE_COMPANY_PROFILE: "mock-update-company-profile-url",
    SET_TIMEZONE: "mock-set-timezone-url",
    DELETE_ACCOUNT: "mock-delete-account-url",
    STOREFRONT_STAT: "mock-storefront-stat-url",
    STOREFRONT_TRENDING_PRODUCT: "mock-storefront-trending-product-url",
  },
}));

describe("Auth and Market Helper Functions", () => {
  const mockAccessToken = "mock-access-token";
  const mockBusinessId = "mock-business-id";

  beforeEach(() => {
    vi.clearAllMocks();
    store.getters = {
      accessToken: mockAccessToken,
    };
  });

  // Test for getProfile function
  it("should call getProfile with the correct URL and config", async () => {
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.getProfile();

    expect(get).toHaveBeenCalledWith("mock-get-profile-url", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for getCompanyProfile function
  it("should call getCompanyProfile with the correct URL and config", async () => {
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.getCompanyProfile();

    expect(get).toHaveBeenCalledWith(
      "mock-get-company-profile-url",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });




  // Test for updateProfile function
  it("should call updateProfile with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.updateProfile(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-update-profile-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });


  // Test for changepassword function
  it("should call changepassword with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.changepassword(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-change-password-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });


  // Test for settimezone function
  it("should call settimezone with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.settimezone(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-set-timezone-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for deleteaccount function
  it("should call deleteaccount with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.deleteaccount(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-delete-account-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for getesfrontstats function
  it("should call getesfrontstats with the correct URL and query params", async () => {
    const mockParams = { StartDate: "2023-01-01", EndDate: "2023-01-31" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.getesfrontstats(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-storefront-stat-url?StartDate=${mockParams.StartDate}&EndDate=${mockParams.EndDate}`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for getstorefronttrending function
  it("should call getstorefronttrending with the correct URL and query params", async () => {
    const mockParams = {
      StartDate: "2023-01-01",
      EndDate: "2023-01-31",
      top: 5,
    };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await authMarketHelpers.getstorefronttrending(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-storefront-trending-product-url?StartDate=${mockParams.StartDate}&EndDate=${mockParams.EndDate}&top=${mockParams.top}`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});
