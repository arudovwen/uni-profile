import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authMarketHelpers from "~/services/settingservices";
import { post, get, ssoGet, ssoPut } from "~/helpers/api_helpers";

vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
  ssoGet: vi.fn(),
  ssoPost: vi.fn(),
  ssoPut: vi.fn(),
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    GET_PROFILE: "mock-get-profile-url",
    GET_COMPANY_PROFILE: "mock-get-company-profile-url",
    UPDATE_PROFILE: "mock-update-profile-url",
    UPDATE_DOCUMENTS: "mock-update-documents-url",
    UPDATE_DIRECTORS: "mock-update-directors-url",
    CHANGE_PASSWORD: "mock-change-password-url",
    BUSINESS_PROFILE: "mock-business-profile-url",
    USER_PROFILE: "mock-user-profile-url",
    USER_DETAIL: "mock-user-detail-url",
    SET_TIMEZONE: "mock-set-timezone-url",
    DELETE_ACCOUNT: "mock-delete-account-url",
    STOREFRONT_STAT: "mock-storefront-stat-url",
    STOREFRONT_TRENDING_PRODUCT: "mock-storefront-trending-product-url",
  },
}));

describe("Auth and Market Helper Functions", () => {
  const expectedConfig = {};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getProfile with the correct URL and config", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.getProfile();
    expect(ssoGet).toHaveBeenCalledWith("mock-get-profile-url", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getCompanyProfile with the correct URL and config", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" });
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

  it("should call updateDocuments with the correct URL and data", async () => {
    const mockData = { doc: "pdf" };
    post.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.updateDocuments(mockData);
    expect(post).toHaveBeenCalledWith("mock-update-documents-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateDirectors with the correct URL and data", async () => {
    const mockData = { director: "John" };
    post.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.updateDirectors(mockData);
    expect(post).toHaveBeenCalledWith("mock-update-directors-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call changepassword with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    post.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.changepassword(mockData);
    expect(post).toHaveBeenCalledWith("mock-change-password-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateCompanyProfile with the correct URL and data", async () => {
    const mockData = { company: "test" };
    ssoPut.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.updateCompanyProfile(mockData);
    expect(ssoPut).toHaveBeenCalledWith("mock-business-profile-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getBusinessProfile with the correct URL and config", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.getBusinessProfile();
    expect(ssoGet).toHaveBeenCalledWith("mock-business-profile-url", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateBusinessProfile with the correct URL and data", async () => {
    const mockData = { biz: "updated" };
    ssoPut.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.updateBusinessProfile(mockData);
    expect(ssoPut).toHaveBeenCalledWith("mock-business-profile-url", mockData, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getUserProfile with the correct URL and config", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.getUserProfile();
    expect(ssoGet).toHaveBeenCalledWith("mock-user-profile-url", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getUserDetail with the correct URL format containing an ID", async () => {
    ssoGet.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.getUserDetail("123");
    expect(ssoGet).toHaveBeenCalledWith("mock-user-detail-url/123", expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateUserProfile with the correct URL and data", async () => {
    const mockData = { name: "New Name" };
    ssoPut.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.updateUserProfile(mockData);
    expect(ssoPut).toHaveBeenCalledWith("mock-user-profile-url", mockData, expectedConfig);
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
      "mock-storefront-stat-url?StartDate=2023-01-01&EndDate=2023-01-31",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getstorefronttrending with the correct URL and query params", async () => {
    const mockParams = { StartDate: "2023-01-01", EndDate: "2023-01-31", top: 5 };
    get.mockResolvedValue({ data: "mock-response" });
    const response = await authMarketHelpers.getstorefronttrending(mockParams);
    expect(get).toHaveBeenCalledWith(
      "mock-storefront-trending-product-url?StartDate=2023-01-01&EndDate=2023-01-31&top=5",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});