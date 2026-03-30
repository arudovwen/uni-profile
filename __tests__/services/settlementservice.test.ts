// settlementservice.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as orderHelpers from "~/services/settlementservice";
import urls from "~/helpers/url_helpers";

// ✅ Mock the correct module with the correct function names
vi.mock("~/services/api_services", () => ({
  walletGet: vi.fn(),
  walletPost: vi.fn(),
  walletPut: vi.fn(),
  walletDelete: vi.fn(),
  // include others if imported elsewhere
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn(),
  put: vi.fn(),
}));

// ✅ Mock store so config is built with a predictable token
vi.mock("~/store", () => ({
  default: {
    getters: {
      accessToken: "mock-access-token",
    },
  },
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    VIEW_SETTLEMENT: "mock-view-settlement-url",
    AUTO_SETTLEMENT_VALUE: "mock-auto-settlement-value-url",
    ADD_SETTLEMENT: "mock-add-settlement-url",
    UPDATE_SETTLEMENT: "mock-update-settlement-url",
    DELETE_SETTLEMENT: "mock-delete-settlement-url",
    VALIDATE_ACCOUNT: "mock-validate-account-url",
    AUTO_SETTLEMENT: "mock-auto-settlement-url",
    GET_BANKS: "mock-get-banks-url",
  },
}));

// ✅ Import mocked functions AFTER vi.mock declarations
import { walletGet, walletPost, walletPut, walletDelete } from "~/services/api_services";

describe("Settlement Service Functions", () => {
  // The config the service builds at module load time using the mocked store
  const expectedConfig = {
    headers: { Authorization: "Bearer mock-access-token" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call viewSettlement with the correct URL and config", async () => {
    walletGet.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.viewSettlement();

    expect(walletGet).toHaveBeenCalledWith(
      "mock-view-settlement-url",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getAutoSettlement with the correct URL and config", async () => {
    walletGet.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.getAutoSettlement();

    expect(walletGet).toHaveBeenCalledWith(
      "mock-auto-settlement-value-url",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call addSettlement with the correct URL, data, and config", async () => {
    const mockData = { someData: "mock-data" };
    walletPost.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.addSettlement(mockData);

    expect(walletPost).toHaveBeenCalledWith(
      "mock-add-settlement-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateSettlement with the correct URL, data, and config", async () => {
    const mockData = { id: "mock-id", someData: "mock-data" };
    walletPut.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.updateSettlement(mockData);

    expect(walletPut).toHaveBeenCalledWith(
      "mock-update-settlement-url/mock-id",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call deleteSettlement with the correct URL and config", async () => {
    const mockId = "mock-settlement-id";
    walletDelete.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.deleteSettlement(mockId);

    expect(walletDelete).toHaveBeenCalledWith(
      `mock-delete-settlement-url/${mockId}`,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call autoSettlement with the correct URL, data, and config", async () => {
    const mockData = { someData: "mock-data" };
    walletPost.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.autoSettlement(mockData);

    expect(walletPost).toHaveBeenCalledWith(
      "mock-auto-settlement-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should return undefined if autoSettlement is called without data", async () => {
    const response = await orderHelpers.autoSettlement(null);

    expect(walletPost).not.toHaveBeenCalled();
    expect(response).toBeUndefined();
  });

  it("should call getBanks with the correct URL and config", async () => {
    walletGet.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.getBanks();

    expect(walletGet).toHaveBeenCalledWith(
      "mock-get-banks-url",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call validateAccount with the correct URL, data, and config", async () => {
    const mockData = { accountNumber: "0123456789", bankCode: "058" };
    walletPost.mockResolvedValue({ data: "mock-response" });

    const response = await orderHelpers.validateAccount(mockData);

    expect(walletPost).toHaveBeenCalledWith(
      "mock-validate-account-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});