import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  getnotifications, 
  marknotification, 
  markallnotification 
} from "~/services/notificationservice";

import urls from "~/helpers/url_helpers";
import { notificationGet, notificationPost } from "~/services/api_services";

vi.mock("~/services/api_services", () => ({
  notificationGet: vi.fn(),
  notificationPost: vi.fn(),
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

global.cleanObject = vi.fn((obj) => obj);

describe("Notification Helper Functions", () => {
  const expectedConfig = {
    headers: { Authorization: `Bearer mock-access-token` },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getnotifications with the correct URL and config", async () => {
    const mockData = { PageNumber: 1 };
    notificationGet.mockResolvedValue({ data: "mock-response" });

    const response = await getnotifications(mockData);

    expect(notificationGet).toHaveBeenCalledWith(
      `${urls.GET_NOTIFICATION}?PageNumber=1`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call marknotification with correctly", async () => {
    const mockData = { id: "123" };
    notificationPost.mockResolvedValue({ success: true });

    const response = await marknotification(mockData);

    expect(notificationPost).toHaveBeenCalledWith(
      urls.MARK_NOTIFICATION,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ success: true });
  });

  it("should call markallnotification correctly", async () => {
    const mockData = { businessId: "abc" };
    notificationPost.mockResolvedValue({ success: true });

    const response = await markallnotification(mockData);

    expect(notificationPost).toHaveBeenCalledWith(
      urls.MARK_ALL_NOTIFICATION,
      mockData,
      expectedConfig
    );
  });
});