// notification_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as notificationHelpers from "~/services/notificationservice";
// import urls from "~/helpers/url_helpers";
import { get, post } from "~/helpers/api_helpers";
// import store from "~/store";

// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
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
    GET_NOTIFICATION: "mock-get-notification-url",
    MARK_NOTIFICATION: "mock-mark-notification-url",
    MARK_ALL_NOTIFICATION: "mock-mark-all-notification-url",
  },
}));

describe("Notification Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getnotification with the correct URL and config", async () => {
    const mockData = {
      PageNumber: 1,
      PageSize: 10,
      BusinessId: "mock-business-id",
      UserId: "mock-user-id",
      Role: "mock-role",
    };

    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await notificationHelpers.getnotification(mockData);

    expect(get).toHaveBeenCalledWith(
      "mock-get-notification-url?PageNumber=1&PageSize=10&Role=mock-role&BusinessId=mock-business-id&UserId=mock-user-id",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call marknotification with the correct URL, data, and config", async () => {
    const mockData = { someKey: "someValue" };

    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await notificationHelpers.marknotification(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-mark-notification-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call markallnotification with the correct URL, data, and config", async () => {
    const mockData = { someKey: "someValue" };

    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await notificationHelpers.markallnotification(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-mark-all-notification-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});
