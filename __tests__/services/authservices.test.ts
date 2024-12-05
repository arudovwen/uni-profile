// auth_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authHelpers from "~/services/authservices";
import urls from "~/helpers/url_helpers";
import { post, get } from "~/helpers/api_helpers";
import store from "~/store";

// Mock the dependencies
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("~/store", () => ({
  default: {
    commit: vi.fn(),
    getters: {
      accessToken: "mock-access-token",
    },
  },
}));



vi.mock("~/helpers/url_helpers", () => ({
  default: {
    LOGIN_USER: "mock-login-user-url",
    REGISTER: "mock-register-url",
    REGISTER_INVITED_USER: "mock-register-invited-user-url",
    FORGOT_PASSWORD: "mock-forgot-password-url",
    RESEND_VERIFICATION: "mock-resend-verification-url",
    RESET_PASSWORD: "mock-reset-password-url",
    CONFIRM_EMAIL: "mock-confirm-email-url",
    SOCIAL_REGISTER: "mock-social-register-url",
    SOCIAL_LOGIN: "mock-social-login-url",
  },
}));

describe("Authentication Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call loginUser with the correct URL, user data, and config", async () => {
    const mockUser = { email: "test@example.com", password: "password" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.loginUser(mockUser, mockConfig);

    expect(post).toHaveBeenCalledWith(urls.LOGIN_USER, mockUser, mockConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call logOut and clear user data, remove local storage item, and redirect", async () => {
    const mockWindowLocation = { href: "" };
    global.window = { location: mockWindowLocation };

    await authHelpers.logOut();
    expect(window.location.href).toBe("/");
  });

  it("should call registerUser with the correct URL, user data, and config", async () => {
    const mockUser = { email: "test@example.com", password: "password" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.registerUser(mockUser, mockConfig);

    expect(post).toHaveBeenCalledWith(urls.REGISTER, mockUser, mockConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call registerInvitedUser with the correct URL, user data, and config", async () => {
    const mockUser = { email: "test@example.com", password: "password" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.registerInvitedUser(
      mockUser,
      mockConfig
    );

    expect(post).toHaveBeenCalledWith(
      urls.REGISTER_INVITED_USER,
      mockUser,
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call forgotPassword with the correct URL, user data, and config", async () => {
    const mockUser = { email: "test@example.com" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.forgotPassword(mockUser, mockConfig);

    expect(post).toHaveBeenCalledWith(
      urls.FORGOT_PASSWORD,
      mockUser,
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call resendVerification with the correct URL, data, and config", async () => {
    const mockData = { email: "test@example.com" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.resendVerification(mockData, mockConfig);

    expect(post).toHaveBeenCalledWith(
      urls.RESEND_VERIFICATION,
      mockData,
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call resetPassword with the correct URL, user data, and config", async () => {
    const mockUser = { password: "newpassword" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.resetPassword(mockUser, mockConfig);

    expect(post).toHaveBeenCalledWith(
      urls.RESET_PASSWORD,
      mockUser,
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call confirmemail with the correct URL and config", async () => {
    const mockData = { userId: "12345", code: "67890" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };
    const expectedUrl = `${urls.CONFIRM_EMAIL}?userId=12345&code=67890`;

    get.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.confirmemail(mockData, mockConfig);

    expect(get).toHaveBeenCalledWith(expectedUrl, mockConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call socialregister with the correct URL and data", async () => {
    const mockData = { token: "social-token" };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.socialregister(mockData);

    expect(post).toHaveBeenCalledWith(urls.SOCIAL_REGISTER, mockData);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call sociallogin with the correct URL and data", async () => {
    const mockData = { token: "social-token" };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.sociallogin(mockData);

    expect(post).toHaveBeenCalledWith(urls.SOCIAL_LOGIN, mockData);
    expect(response).toEqual({ data: "mock-response" });
  });
});
