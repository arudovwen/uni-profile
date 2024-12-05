// product_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as productHelpers from "~/services/productservices";
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
    ADD_PRODUCT: "mock-add-product-url",
    UPDATE_PRODUCT: "mock-update-product-url",
    UPDATE_PRODUCT_PROPERTIES: "mock-update-product-properties-url",
    PUBLISH_PRODUCT: "mock-publish-product-url",
    UPDATE_PRODUCT_DOCUMENTS: "mock-update-product-documents-url",
    UPDATE_PRODUCT_ADDITIONAL: "mock-update-product-additional-url",
    DELETE_PRODUCT: "mock-delete-product-url",
    GET_MARKETS: "mock-get-markets-url",
    GET_MARKET_MENU: "mock-get-market-menu-url",
    GET_MANUFACTURERS: "mock-get-manufacturers-url",
    GET_TECH: "mock-get-tech-url",
    GET_TECH_LEVEL: "mock-get-tech-level-url",
    GET_TECH_MENU: "mock-get-tech-menu-url",
    GET_PRODUCT: "mock-get-product-url",
    GET_PRODUCTS: "mock-get-products-url",
    GET_PRODUCTS_V2: "mock-get-products-v2-url",
    SUPPLIER_GET_PRODUCT: "mock-supplier-get-product-url",
    SUPPLIER_GET_PRODUCTS: "mock-supplier-get-products-url",
    GET_PRODUCERS: "mock-get-producers-url",
    SEARCH_MARKET: "mock-search-market-url",
    GET_SUPPLIERS: "mock-get-suppliers-url",
    GET_SUPPLIER_DETAIL: "mock-get-supplier-detail-url",
    GET_SUPPLIER_DOCUMENTS: "mock-get-supplier-documents-url",
    GET_PRODUCT_STATUS_COUNT: "mock-get-product-status-count-url",
    GET_MARKETS_LEVEL: "mock-get-markets-level-url",
    LIKE_PRODUCT: "mock-like-product-url",
    UNLIKE_PRODUCT: "mock-unlike-product-url",
    GET_LIKED_PRODUCT: "mock-get-liked-product-url",
    LIKE_SUPPLIER: "mock-like-supplier-url",
    UNLIKE_SUPPLIER: "mock-unlike-supplier-url",
    GET_LIKED_SUPPLIERS: "mock-get-liked-suppliers-url",
    ADD_PRODUCER: "mock-add-producer-url",
    EDIT_PRODUCER: "mock-edit-producer-url",
    GET_ALL_PRODUCT_REQUEST: "mock-get-all-product-request-url",
  },
}));

describe("Product Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call addProduct with the correct URL and data", async () => {
    const mockData = { SellerId: "mock-seller-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.addProduct(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-add-product-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateProduct with the correct URL and data", async () => {
    const mockData = { SellerId: "mock-seller-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.updateProduct(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-update-product-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateProperties with the correct URL and data", async () => {
    const mockData = { SellerId: "mock-seller-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.updateProperties(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-update-product-properties-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });



  it("should call updateDocuments with the correct URL and data", async () => {
    const mockData = { SellerId: "mock-seller-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.updateDocuments(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-update-product-documents-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateAdditional with the correct URL and data", async () => {
    const mockData = { SellerId: "mock-seller-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.updateAdditional(mockData);

    expect(post).toHaveBeenCalledWith(
      `mock-update-product-additional-url`,
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call deleteProduct with the correct URL and ID", async () => {
    const mockId = "mock-product-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.deleteProduct(mockId);

    expect(post).toHaveBeenCalledWith(
      `mock-delete-product-url/mock-product-id`,
      {},
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getMarkets with the correct URL and parameters", async () => {
    const mockParams = { PageNumber: 1, PageSize: 10 };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getMarkets(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-get-markets-url?PageNumber=1&PageSize=10`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getMarketmenu with the correct URL and parameters", async () => {
    const mockParams = {
      ShowSubMenu: false,
      PageNumber: 1,
      PageSize: 10,
      MarketId: "mock-market-id",
    };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getMarketmenu(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-get-market-menu-url?ShowSubMenu=false&PageNumber=1&PageSize=10&MarketId=mock-market-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getFeaturedManufacturer with the correct URL and parameters", async () => {
    const mockParams = { Search: "", PageNumber: 1, PageSize: 10 };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getFeaturedManufacturer(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-get-manufacturers-url?Search=&PageNumber=1&PageSize=10`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getTech with the correct URL and parameters", async () => {
    const mockParams = { Search: "", PageNumber: 1, PageSize: 10 };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getTech(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-get-tech-url?Search=&PageNumber=1&PageSize=10`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getTechLevels with the correct URL and no parameters", async () => {
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getTechLevels();

    expect(get).toHaveBeenCalledWith(`mock-get-tech-level-url`, expectedConfig);
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getTechmenu with the correct URL and parameters", async () => {
    const mockParams = {
      ShowSubMenu: false,
      PageNumber: 1,
      PageSize: 10,
      TechnologyId: "mock-tech-id",
    };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getTechmenu(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-get-tech-menu-url?ShowSubMenu=false&PageNumber=1&PageSize=10&TechnologyId=mock-tech-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getProduct with the correct URL and parameters", async () => {
    const mockParams = { productId: "mock-product-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getProduct(mockParams);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });

  // it("should call getProducts with the correct URL and parameters", async () => {
  //   const mockParams = { someParam: "mock-param", query:"", pagenumber:1, pageSize:10, Search:"" };
  //   const expectedConfig = {
  //     headers: { Authorization: `Bearer mock-access-token` },
  //   };

  //   get.mockResolvedValue({ data: "mock-response" });

  //   const response = await productHelpers.getProducts(mockParams);

  //   expect(get).toHaveBeenCalledWith(
  //     `mock-get-products-url?someParam=mock-param`,
  //     expectedConfig
  //   );
  //   expect(response).toEqual({ data: "mock-response" });
  // });

  it("should call getSupplierProduct with the correct URL and parameters", async () => {
    const mockParams = { productId: "mock-product-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await productHelpers.getSupplierProduct(mockParams);

    expect(get).toHaveBeenCalledWith(
      `mock-supplier-get-product-url?productId=mock-product-id`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});
