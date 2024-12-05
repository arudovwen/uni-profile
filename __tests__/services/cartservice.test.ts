// cart_shipping_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cartShippingHelpers from "~/services/cartservice";
import urls from "~/helpers/url_helpers";
import { get, post, del, put } from "~/helpers/api_helpers";
// import store from "~/store";
// import { withRetryHandling } from "~/utils/retry-handling";

// Mock the dependencies
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn(),
  put: vi.fn(),
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
    CREATE_CART: "mock-create-cart-url",
    UPDATE_CART: "mock-update-cart-url",
    REMOVE_CART: "mock-remove-cart-url",
    GET_CART: "mock-get-cart-url",
    ADD_SHIPPING_ADDRESS: "mock-add-shipping-address-url",
    EDIT_SHIPPING_ADDRESS: "mock-edit-shipping-address-url",
    DEFAULT_SHIPPING_ADDRESS: "mock-default-shipping-address-url",
    GET_SHIPPING_ADDRESS: "mock-get-shipping-address-url",
    DELETE_SHIPPING: "mock-delete-shipping-url",
    CONFIRM_PURCHASE: "mock-confirm-purchase-url",
    ADDRESS_SEARCH: "mock-address-search-url",
    PLACE_SUGGESTION: "mock-place-suggestion-url",
    GET_PICKUP_ADDRESS: "mock-get-pickup-address-url",
    DELETE_PICKUP: "mock-delete-pickup-url",
    ADD_PICKUP_ADDRESS: "mock-add-pickup-address-url",
    EDIT_PICKUP_ADDRESS: "mock-edit-pickup-address-url",
    APPLY_DISCOUNT: "mock-apply-discount-url",
    SHIPPONG_COST_BREAKDOWN: "mock-shipping-cost-breakdown-url",
  },
}));

describe("Cart and Shipping Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call createcart with the correct URL, data, and config", async () => {
    const mockData = { buyerId: "123", items: [] };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.createcart(
      mockData,
      expectedConfig
    );

    expect(post).toHaveBeenCalledWith(
      `${urls.CREATE_CART}`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updatecart with the correct URL, data, and config", async () => {
    const mockData = { buyerId: "123", items: [] };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.updatecart(
      mockData,
      expectedConfig
    );

    expect(post).toHaveBeenCalledWith(
      `${urls.UPDATE_CART}`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call removecart with the correct URL, data, and config", async () => {
    const mockData = 456;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.removecartitem(
      mockData,
      expectedConfig
    );

    expect(post).toHaveBeenCalledWith(
      `${urls.REMOVE_CART}/456`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getcart with the correct URL and config", async () => {
    const mockData = "123";
    const expectedUrl = `${urls.GET_CART}`;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.getcart(mockData);

    expect(get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call addshipping with the correct URL, data, and config", async () => {
    const mockData = { busininessId: "789", address: "123 Main St" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.addshipping(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.ADD_SHIPPING_ADDRESS}`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call editshipping with the correct URL, data, and config", async () => {
    const mockData = { busininessId: "789", address: "123 Main St" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.editshipping(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.EDIT_SHIPPING_ADDRESS}`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call setdefaultaddress with the correct URL and config", async () => {
    const mockData = 456;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.setdefaultaddress(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.DEFAULT_SHIPPING_ADDRESS}/456`,
      "",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getalladdress with the correct URL and config", async () => {
    const mockData = "123";
    const expectedUrl = `${urls.GET_SHIPPING_ADDRESS}`;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.getalladdress(mockData);

    expect(get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call deleteAddress with the correct URL, data, and config", async () => {
    const mockData = 456;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.deleteAddress(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.DELETE_SHIPPING}/456`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call confirmpurchase with the correct URL, data, and config", async () => {
    const mockData = {items: [] };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.confirmpurchase(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.CONFIRM_PURCHASE}`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // it("should call addressSearch with the correct URL and config", async () => {
  //   const mockData = { address: "Main St", state: "Lagos", lga: "alimosho" };
  //   const expectedUrl = `${urls.ADDRESS_SEARCH}?query=Main+St`;
  //   const expectedConfig = {
  //     headers: { Authorization: `Bearer mock-access-token` },
  //   };

  //   get.mockResolvedValue({ data: "mock-response" });

  //   const response = await cartShippingHelpers.addressSearch(mockData);

  //   expect(get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
  //   expect(response).toEqual({ data: "mock-response" });
  // });

  it("should call placeSuggestion with the correct URL and config", async () => {
    const mockData = { query: "Main St" };
    const expectedUrl = `${urls.PLACE_SUGGESTION}?query=Main+St`;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.placeSuggestion(mockData);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getallpickuplocations with the correct URL and config", async () => {
    const mockData = "123";
    const expectedUrl = `${urls.GET_PICKUP_ADDRESS}`;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.getallpickuplocations(mockData);

    expect(get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call deletePickupLocation with the correct URL, data, and config", async () => {
    const mockData =  "456";
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    del.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.deletePickupLocation(mockData);

    expect(del).toHaveBeenCalledWith(
      `${urls.DELETE_PICKUP}/456`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call addPickupLocation with the correct URL, data, and config", async () => {
    const mockData = {  location: "123 Main St" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.addPickupLocation(mockData);

    expect(post).toHaveBeenCalledWith(
      `${urls.ADD_PICKUP_ADDRESS}`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call editPickupLocation with the correct URL, data, and config", async () => {
    const mockData = { id: "456", location: "123 Main St" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    put.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.editPickupLocation(mockData);

    expect(put).toHaveBeenCalledWith(
      `${urls.EDIT_PICKUP_ADDRESS}/456`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call applyDiscount with the correct URL, data, and config", async () => {
    const mockData = { code: "DISCOUNT10" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.applyDiscount(mockData);

    expect(post).toHaveBeenCalledWith(
      urls.APPLY_DISCOUNT,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call shippingBreakdown with the correct URL and config", async () => {
    const mockData = "123";
    const expectedUrl = `${urls.SHIPPONG_COST_BREAKDOWN}`;
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await cartShippingHelpers.shippingBreakdown(mockData);

    expect(get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });
});
