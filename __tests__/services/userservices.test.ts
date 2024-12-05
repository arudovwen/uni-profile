// Import necessary modules from vitest
import { describe, it, expect, beforeEach, vi } from "vitest";

// Import the functions to be tested
import {
  inviteUsers,
  deleteInvite,
  resendInvite,
  deleteUser,
  changeUserRole,
  getInvites,
  getRoles,
  getVendorInfo,
  updateVendorInfo,
  postStoreName,
  customizeVendor,
} from "~/services/userservices"; // Replace with actual path

// Import mock dependencies
import urls from "~/helpers/url_helpers";
import { post, get } from "~/helpers/api_helpers";

// Mock configuration
const mockConfig = {
  headers: { Authorization: `Bearer mock-access-token` },
};
// Mocking API helpers and store
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

// Mocking URL helpers
vi.mock("~/helpers/url_helpers", () => ({
  default: {
    INVITE_USERS: "mock-invite-users-url",
    DELETE_INVITES: "mock-delete-invites-url",
    RESEND_INVITE_USERS: "mock-resend-invite-users-url",
    DELETE_USER: "mock-delete-user-url",
    CHANGE_ROLE: "mock-change-role-url",
    GET_INVITES: "mock-get-invites-url",
    GET_ROLES: "mock-get-roles-url",
    CUSTOMER_CREATE: "mock-customer-create-url",
    GET_VENDOR_STORE: "mock-get-vendor-store-url",
    UPDATE_VENDOR_STORE: "mock-update-vendor-store-url",
    POST_VENDOR_STORE_NAME: "mock-post-vendor-store-name-url",
    CUSTOMIZE_VENDOR_INFO: "mock-customize-vendor-info-url",
  },
}));

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Describe block for testing Authentication API functions
describe("Authentication API Functions", () => {
  it("should call inviteUsers with the correct URL and config", async () => {
    const mockData = {
      /* Replace with mock data */
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await inviteUsers(mockData);

    expect(post).toHaveBeenCalledWith(urls.INVITE_USERS, mockData, mockConfig);
    expect(response).toEqual(expectedResponse);
  });

  it("should call deleteInvite with the correct URL and config", async () => {
    const mockData = { invitationId: "mock-invitation-id" };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await deleteInvite(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.DELETE_INVITES}?invitationId=${mockData.invitationId}`,
      mockData,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });

  it("should call resendInvite with the correct URL and config", async () => {
    const mockData = {
      /* Replace with mock data */
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await resendInvite(mockData);

    expect(post).toHaveBeenCalledWith(
      urls.RESEND_INVITE_USERS,
      mockData,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });

  it("should call deleteUser with the correct URL and config", async () => {
    const mockData = { email: "mock-email@example.com" };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await deleteUser(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.DELETE_USER}?email=${mockData.email}`,
      mockData,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });

  it("should call changeUserRole with the correct URL and config", async () => {
    const mockData = {
      /* Replace with mock data */
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await changeUserRole(mockData);

    expect(post).toHaveBeenCalledWith(urls.CHANGE_ROLE, mockData, mockConfig);
    expect(response).toEqual(expectedResponse);
  });

  it("should call getInvites with the correct URL and config", async () => {
    const mockParams = {
      Status: "active",
      PageNumber: 1,
      PageSize: 10,
      Role: "admin",
      Search: "test",
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    get.mockResolvedValue(expectedResponse);

    const response = await getInvites(mockParams);

    expect(get).toHaveBeenCalledWith(
      `${urls.GET_INVITES}?Search=${mockParams.Search}&Status=${mockParams.Status}&Role=${mockParams.Role}&PageNumber=${mockParams.PageNumber}&PageSize=${mockParams.PageSize}`,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });

  it("should call getRoles with the correct URL and config", async () => {
    const expectedResponse = {
      /* Replace with expected response */
    };

    get.mockResolvedValue(expectedResponse);

    const response = await getRoles();

    expect(get).toHaveBeenCalledWith(urls.GET_ROLES, mockConfig);
    expect(response).toEqual(expectedResponse);
  });

  it("should call getVendorInfo with the correct URL and config", async () => {
    const mockSellerId = "mock-seller-id";
    const expectedResponse = {
      /* Replace with expected response */
    };

    get.mockResolvedValue(expectedResponse);

    const response = await getVendorInfo(mockSellerId);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual(expectedResponse);
  });

  it("should call updateVendorInfo with the correct URL and config", async () => {
    const mockData = {
      /* Replace with mock data */
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await updateVendorInfo(mockData);

    expect(post).toHaveBeenCalledWith(
      urls.UPDATE_VENDOR_STORE,
      mockData,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });

  it("should call postStoreName with the correct URL and config", async () => {
    const mockData = {
      /* Replace with mock data */
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    get.mockResolvedValue(expectedResponse);

    const response = await postStoreName(mockData);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual(expectedResponse);
  });

  it("should call customizeVendor with the correct URL and config", async () => {
    const mockData = {
      /* Replace with mock data */
    };
    const expectedResponse = {
      /* Replace with expected response */
    };

    post.mockResolvedValue(expectedResponse);

    const response = await customizeVendor(mockData);

    expect(post).toHaveBeenCalledWith(
      urls.CUSTOMIZE_VENDOR_INFO,
      mockData,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });
});
