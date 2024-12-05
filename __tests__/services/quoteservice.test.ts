// order_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as orderHelpers from "~/services/quoteservice";
// import urls from "~/helpers/url_helpers";
import { get, post } from "~/helpers/api_helpers";
// import store from "~/store";
// import { withRetryHandling } from "~/utils/retry-handling";

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
    SELLER_QUOTES: "mock-seller-quotes-url",
    SELLER_QUOTE_DETAIL: "mock-seller-quote-detail-url",
    BUYER_QUOTES: "mock-buyer-quotes-url",
    BUYER_QUOTE_DETAIL: "mock-buyer-quote-detail-url",
    NEW_QUOTE: "mock-new-quote-url",
  },
}));

// Mock withRetryHandling function
vi.mock("~/utils/retry-handling", () => ({
  withRetryHandling: vi.fn((fn) => fn),
}));

describe("Order Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call sellerquotes with the correct URL and parameters", async () => {
    const mockParams = {
      Status: "mock-status",
      Search: "mock-search",
      PageNumber: 1,
      PageSize: 10,
      SortOrder: "asc",
      SellerId: "mock-seller-id",
    };
    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.sellerquotes(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call sellerquotedetail with the correct URL and ID", async () => {
    const mockId = "mock-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.sellerquotedetail(mockId);

    expect(get).toHaveBeenCalledWith(
      `mock-seller-quote-detail-url?id=mock-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call buyerquotes with the correct URL and parameters", async () => {
    const mockParams = {
      Status: "mock-status",
      Search: "mock-search",
      PageNumber: 1,
      PageSize: 10,
      SortOrder: "asc",
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.buyerquotes(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call buyerquotedetail with the correct URL and ID", async () => {
    const mockId = "mock-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.buyerquotedetail(mockId);

    expect(get).toHaveBeenCalledWith(
      `mock-buyer-quote-detail-url?id=mock-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call newquote with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.newquote(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-new-quote-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});
