// orders_helpers.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as orderHelpers from "~/services/requestservice";
// import urls from "~/helpers/url_helpers";
import { get, post } from "~/helpers/api_helpers";
// import store from "~/store";
// import { withRetryHandling } from "~/utils/retry-handling";

vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("~/store", () => ({
  default: {
    getters: {
      accessToken: "mock-access-token",
      userId: 1,
    },
  },
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    SAMPLE_REQUESTS: "mock-sample-requests-url",
    SAMPLE_REQUEST_DETAILS: "mock-sample-request-details-url",
    SAMPLE_REQUESTS_COUNT: "mock-sample-requests-count-url",
    SAMPLE_REQUESTS_PRODUCTS: "mock-sample-requests-products-url",
    ADD_DOCUMENT_REQUEST: "mock-add-document-request-url",
    DOCUMENT_REQUESTS: "mock-document-requests-url",
    DOCUMENT_REQUEST_DETAILS: "mock-document-request-details-url",
    DOCUMENT_SET_CANCELLED: "mock-document-set-cancelled-url",
    SELLER_DOCUMENTS: "mock-seller-documents-url",
    SELLER_DOCUMENT_DETAILS: "mock-seller-document-details-url",
    SELLER_DOCUMENT_SET_CANCELLED: "mock-seller-document-set-cancelled-url",
  },
}));

// Mock withRetryHandling function
vi.mock("~/utils/retry-handling", () => ({
  withRetryHandling: vi.fn((fn) => fn),
}));

describe("Order Helper Functions", () => {
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test for samplerequests function
  it("should call samplerequests with the correct URL and parameters", async () => {
    const mockParams = {
      SortOrder: "asc",
      Search: "mock-search",
      PageNumber: 1,
      PageSize: 10,
      ProductId: "mock-product-id",
      ProducerId: "mock-producer-id",
      RequestStatus: "mock-status",
      SupplierId: "mock-supplier-id",
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.samplerequests(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for samplerequestdetails function
  it("should call samplerequestdetails with the correct URL and request ID", async () => {
    const mockRequestId = "mock-request-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.samplerequestdetails(mockRequestId);

    expect(get).toHaveBeenCalledWith(
      `mock-sample-request-details-url?requestId=mock-request-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for samplerequestcount function
  it("should call samplerequestcount with the correct URL", async () => {
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.samplerequestcount();

    expect(get).toHaveBeenCalledWith(
      `mock-sample-requests-count-url`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for samplerequestproducts function
  it("should call samplerequestproducts with the correct URL and parameters", async () => {
    const mockParams = {
      Search: "mock-search",
      PageNumber: 1,
      PageSize: 10,
    };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.samplerequestproducts(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-sample-requests-products-url?PageSize=10&PageNumber=1&Search=mock-search`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for adddocument function
  it("should call adddocument with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.adddocument(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-add-document-request-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for buyerdoc function
  it("should call buyerdoc with the correct URL and parameters", async () => {
    const mockParams = {
      SortOrder: "asc",
      Search: "mock-search",
      PageNumber: 1,
      PageSize: 10,
      ProductId: "mock-product-id",
      ProducerId: "mock-producer-id",
      RequestStatus: "mock-status",
      SupplierId: "mock-supplier-id",
    };
    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.buyerdoc(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for docdetails function
  it("should call docdetails with the correct URL and request ID", async () => {
    const mockRequestId = "mock-request-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.docdetails(mockRequestId);

    expect(get).toHaveBeenCalledWith(
      `mock-document-request-details-url?requestId=mock-request-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for setascancelled function
  it("should call setascancelled with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.setascancelled(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-document-set-cancelled-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for sellerdoc function
  it("should call sellerdoc with the correct URL and parameters", async () => {
    const mockParams = {
      SortOrder: "asc",
      Search: "mock-search",
      PageNumber: 1,
      PageSize: 10,
      ProductId: "mock-product-id",
      ProducerId: "mock-producer-id",
      RequestStatus: "mock-status",
      SupplierId: "mock-supplier-id",
    };
    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.sellerdoc(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for sellerdocdetails function
  it("should call sellerdocdetails with the correct URL and request ID", async () => {
    const mockRequestId = "mock-request-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.sellerdocdetails(mockRequestId);

    expect(get).toHaveBeenCalledWith(
      `mock-seller-document-details-url?requestId=mock-request-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  // Test for sellersetascancelled function
  it("should call sellersetascancelled with the correct URL and data", async () => {
    const mockData = { someData: "mock-data" };
    const expectedConfig = {
      headers: { Authorization: `Bearer ${mockAccessToken}` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.sellersetascancelled(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-seller-document-set-cancelled-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});
