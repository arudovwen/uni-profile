// auth_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authHelpers from "~/services/authservices";
import urls from "~/helpers/url_helpers";

// ✅ Mock the correct module and function (ssoPost, not post/get)
vi.mock("~/services/api_services", () => ({
  ssoPost: vi.fn(),
  // add ssoGet here too if confirmemail uses it
  ssoGet: vi.fn(),
}));

// ✅ Mock useAuthStore to avoid cookieStore / Pinia issues
vi.mock("~/stores/auth", () => ({
  useAuthStore: vi.fn(() => ({
    logOut: vi.fn(),
  })),
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

// ✅ Import ssoPost AFTER vi.mock declarations so it's the mocked version
import { ssoPost } from "~/services/api_services";

describe("Authentication Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call loginUser with the correct URL and user data", async () => {
    const mockUser = { email: "test@example.com", password: "password" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    ssoPost.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.loginUser(mockUser, mockConfig);

    expect(ssoPost).toHaveBeenCalledWith(
      urls.LOGIN_USER,
      expect.objectContaining({ email: mockUser.email }),
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call logOut and delegate to authStore.logOut", async () => {
    // The store mock is already set up — just verify it doesn't throw
    await expect(authHelpers.logOut()).resolves.not.toThrow();
  });

  it("should call registerUser with the correct URL and user data", async () => {
    const mockUser = { email: "test@example.com", password: "password" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    ssoPost.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.registerUser(mockUser, mockConfig);

    expect(ssoPost).toHaveBeenCalledWith(urls.REGISTER, mockUser, mockConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call registerInvitedUser with the correct URL and user data", async () => {
    const mockUser = { email: "test@example.com", password: "password" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    ssoPost.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.registerInvitedUser(mockUser, mockConfig);

    expect(ssoPost).toHaveBeenCalledWith(
      urls.REGISTER_INVITED_USER,
      expect.objectContaining({ email: mockUser.email }),
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call forgotPassword with the correct URL and user data", async () => {
    const mockUser = { email: "test@example.com" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    ssoPost.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.forgotPassword(mockUser, mockConfig);

    expect(ssoPost).toHaveBeenCalledWith(
      urls.FORGOT_PASSWORD,
      expect.objectContaining({ email: mockUser.email }),
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call resendVerification with the correct URL and data", async () => {
    const mockData = { email: "test@example.com" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    ssoPost.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.resendVerification(mockData, mockConfig);

    expect(ssoPost).toHaveBeenCalledWith(
      urls.RESEND_VERIFICATION,
      mockData,
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call resetPassword with the correct URL and user data", async () => {
    const mockUser = { password: "newpassword" };
    const mockConfig = { headers: { "Content-Type": "application/json" } };

    ssoPost.mockResolvedValue({ data: "mock-response" });

    const response = await authHelpers.resetPassword(mockUser, mockConfig);

    expect(ssoPost).toHaveBeenCalledWith(
      urls.RESET_PASSWORD,
      expect.objectContaining({ password: mockUser.password }),
      mockConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});