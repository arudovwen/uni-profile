// orders.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as orderHelpers from "~/services/storefrontservice";
import urls from "~/helpers/url_helpers";
import { get, put } from "~/helpers/api_helpers";
// import { cleanObject } from "~/utils/cleanObject";

const cleanObject = vi.fn();
// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    STOREFRONT_ORDERS: "mock-view-settlement-url",
    GET_SHIPPING_DATA: "mock-auto-settlement-value-url",
    STOREFRONT_ORDER_DETAILS: "mock-add-settlement-url",
    UPDATE_ORDER_ITEM_STATUS: "mock-update-settlement-url",
  },
}));

describe("Orders API Functions", () => {
  const mockConfig = {
    headers: { Authorization: "Bearer " },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call storefrontorders with the correct URL and config", async () => {
    const mockData = { Search: "test", PageNumber: 1, PageSize: 10 };
    const expectedResponse = { data: "mock-response" };

    cleanObject.mockReturnValue(mockData);
    get.mockResolvedValue(expectedResponse);

    const response = await orderHelpers.storefrontorders(mockData);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual(expectedResponse);
  });

 

  it("should call storefrontorderdetails with the correct URL and config", async () => {
    const mockOrderId = "order123";
    const expectedResponse = { data: "mock-response" };

    get.mockResolvedValue(expectedResponse);

    const response = await orderHelpers.storefrontorderdetails(mockOrderId);

    expect(get).toHaveBeenCalledWith(
      `${urls.STOREFRONT_ORDER_DETAILS}?orderId=${mockOrderId}`,
      mockConfig
    );
    expect(response).toEqual(expectedResponse);
  });


});
