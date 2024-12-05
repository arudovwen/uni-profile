// orders_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ordersHelpers from "~/services/orderservice";
// import urls from "~/helpers/url_helpers";
import { get } from "~/helpers/api_helpers";
// import store from "~/store";
// import { cleanObject } from "~/utils/cleanObject";

// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
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
    PROCUREMENT_ORDERS: "mock-procurement-orders-url",
    BUYER_ORDER_TIMELINE: "mock-buyer-order-timeline-url",
    PROCUREMENT_ORDER_DETAILS: "mock-procurement-order-details-url",
  },
}));

describe("Orders Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call procurementorders with the correct URL and parameters", async () => {
    const mockParams = {
      Status: "pending",
      SortOrder: "asc",
      Search: "keyword",
      PageNumber: 1,
      PageSize: 10,
    };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await ordersHelpers.procurementorders(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call buyerordertimeline with the correct URL and parameters", async () => {
    const mockSalesOrderId = "abc123";
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await ordersHelpers.buyerordertimeline(mockSalesOrderId);

    expect(get).toHaveBeenCalledWith(
      "mock-buyer-order-timeline-url?salesorderId=abc123",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call procurementorderdetails with the correct URL and parameters", async () => {
    const mockPayload = {
      orderId: "order123",
      userId: "user456",
    };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await ordersHelpers.procurementorderdetails(mockPayload);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  // Add tests for other functions as needed
});
